from typing import List, Optional

from pydantic import BaseModel


class ForecastPoint(BaseModel):
    datetime: str
    predicted_demand_mw: float
    is_anomaly: bool
    confidence_low: Optional[float] = None
    confidence_high: Optional[float] = None


class ForecastHistoryPoint(BaseModel):
    datetime: str
    actual_demand_mw: float


class ForecastSummary(BaseModel):
    next_hour: float
    peak: float
    minimum: float
    average: float


class ForecastResponse(BaseModel):
    forecast_start: str
    horizon: int
    predictions: List[ForecastPoint]
    summary: ForecastSummary
    history: List[ForecastHistoryPoint] = []
    predicted_demand_mw: float
    is_anomaly: bool
    confidence: Optional[dict] = None
    forecast: List[ForecastPoint]


class AnnualForecastPoint(BaseModel):
    month: str
    average_demand_mw: float
    peak_demand_mw: float


class AnnualForecastResponse(BaseModel):
    year: int
    source: str
    monthly_forecast: List[AnnualForecastPoint]
