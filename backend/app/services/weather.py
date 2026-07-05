from __future__ import annotations

import json
from dataclasses import dataclass
from urllib.parse import urlencode
from urllib.request import urlopen

from app.schemas.weather_response import WeatherResponse

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


@dataclass(frozen=True)
class Region:
    name: str
    latitude: float
    longitude: float


REGIONS = {
    "guwahati": Region("Guwahati", 26.1445, 91.7362),
    "assam": Region("Guwahati, Assam", 26.1445, 91.7362),
    "shillong": Region("Shillong, Meghalaya", 25.5788, 91.8933),
    "meghalaya": Region("Shillong, Meghalaya", 25.5788, 91.8933),
    "imphal": Region("Imphal, Manipur", 24.8170, 93.9368),
    "manipur": Region("Imphal, Manipur", 24.8170, 93.9368),
    "aizawl": Region("Aizawl, Mizoram", 23.7307, 92.7173),
    "mizoram": Region("Aizawl, Mizoram", 23.7307, 92.7173),
    "agartala": Region("Agartala, Tripura", 23.8315, 91.2868),
    "tripura": Region("Agartala, Tripura", 23.8315, 91.2868),
    "itanagar": Region("Itanagar, Arunachal Pradesh", 27.0844, 93.6053),
    "arunachal": Region("Itanagar, Arunachal Pradesh", 27.0844, 93.6053),
    "kohima": Region("Kohima, Nagaland", 25.6751, 94.1086),
    "nagaland": Region("Kohima, Nagaland", 25.6751, 94.1086),
    "gangtok": Region("Gangtok, Sikkim", 27.3314, 88.6138),
    "sikkim": Region("Gangtok, Sikkim", 27.3314, 88.6138),
    "northeast": Region("North-Eastern Region", 25.5736, 93.2473),
    "north-east": Region("North-Eastern Region", 25.5736, 93.2473),
    "ner": Region("North-Eastern Region", 25.5736, 93.2473),
}


def supported_regions() -> list[str]:
    return sorted(REGIONS.keys())


def get_current_weather(region_key: str = "guwahati") -> WeatherResponse:
    key = region_key.strip().lower()
    region = REGIONS.get(key)
    if region is None:
        supported = ", ".join(supported_regions())
        raise ValueError(f"Unsupported region '{region_key}'. Supported regions: {supported}")

    query = urlencode(
        {
            "latitude": region.latitude,
            "longitude": region.longitude,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature",
            "timezone": "auto",
        }
    )
    with urlopen(f"{OPEN_METEO_URL}?{query}", timeout=10) as response:
        payload = json.loads(response.read().decode("utf-8"))

    current = payload.get("current") or {}
    return WeatherResponse(
        region=region.name,
        latitude=region.latitude,
        longitude=region.longitude,
        temperature_c=round(float(current["temperature_2m"]), 2),
        feels_like_c=round(float(current["apparent_temperature"]), 2),
        humidity_percent=round(float(current["relative_humidity_2m"]), 2),
        observed_at=str(current["time"]),
        source="Open-Meteo",
    )
