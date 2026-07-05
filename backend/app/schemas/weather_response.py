from pydantic import BaseModel


class WeatherResponse(BaseModel):
    region: str
    latitude: float
    longitude: float
    temperature_c: float
    feels_like_c: float
    humidity_percent: float
    observed_at: str
    source: str
