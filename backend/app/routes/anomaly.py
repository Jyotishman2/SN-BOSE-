from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.anomaly_detector import anomaly_detector

router = APIRouter()


@router.post("/anomaly")
async def detect_anomalies(file: UploadFile = File(...)) -> dict:
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    try:
        content = await file.read()
        rows = anomaly_detector.detect(content)
        return {"rows": rows, "count": len(rows), "anomalies": sum(1 for row in rows if row["is_anomaly"])}
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {exc}") from exc

