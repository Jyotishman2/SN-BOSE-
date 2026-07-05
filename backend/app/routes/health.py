from fastapi import APIRouter

from app.services.predictor import predictor

router = APIRouter()


@router.get("/health")
def health_check() -> dict:
    return {
        "status": "ok",
        "model_loaded": predictor.is_loaded,
        "feature_count": len(predictor.feature_columns),
    }

