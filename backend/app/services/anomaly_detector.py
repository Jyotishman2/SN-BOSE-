from __future__ import annotations

import io
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

from app.services.preprocessing import (
    TARGET,
    feature_columns,
    load_csv_frame,
)
from app.services.predictor import predictor

ANOMALY_MODEL_PATH = Path(
    os.getenv(
        "ANOMALY_MODEL_PATH",
        Path(__file__).resolve().parents[1]
        / "models"
        / "anomaly_model.pkl",
    )
)


class AnomalyDetector:
    def __init__(self) -> None:
        self.model = None
        self.feature_columns: list[str] = []

    def _fit_if_needed(self, df: pd.DataFrame) -> None:
        if self.model is not None:
            return

        if ANOMALY_MODEL_PATH.exists():
            bundle = joblib.load(ANOMALY_MODEL_PATH)
            self.model = bundle["model"]
            self.feature_columns = bundle["feature_columns"]
            return

        self.feature_columns = feature_columns(df)

        self.model = IsolationForest(
            contamination=0.03,
            random_state=42,
        )

        self.model.fit(df[self.feature_columns])

        ANOMALY_MODEL_PATH.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        joblib.dump(
            {
                "model": self.model,
                "feature_columns": self.feature_columns,
            },
            ANOMALY_MODEL_PATH,
        )

    def detect(self, content: bytes) -> list[dict]:
        # Load uploaded CSV
        df = load_csv_frame(io.BytesIO(content))

        # Load/train anomaly model
        self._fit_if_needed(df)

        # Isolation Forest anomaly scores
        scores = self.model.decision_function(
            df[self.feature_columns]
        )

        labels = self.model.predict(
            df[self.feature_columns]
        )

        # Generate demand predictions using LightGBM
        predictions = predictor.model.predict(
            df[predictor.feature_columns]
        )

        # Build response
        result = pd.DataFrame()

        result["datetime"] = df["datetime"].astype(str)
        result["actual_demand_mw"] = np.round(
            df[TARGET], 2
        )

        result["predicted_demand_mw"] = np.round(
            predictions, 2
        )

        result["temp_ne"] = df["temp_ne"]
        result["humidity_ne"] = df["humidity_ne"]

        result["anomaly_score"] = np.round(
            scores, 4
        )

        result["is_anomaly"] = labels == -1

        return result.to_dict(orient="records")


anomaly_detector = AnomalyDetector()