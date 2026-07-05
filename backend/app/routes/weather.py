from fastapi import APIRouter, HTTPException, Query

from app.schemas.weather_response import WeatherResponse
from app.services.weather import get_current_weather, supported_regions

router = APIRouter()


@router.get("/weather/current", response_model=WeatherResponse)
def current_weather(region: str = Query("guwahati", description="Guwahati, northeast, or a North-East state/capital.")) -> WeatherResponse:
    try:
        return get_current_weather(region)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Weather service failed: {exc}") from exc


@router.get("/weather/regions")
def weather_regions() -> dict[str, list[str]]:
    return {"regions": supported_regions()}
