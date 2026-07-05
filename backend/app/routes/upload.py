from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.predictor import predictor

router = APIRouter()


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)) -> dict:
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    try:
        content = await file.read()
        rows = predictor.predict_csv(content)
        return {"rows": rows, "count": len(rows)}
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"CSV prediction failed: {exc}") from exc

