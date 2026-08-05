from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, model_validator


class ForecastRequest(BaseModel):
    datetime: Optional[datetime] = None
    region: str = "guwahati"
    horizon: int = Field(24, ge=1, le=24)
    horizon_hours: Optional[int] = Field(None, ge=1, le=24)
    temp_ne: float = Field(22.0, description="Temperature for North-Eastern Region.")
    humidity_ne: float = Field(72.0, ge=0, le=100)
    feels_like_ne: float = Field(23.0, description="Feels-like temperature for North-Eastern Region.")
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    feels_like: Optional[float] = None
    holiday: Optional[bool] = None
    is_holiday: Optional[int] = Field(0, ge=0, le=1)
    recent_demands: Optional[List[float]] = Field(
        None,
        description="Chronological hourly demand history. Provide at least 336 values for exact notebook features.",
    )
    lag_1h: Optional[float] = None
    lag_24h: Optional[float] = None
    lag_48h: Optional[float] = None
    lag_168h: Optional[float] = None
    lag_336h: Optional[float] = None

    @model_validator(mode="after")
    def normalize_fields(self) -> "ForecastRequest":
        if self.horizon_hours is not None:
            self.horizon = self.horizon_hours
        if self.temperature is not None:
            self.temp_ne = self.temperature
        if self.humidity is not None:
            self.humidity_ne = self.humidity
        if self.feels_like is not None:
            self.feels_like_ne = self.feels_like
        if self.holiday is not None:
            self.is_holiday = int(self.holiday)
        return self
