from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Sequence

import numpy as np
import pandas as pd

TARGET = "North-Eastern Region Hourly Demand"
DATETIME_COL = "datetime"
BASE_COLUMNS = [DATETIME_COL, TARGET, "temp_ne", "humidity_ne", "feels_like_ne", "is_holiday"]
LAG_WINDOWS = [1, 24, 48, 168, 336]
ROLLING_WINDOWS = [24, 168]


@dataclass(frozen=True)
class ManualWeather:
    datetime: pd.Timestamp
    temp_ne: float
    humidity_ne: float
    feels_like_ne: float
    is_holiday: int


def load_csv_frame(path_or_buffer) -> pd.DataFrame:
    df = pd.read_csv(path_or_buffer)
    missing = [col for col in BASE_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"CSV is missing required columns: {', '.join(missing)}")
    return prepare_feature_frame(df)


def prepare_feature_frame(df: pd.DataFrame, include_target: bool = True) -> pd.DataFrame:
    frame = df.copy()
    if DATETIME_COL not in frame.columns:
        raise ValueError("Data must include a datetime column.")
    frame[DATETIME_COL] = pd.to_datetime(frame[DATETIME_COL], errors="coerce")
    if frame[DATETIME_COL].isna().any():
        raise ValueError("Data contains invalid datetime values.")
    frame = frame.sort_values(DATETIME_COL).reset_index(drop=True)

    frame["hour"] = frame[DATETIME_COL].dt.hour
    frame["day_of_week"] = frame[DATETIME_COL].dt.dayofweek
    frame["day_of_month"] = frame[DATETIME_COL].dt.day
    frame["month"] = frame[DATETIME_COL].dt.month
    frame["quarter"] = frame[DATETIME_COL].dt.quarter
    frame["year"] = frame[DATETIME_COL].dt.year
    frame["is_weekend"] = (frame[DATETIME_COL].dt.dayofweek >= 5).astype(int)

    frame["hour_sin"] = np.sin(2 * np.pi * frame["hour"] / 24)
    frame["hour_cos"] = np.cos(2 * np.pi * frame["hour"] / 24)
    frame["dow_sin"] = np.sin(2 * np.pi * frame["day_of_week"] / 7)
    frame["dow_cos"] = np.cos(2 * np.pi * frame["day_of_week"] / 7)
    frame["month_sin"] = np.sin(2 * np.pi * frame["month"] / 12)
    frame["month_cos"] = np.cos(2 * np.pi * frame["month"] / 12)

    if include_target and TARGET in frame.columns:
        for lag in LAG_WINDOWS:
            frame[f"lag_{lag}h"] = frame[TARGET].shift(lag)
        frame["rolling_mean_24h"] = frame[TARGET].shift(1).rolling(24).mean()
        frame["rolling_mean_168h"] = frame[TARGET].shift(1).rolling(168).mean()
        frame["rolling_std_24h"] = frame[TARGET].shift(1).rolling(24).std()
        frame["rolling_max_24h"] = frame[TARGET].shift(1).rolling(24).max()
        frame["rolling_min_24h"] = frame[TARGET].shift(1).rolling(24).min()

    return frame.dropna().reset_index(drop=True)


def feature_columns(df: pd.DataFrame) -> list[str]:
    return [col for col in df.columns if col not in [DATETIME_COL, TARGET]]


def build_manual_features(weather: ManualWeather, recent_demands: Sequence[float], feature_order: Sequence[str]) -> pd.DataFrame:
    if len(recent_demands) < 336:
        raise ValueError("At least 336 historical hourly demand values are required.")
    history = list(map(float, recent_demands))
    ts = pd.Timestamp(weather.datetime)
    row = {
        DATETIME_COL: ts,
        "temp_ne": weather.temp_ne,
        "humidity_ne": weather.humidity_ne,
        "feels_like_ne": weather.feels_like_ne,
        "is_holiday": int(weather.is_holiday),
    }
    feature_df = prepare_calendar_features(pd.DataFrame([row]))
    feature_df["lag_1h"] = history[-1]
    feature_df["lag_24h"] = history[-24]
    feature_df["lag_48h"] = history[-48]
    feature_df["lag_168h"] = history[-168]
    feature_df["lag_336h"] = history[-336]
    last_24 = pd.Series(history[-24:])
    last_168 = pd.Series(history[-168:])
    feature_df["rolling_mean_24h"] = last_24.mean()
    feature_df["rolling_mean_168h"] = last_168.mean()
    feature_df["rolling_std_24h"] = last_24.std()
    feature_df["rolling_max_24h"] = last_24.max()
    feature_df["rolling_min_24h"] = last_24.min()
    return feature_df[list(feature_order)]


def prepare_calendar_features(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    frame[DATETIME_COL] = pd.to_datetime(frame[DATETIME_COL])
    frame["hour"] = frame[DATETIME_COL].dt.hour
    frame["day_of_week"] = frame[DATETIME_COL].dt.dayofweek
    frame["day_of_month"] = frame[DATETIME_COL].dt.day
    frame["month"] = frame[DATETIME_COL].dt.month
    frame["quarter"] = frame[DATETIME_COL].dt.quarter
    frame["year"] = frame[DATETIME_COL].dt.year
    frame["is_weekend"] = (frame[DATETIME_COL].dt.dayofweek >= 5).astype(int)
    frame["hour_sin"] = np.sin(2 * np.pi * frame["hour"] / 24)
    frame["hour_cos"] = np.cos(2 * np.pi * frame["hour"] / 24)
    frame["dow_sin"] = np.sin(2 * np.pi * frame["day_of_week"] / 7)
    frame["dow_cos"] = np.cos(2 * np.pi * frame["day_of_week"] / 7)
    frame["month_sin"] = np.sin(2 * np.pi * frame["month"] / 12)
    frame["month_cos"] = np.cos(2 * np.pi * frame["month"] / 12)
    return frame


def lag_history_from_fields(fields: Iterable[float]) -> list[float]:
    lag_1h, lag_24h, lag_48h, lag_168h, lag_336h = map(float, fields)
    history = [lag_336h] * 336
    history[-168] = lag_168h
    history[-48] = lag_48h
    history[-24] = lag_24h
    history[-1] = lag_1h
    return history

