from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ForecastRequest(BaseModel):
    datetime: datetime
    temp_ne: float = Field(..., description="Temperature for North-Eastern Region.")
    humidity_ne: float = Field(..., ge=0, le=100)
    feels_like_ne: float
    is_holiday: int = Field(0, ge=0, le=1)
    recent_demands: Optional[List[float]] = Field(
        None,
        description="Chronological hourly demand history. Provide at least 336 values for exact notebook features.",
    )
    lag_1h: Optional[float] = None
    lag_24h: Optional[float] = None
    lag_48h: Optional[float] = None
    lag_168h: Optional[float] = None
    lag_336h: Optional[float] = None
    horizon_hours: int = Field(24, ge=1, le=168)
