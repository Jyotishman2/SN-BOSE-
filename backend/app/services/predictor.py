from __future__ import annotations

import io
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from app.schemas.forecast_request import ForecastRequest
from app.schemas.forecast_response import AnnualForecastPoint, AnnualForecastResponse, ForecastPoint, ForecastResponse
from app.services.preprocessing import (
    TARGET,
    ManualWeather,
    build_manual_features,
    feature_columns,
    lag_history_from_fields,
    load_csv_frame,
)

ROOT_DIR = Path(__file__).resolve().parents[3]
MODEL_PATH = Path(os.getenv("MODEL_PATH", Path(__file__).resolve().parents[1] / "models" / "lightgbm_model.pkl"))
DATA_PATH = Path(os.getenv("DATA_PATH", ROOT_DIR / "hourlyLoadData_NE_weather_with_holiday.csv"))


class DemandPredictor:
    def __init__(self) -> None:
        self.model = None
        self.feature_columns: list[str] = []
        self.metrics: dict[str, float] = {}
        self.residual_std = 0.0
        self.source_frame: pd.DataFrame | None = None
        self.weather_profile: pd.DataFrame | None = None
        self._load_or_train()

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def _load_or_train(self) -> None:
        if DATA_PATH.exists():
            self.source_frame = load_csv_frame(DATA_PATH)
            self.weather_profile = self._build_weather_profile(self.source_frame)

        if MODEL_PATH.exists():
            bundle = joblib.load(MODEL_PATH)
            if isinstance(bundle, dict):
                self.model = bundle["model"]
                self.feature_columns = bundle["feature_columns"]
                self.metrics = bundle.get("metrics", {})
                self.residual_std = float(bundle.get("residual_std", 0.0))
            else:
                self.model = bundle
            return

        if not DATA_PATH.exists():
            raise FileNotFoundError(f"Model artifact not found and training CSV is missing: {DATA_PATH}")

        df = self.source_frame if self.source_frame is not None else load_csv_frame(DATA_PATH)
        split_date = pd.Timestamp("2023-01-01")
        train = df[df["datetime"] < split_date].copy()
        test = df[df["datetime"] >= split_date].copy()
        if train.empty or test.empty:
            split_index = int(len(df) * 0.8)
            train, test = df.iloc[:split_index], df.iloc[split_index:]

        self.feature_columns = feature_columns(df)
        x_train, y_train = train[self.feature_columns], train[TARGET]
        x_test, y_test = test[self.feature_columns], test[TARGET]
        self.model = LGBMRegressor(
            n_estimators=900,
            learning_rate=0.03,
            max_depth=8,
            num_leaves=63,
            min_child_samples=30,
            subsample=0.9,
            colsample_bytree=0.9,
            reg_alpha=0.01,
            reg_lambda=0.1,
            random_state=42,
            n_jobs=-1,
            verbose=-1,
        )
        self.model.fit(x_train, y_train)
        pred = self.model.predict(x_test)
        residuals = y_test.to_numpy() - pred
        self.residual_std = float(np.std(residuals))
        self.metrics = {
            "mae": round(float(mean_absolute_error(y_test, pred)), 3),
            "rmse": round(float(np.sqrt(mean_squared_error(y_test, pred))), 3),
            "mape": round(float(np.mean(np.abs((y_test - pred) / y_test)) * 100), 3),
            "r2": round(float(r2_score(y_test, pred)), 4),
        }
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(
            {
                "model": self.model,
                "feature_columns": self.feature_columns,
                "metrics": self.metrics,
                "residual_std": self.residual_std,
            },
            MODEL_PATH,
        )

    def predict_manual(self, payload: ForecastRequest) -> ForecastResponse:
        history = self._history_for_payload(payload)
        start_time = self._normalize_timestamp(pd.Timestamp(payload.datetime))
        weather = ManualWeather(
            datetime=start_time,
            temp_ne=payload.temp_ne,
            humidity_ne=payload.humidity_ne,
            feels_like_ne=payload.feels_like_ne,
            is_holiday=payload.is_holiday,
        )
        points: list[ForecastPoint] = []
        running_history = list(history)
        for step in range(payload.horizon_hours):
            step_weather = ManualWeather(
                datetime=start_time + pd.Timedelta(hours=step),
                temp_ne=weather.temp_ne,
                humidity_ne=weather.humidity_ne,
                feels_like_ne=weather.feels_like_ne,
                is_holiday=weather.is_holiday,
            )
            features = build_manual_features(step_weather, running_history, self.feature_columns)
            prediction = float(self.model.predict(features)[0])
            running_history.append(prediction)
            is_anomaly = self._is_anomaly(prediction, running_history)
            points.append(
                ForecastPoint(
                    datetime=step_weather.datetime.isoformat(),
                    predicted_demand_mw=round(prediction, 2),
                    is_anomaly=is_anomaly,
                    confidence_low=round(prediction - 1.96 * self.residual_std, 2) if self.residual_std else None,
                    confidence_high=round(prediction + 1.96 * self.residual_std, 2) if self.residual_std else None,
                )
            )
        first = points[0]
        return ForecastResponse(
            predicted_demand_mw=first.predicted_demand_mw,
            is_anomaly=first.is_anomaly,
            confidence={"method": "residual_std_95_interval", "std": round(self.residual_std, 3)} if self.residual_std else None,
            forecast=points,
        )

    def predict_next_year(self) -> AnnualForecastResponse:
        if self.source_frame is None or self.weather_profile is None:
            raise ValueError("Training dataset is required for next-year forecasting.")
        latest_data_year = int(self.source_frame["datetime"].dt.year.max())
        next_year = max(pd.Timestamp.now().year, latest_data_year) + 1
        start = pd.Timestamp(year=next_year, month=1, day=1)
        running_history = self._default_history(start)
        rows: list[dict] = []

        for month in range(1, 13):
            hours = pd.date_range(start=pd.Timestamp(year=next_year, month=month, day=15), periods=24, freq="h")
            for ts in hours:
                weather = self._weather_for_timestamp(ts)
                features = build_manual_features(weather, running_history, self.feature_columns)
                prediction = float(self.model.predict(features)[0])
                running_history.append(prediction)
                rows.append({"datetime": ts, "predicted_demand_mw": prediction})

        frame = pd.DataFrame(rows)
        monthly = (
            frame.assign(month=frame["datetime"].dt.strftime("%b"))
            .groupby("month", sort=False)["predicted_demand_mw"]
            .agg(["mean", "max"])
            .reset_index()
        )
        points = [
            AnnualForecastPoint(
                month=str(row["month"]),
                average_demand_mw=round(float(row["mean"]), 2),
                peak_demand_mw=round(float(row["max"]), 2),
            )
            for _, row in monthly.iterrows()
        ]
        return AnnualForecastResponse(
            year=next_year,
            source="LightGBM representative 24-hour simulation for each month",
            monthly_forecast=points,
        )

    def predict_csv(self, content: bytes) -> list[dict]:
        df = load_csv_frame(io.BytesIO(content))
        features = df[self.feature_columns]
        predictions = self.model.predict(features)
        result = df[["datetime"]].copy()
        result["predicted_demand_mw"] = np.round(predictions, 2)
        if TARGET in df.columns:
            result["actual_demand_mw"] = df[TARGET].round(2)
            residual = df[TARGET] - predictions
            result["absolute_error_mw"] = np.round(np.abs(residual), 2)
            threshold = max(3 * float(np.std(residual)), self.residual_std * 3)
            result["is_anomaly"] = np.abs(residual) > threshold
        else:
            result["is_anomaly"] = False
        result["datetime"] = result["datetime"].astype(str)
        return result.to_dict(orient="records")

    def _is_anomaly(self, prediction: float, history: list[float]) -> bool:
        window = np.array(history[-168:], dtype=float)
        std = float(np.std(window))
        if std == 0:
            return False
        return abs(prediction - float(np.mean(window))) > 3 * std

    def _history_for_payload(self, payload: ForecastRequest) -> list[float]:
        if payload.recent_demands and len(payload.recent_demands) >= 336:
            return list(map(float, payload.recent_demands))
        lag_values = [payload.lag_1h, payload.lag_24h, payload.lag_48h, payload.lag_168h, payload.lag_336h]
        if all(value is not None for value in lag_values):
            return lag_history_from_fields(lag_values)
        return self._default_history(self._normalize_timestamp(pd.Timestamp(payload.datetime)))

    def _default_history(self, forecast_start: pd.Timestamp) -> list[float]:
        if self.source_frame is None:
            raise ValueError("Historical demand dataset is required when lag values are not provided.")
        forecast_start = self._normalize_timestamp(forecast_start)
        frame = self.source_frame[self.source_frame["datetime"] < forecast_start].tail(336)
        if len(frame) < 336:
            frame = self.source_frame.tail(336)
        if len(frame) < 336:
            raise ValueError("Historical dataset must contain at least 336 hourly demand rows.")
        return frame[TARGET].astype(float).tolist()

    def _build_weather_profile(self, frame: pd.DataFrame) -> pd.DataFrame:
        return (
            frame.groupby(["month", "hour"], as_index=False)
            .agg(
                temp_ne=("temp_ne", "mean"),
                humidity_ne=("humidity_ne", "mean"),
                feels_like_ne=("feels_like_ne", "mean"),
                is_holiday=("is_holiday", lambda values: int(round(float(values.mean())))),
            )
        )

    def _weather_for_timestamp(self, ts: pd.Timestamp) -> ManualWeather:
        if self.weather_profile is None:
            raise ValueError("Weather profile is unavailable.")
        match = self.weather_profile[(self.weather_profile["month"] == ts.month) & (self.weather_profile["hour"] == ts.hour)]
        if match.empty:
            raise ValueError(f"Weather profile is missing month/hour combination for {ts.month}/{ts.hour}.")
        row = match.iloc[0]
        return ManualWeather(
            datetime=ts,
            temp_ne=float(row["temp_ne"]),
            humidity_ne=float(row["humidity_ne"]),
            feels_like_ne=float(row["feels_like_ne"]),
            is_holiday=int(row["is_holiday"]),
        )

    def _normalize_timestamp(self, timestamp: pd.Timestamp) -> pd.Timestamp:
        if timestamp.tzinfo is not None:
            return timestamp.tz_convert(None)
        return timestamp


predictor = DemandPredictor()
