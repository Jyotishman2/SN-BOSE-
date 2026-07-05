# NER Electricity Demand Forecasting App

Production-ready full-stack app generated from `model.ipynb` for North-Eastern Region electricity demand forecasting.

## What Is Included

- FastAPI backend with `/api/health`, `/api/forecast`, `/api/upload`, and `/api/anomaly`
- Notebook-matched feature engineering: calendar features, cyclical encodings, lag features, and rolling statistics
- LightGBM model loading with automatic bootstrap training when `lightgbm_model.pkl` is missing
- Automatic lag and rolling feature generation from the bundled historical dataset for manual forecasts
- Next-year monthly demand prediction endpoint and frontend section
- Offline Optuna training script for tuned model artifacts
- Next.js 15 App Router frontend with TypeScript, Tailwind CSS, Framer Motion, Recharts, React Hook Form, and Axios
- CSV batch prediction, anomaly review, report download, and environment variable support

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The first API startup trains and saves `backend/app/models/lightgbm_model.pkl` if no model artifact exists.

Manual forecasts only need datetime, weather, and holiday inputs. If `recent_demands` or explicit lag fields are not supplied, the API derives the required lag and rolling demand features from `DATA_PATH`.

Useful forecast endpoints:

```text
POST /api/forecast
GET  /api/forecast/next-year
GET  /api/weather/current?region=guwahati
GET  /api/weather/regions
```

For Optuna tuning:

```bash
cd backend
python train_model.py --data ../hourlyLoadData_NE_weather_with_holiday.csv --model app/models/lightgbm_model.pkl --trials 50
```

## Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend expects the backend at `NEXT_PUBLIC_API_BASE_URL`.

If you prefer npm, use `npm install` and `npm run dev`.

## CSV Format

Uploads should include:

```text
datetime,North-Eastern Region Hourly Demand,temp_ne,humidity_ne,feels_like_ne,is_holiday
```

## Deployment

- Render backend: create a Web Service from `backend/`, install with `pip install -r requirements.txt`, and start with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Render frontend: create a Static Site or Web Service from `frontend/`, build with `npm install && npm run build`, and set `NEXT_PUBLIC_API_BASE_URL` to the Render backend URL.
- Backend environment: set `DATA_PATH`, `MODEL_PATH`, and `ANOMALY_MODEL_PATH` if your Render layout differs from the defaults. Persist `backend/app/models` if you want to keep trained artifacts across restarts.

## Push to GitHub

The repository includes a root `.gitignore` for local dependencies, build output, virtual environments, Python caches, environment files, notebook checkpoints, and generated model artifacts.

Before pushing:

```bash
git init
git add .
git status
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Do not commit `.env`, `frontend/node_modules`, `frontend/.next`, backend virtual environments, or generated `.pkl` model files. Keep `.env.example`, `requirements.txt`, `package.json`, `pnpm-lock.yaml`, and the dataset CSV so others can run the app and regenerate models.
