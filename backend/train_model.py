from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import lightgbm as lgb
import numpy as np
import optuna
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import TimeSeriesSplit

from app.services.preprocessing import TARGET, feature_columns, load_csv_frame


def train(data_path: Path, model_path: Path, trials: int) -> None:
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

    def objective(trial: optuna.Trial) -> float:
        params = {
            "n_estimators": trial.suggest_int("n_estimators", 300, 2000, step=100),
            "learning_rate": trial.suggest_float("learning_rate", 0.005, 0.2, log=True),
            "max_depth": trial.suggest_int("max_depth", 4, 12),
            "num_leaves": trial.suggest_int("num_leaves", 15, 255),
            "min_child_samples": trial.suggest_int("min_child_samples", 5, 100),
            "subsample": trial.suggest_float("subsample", 0.5, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.5, 1.0),
            "reg_alpha": trial.suggest_float("reg_alpha", 1e-3, 10, log=True),
            "reg_lambda": trial.suggest_float("reg_lambda", 1e-3, 10, log=True),
            "random_state": 42,
            "n_jobs": -1,
            "verbose": -1,
        }
        scores = []
        for train_idx, val_idx in TimeSeriesSplit(n_splits=5).split(x_train):
            model = lgb.LGBMRegressor(**params)
            model.fit(
                x_train.iloc[train_idx],
                y_train.iloc[train_idx],
                eval_set=[(x_train.iloc[val_idx], y_train.iloc[val_idx])],
                callbacks=[lgb.early_stopping(50, verbose=False)],
            )
            scores.append(mean_absolute_error(y_train.iloc[val_idx], model.predict(x_train.iloc[val_idx])))
        return float(np.mean(scores))

    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=trials, show_progress_bar=True)

    params = study.best_params | {"random_state": 42, "n_jobs": -1, "verbose": -1}
    final_model = lgb.LGBMRegressor(**params)
    final_model.fit(x_train, y_train, eval_set=[(x_test, y_test)], callbacks=[lgb.early_stopping(50, verbose=False)])
    predictions = final_model.predict(x_test)
    residuals = y_test.to_numpy() - predictions
    metrics = {
        "mae": round(float(mean_absolute_error(y_test, predictions)), 3),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test, predictions))), 3),
        "mape": round(float(np.mean(np.abs((y_test - predictions) / y_test)) * 100), 3),
        "r2": round(float(r2_score(y_test, predictions)), 4),
        "best_optuna_mae": round(float(study.best_value), 3),
    }
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": final_model,
            "feature_columns": cols,
            "metrics": metrics,
            "residual_std": float(np.std(residuals)),
            "best_params": study.best_params,
        },
        model_path,
    )
    print(f"Saved model to {model_path}")
    print(metrics)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=Path("../hourlyLoadData_NE_weather_with_holiday.csv"))
    parser.add_argument("--model", type=Path, default=Path("app/models/lightgbm_model.pkl"))
    parser.add_argument("--trials", type=int, default=50)
    args = parser.parse_args()
    train(args.data, args.model, args.trials)
