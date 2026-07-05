from typing import List, Optional

from pydantic import BaseModel


class ForecastPoint(BaseModel):
    datetime: str
    predicted_demand_mw: float
    is_anomaly: bool
    confidence_low: Optional[float] = None
    confidence_high: Optional[float] = None


class ForecastResponse(BaseModel):
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
