
# Power Demand Prediction & Anomaly Detection System

A clean, simple full-stack web application for electricity demand forecasting and real-time anomaly detection using machine learning. No Docker, no bloat - just pure Python & React.

## 🎯 Architecture

```
Power Demand Prediction
├── Backend (Flask + scikit-learn)
│   └── ~1000 lines of clean Python
├── Frontend (React 18)
│   └── ~1300 lines of clean JSX
└── Sample Dataset included
```

**No Docker. No Kubernetes. No unnecessary configs. Just code ready to deploy.**

- **Demand Forecasting**: Predict electricity consumption for the next 24, 48, or 72 hours using Random Forest
- **Anomaly Detection**: Identify unusual consumption patterns using Isolation Forest algorithm
- **CSV Upload**: Import your own electricity data for analysis
- **Interactive Dashboard**: Visualize forecasts and anomalies with charts and tables
- **Simple UI**: Clean and intuitive interface for easy use
- **RESTful API**: Well-documented Flask API endpoints

## 🚀 Quick Start (5 Minutes)

### Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
✓ Server runs on `http://localhost:5000`

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
✓ App opens on `http://localhost:3000`

### Test
1. Upload `data/sample_demand_data.csv`
2. Generate forecast
3. Detect anomalies
4. Done! ⚡

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload CSV file |
| POST | `/api/train` | Train models |
| POST | `/api/forecast` | Get demand forecast |
| POST | `/api/anomalies` | Detect anomalies |
| GET | `/api/datasets` | List datasets |

## 📊 CSV Format

Your CSV file should have these columns:

```csv
timestamp,demand
2024-01-01 00:00:00,1500
2024-01-01 01:00:00,1480
2024-01-01 02:00:00,1450
```

- **timestamp**: ISO format (YYYY-MM-DD HH:MM:SS)
- **demand**: Numeric value in MW

**Minimum requirements**: At least 48 hours of data

## 🚀 Deployment

### Backend (Python)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

### Frontend (React)
```bash
npm run build
# Serve the build/ folder on your web server
```

**See `ARCHITECTURE.md` for detailed manual deployment steps.**

## 📖 Usage Guide

### 1. Upload Data
- Go to **Upload** page
- Select your CSV file with electricity demand data
- System automatically trains models

### 2. View Forecasts
- Go to **Forecast** page
- Select forecast period (24/48/72 hours)
- Click "Generate Forecast"
- View predictions in interactive chart

### 3. Check Anomalies
- Go to **Anomalies** page
- Click "Detect Anomalies"
- Review detected anomalies with severity levels

## 🤖 Machine Learning Models

### Demand Forecaster
- **Algorithm**: Random Forest Regressor
- **Features**: Temporal (hour, day, month), rolling statistics, lag features
- **Training Split**: 80% train, 20% test
- **Output**: Demand predictions for 24-72 hours

### Anomaly Detector
- **Algorithm**: Isolation Forest
- **Contamination**: 10% (tunable)
- **Output**: Anomaly scores and severity levels (low/medium/high)

## 📈 Sample Datasets

Place sample CSV files in the `data/` directory. Example:
```
data/
├── sample_demand_data.csv
└── your_custom_data.csv
```

## 🐛 Troubleshooting

**Frontend can't connect to backend?**
- Ensure backend is running on http://localhost:5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify CORS is enabled in Flask

**Models not training?**
- Ensure CSV has required columns (timestamp, demand)
- Check data has at least 48 hours of measurements
- Verify no missing or corrupted data

**Forecast generation slow?**
- Large datasets take longer to process
- Consider filtering to recent data
- Check system resources

## 📝 License

This project is open source. Feel free to modify and deploy!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include logs and error messages

---

**Happy forecasting! ⚡**
