from functools import lru_cache
from fastapi import APIRouter, HTTPException

from app.schemas.forecast_request import ForecastRequest
from app.schemas.forecast_response import AnnualForecastResponse, ForecastResponse
from app.services.predictor import predictor

router = APIRouter()

_forecast_cache: dict[str, ForecastResponse] = {}

@router.post("/forecast", response_model=ForecastResponse)
def forecast(payload: ForecastRequest) -> ForecastResponse:
    try:
        # Cache key based on the payload string
        cache_key = payload.model_dump_json() if hasattr(payload, "model_dump_json") else payload.json()
        if cache_key in _forecast_cache:
            return _forecast_cache[cache_key]
            
        result = predictor.predict_manual(payload)
        
        # Simple LRU-ish cache limiting
        if len(_forecast_cache) >= 100:
            _forecast_cache.pop(next(iter(_forecast_cache)))
        _forecast_cache[cache_key] = result
        
        return result
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {exc}") from exc


@lru_cache(maxsize=1)
def _get_next_year_cached() -> AnnualForecastResponse:
    return predictor.predict_next_year()


@router.get("/forecast/next-year", response_model=AnnualForecastResponse)
def forecast_next_year() -> AnnualForecastResponse:
    try:
        return _get_next_year_cached()
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Next-year forecast failed: {exc}") from exc
