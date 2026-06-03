# Quick Start Guide

Get the Power Demand Prediction system running in 5 minutes!

## 🔧 Setup Instructions

### Prerequisites
- Python 3.9 or higher
- Node.js 14 or higher
- pip and npm

### Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

Expected output:
```
WARNING in app.py: This is a development server...
Running on http://127.0.0.1:5000
```

### Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

---

## ✅ Verification

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"healthy","forecaster_ready":false,"anomaly_detector_ready":false}`

2. **Frontend Loading**
   - Open http://localhost:3000 in your browser
   - Should see the Power Demand Predictor home page

3. **API Connection**
   - On frontend, system status should show "Not Ready" (models not trained yet)

---

## 📊 Test Run

### 1. Upload Sample Data

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@data/sample_demand_data.csv"
```

Expected response:
```json
{
  "message": "File uploaded successfully",
  "summary": {...}
}
```

Or use the web interface:
1. Go to http://localhost:3000/upload
2. Select `data/sample_demand_data.csv`
3. Click "Upload & Train Models"

### 2. Generate Forecast

```bash
curl -X POST http://localhost:5000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{"hours": 24}'
```

Or use web interface:
1. Go to http://localhost:3000/forecast
2. Select "Next 24 hours"
3. Click "Generate Forecast"

### 3. Detect Anomalies

```bash
curl -X POST http://localhost:5000/api/anomalies
```

Or use web interface:
1. Go to http://localhost:3000/anomalies
2. Click "Detect Anomalies"

---

## 🐛 Common Issues

### Backend won't start
```
Error: ModuleNotFoundError: No module named 'flask'
```
**Solution**: Make sure virtual environment is activated and dependencies installed:
```bash
pip install -r requirements.txt
```

### Frontend can't connect to backend
```
Error: Network Error
```
**Solution**: Ensure backend is running and CORS is enabled:
1. Backend should be running on http://localhost:5000
2. Check frontend `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Port already in use
```
Address already in use
```
**Solution**: Kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### npm install fails
```
Error: ERESOLVE could not resolve dependency
```
**Solution**: Use legacy peer deps flag:
```bash
npm install --legacy-peer-deps
npm start --legacy-peer-deps
```

---

## 📁 Project Structure

```
power-demand-prediction/
├── backend/               # Flask API server
│   ├── app.py            # Main application
│   ├── config.py         # Configuration
│   ├── requirements.txt   # Python packages
│   ├── src/
│   │   ├── api/          # API endpoints
│   │   ├── ml/           # ML models
│   │   └── utils/        # Utilities
│   └── models/           # Trained models (generated after first train)
│
├── frontend/             # React web app
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   └── styles/       # CSS
│   ├── public/           # Static files
│   └── package.json      # Node packages
│
├── data/                 # Sample datasets
├── docs/                 # Documentation
│   ├── API.md           # API reference
│   └── DEPLOYMENT.md    # Deployment guide
└── README.md            # Project documentation
```

---

## 📚 Next Steps

1. **Explore the code**: Check `backend/src/ml/` for ML models
2. **Customize models**: Edit `forecaster.py` and `anomaly_detector.py`
3. **Try different datasets**: Upload your own CSV files
4. **Deploy**: Follow `docs/DEPLOYMENT.md` to deploy to cloud

---

## 🎯 Example Workflow

```
1. Upload your electricity demand CSV file
   └─> System trains Random Forest & Isolation Forest models

2. System generates forecast for next 24-72 hours
   └─> Shows predictions in interactive chart

3. System detects anomalies in your data
   └─> Lists anomalies with severity levels

4. Export or download results
   └─> Ready for analysis and decision-making
```

---

## 🔗 Useful Links

- **Documentation**: `README.md`
- **API Reference**: `docs/API.md`
- **Deployment Guide**: `docs/DEPLOYMENT.md`
- **Flask Docs**: https://flask.palletsprojects.com/
- **React Docs**: https://react.dev/
- **scikit-learn**: https://scikit-learn.org/

---

## 💡 Tips

- **First time?** Upload `data/sample_demand_data.csv` to test
- **More data?** Upload 7+ days of data for better forecasts
- **Want to debug?** Check browser console (Ctrl+Shift+I) and terminal outputs
- **Need help?** Check existing issues in GitHub or create new one

---

## 🎓 Learning Resources

- ML Model Selection: Check `backend/src/ml/forecaster.py` and `anomaly_detector.py`
- Feature Engineering: Look at `data_processor.py`
- API Design: Review `backend/src/api/routes.py`
- UI Components: Check `frontend/src/components/`

---

**Ready to forecast electricity demand? Let's go! ⚡**

For detailed information, see `README.md` and `docs/` folder.
