from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import RandomizedSearchCV, TimeSeriesSplit

from app.services.preprocessing import TARGET, feature_columns, load_csv_frame


def train(data_path: Path, model_path: Path, cv_splits: int) -> None:
    df = load_csv_frame(data_path)
    split_date = pd.Timestamp("2023-01-01")
    train_df = df[df["datetime"] < split_date].copy()
    test_df = df[df["datetime"] >= split_date].copy()
    if train_df.empty or test_df.empty:
        split_index = int(len(df) * 0.8)
        train_df, test_df = df.iloc[:split_index], df.iloc[split_index:]

    cols = feature_columns(df)
    x_train, y_train = train_df[cols], train_df[TARGET]
    x_test, y_test = test_df[cols], test_df[TARGET]

    param_grid = {
        "n_estimators": [300, 500],
        "learning_rate": [0.01, 0.05],
        "max_depth": [6, 10],
        "num_leaves": [31, 127],
        "min_child_samples": [10, 50],
        "subsample": [0.7, 1.0],
        "colsample_bytree": [0.7, 1.0],
        "reg_alpha": [1e-2, 1.0],
        "reg_lambda": [1e-2, 1.0],
    }

    cv = TimeSeriesSplit(n_splits=cv_splits)
    search = RandomizedSearchCV(
        estimator=lgb.LGBMRegressor(random_state=42, n_jobs=-1, verbose=-1),
        param_distributions=param_grid,
        n_iter=25,
        scoring="neg_mean_absolute_error",
        cv=cv,
        n_jobs=-1,
        verbose=2,
        refit=True,
        random_state=42,
    )
    search.fit(x_train, y_train)

    best_params = search.best_params_
    best_cv_mae = round(-float(search.best_score_), 3)

    final_model = lgb.LGBMRegressor(**best_params, random_state=42, n_jobs=-1, verbose=-1)
    final_model.fit(x_train, y_train, eval_set=[(x_test, y_test)], callbacks=[lgb.early_stopping(50, verbose=False)])
    predictions = final_model.predict(x_test)
    residuals = y_test.to_numpy() - predictions
    metrics = {
        "mae": round(float(mean_absolute_error(y_test, predictions)), 3),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test, predictions))), 3),
        "mape": round(float(np.mean(np.abs((y_test - predictions) / y_test)) * 100), 3),
        "r2": round(float(r2_score(y_test, predictions)), 4),
        "best_cv_mae": best_cv_mae,
    }
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": final_model,
            "feature_columns": cols,
            "metrics": metrics,
            "residual_std": float(np.std(residuals)),
            "best_params": best_params,
        },
        model_path,
    )
    print(f"Saved model to {model_path}")
    print(metrics)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=Path("../hourlyLoadData_NE_weather_with_holiday.csv"))
    parser.add_argument("--model", type=Path, default=Path("app/models/lightgbm_model.pkl"))
    parser.add_argument("--cv-splits", type=int, default=5)
    args = parser.parse_args()
    train(args.data, args.model, args.cv_splits)
