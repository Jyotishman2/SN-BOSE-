from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import anomaly, forecast, health, upload, weather

app = FastAPI(
    title="NER Electricity Demand Forecasting API",
    description="LightGBM forecasting service for North-Eastern Region electricity demand.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(forecast.router, prefix="/api", tags=["forecast"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(anomaly.router, prefix="/api", tags=["anomaly"])
app.include_router(weather.router, prefix="/api", tags=["weather"])
