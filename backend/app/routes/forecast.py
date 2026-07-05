from fastapi import APIRouter, HTTPException

from app.schemas.forecast_request import ForecastRequest
from app.schemas.forecast_response import AnnualForecastResponse, ForecastResponse
from app.services.predictor import predictor

router = APIRouter()


@router.post("/forecast", response_model=ForecastResponse)
def forecast(payload: ForecastRequest) -> ForecastResponse:
    try:
        return predictor.predict_manual(payload)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {exc}") from exc


@router.get("/forecast/next-year", response_model=AnnualForecastResponse)
def forecast_next_year() -> AnnualForecastResponse:
    try:
        return predictor.predict_next_year()
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Next-year forecast failed: {exc}") from exc
