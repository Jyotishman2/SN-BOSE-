# Clean Architecture Overview

## Project Structure (Clean & Simple)

```
power-demand-prediction/
│
├── backend/                          # Flask API Server (Python)
│   ├── app.py                        # Application entry point - Start here!
│   ├── config.py                     # Configuration management
│   ├── requirements.txt              # Install: pip install -r requirements.txt
│   │
│   └── src/
│       ├── api/
│       │   ├── routes.py            # 6 API endpoints
│       │   ├── validators.py        # Input validation
│       │   └── __init__.py
│       │
│       ├── ml/
│       │   ├── forecaster.py        # Random Forest model
│       │   ├── anomaly_detector.py  # Isolation Forest
│       │   ├── data_processor.py    # Feature engineering
│       │   └── __init__.py
│       │
│       ├── utils/
│       │   ├── logger.py            # Logging
│       │   ├── file_handler.py      # File operations
│       │   └── __init__.py
│       │
│       ├── constants.py             # Constants
│       └── __init__.py
│
├── frontend/                         # React Web App
│   ├── package.json                 # Install: npm install
│   ├── .env.example                 # Copy to .env
│   │
│   ├── public/
│   │   └── index.html              # HTML template
│   │
│   └── src/
│       ├── App.jsx                 # Main app - Start here!
│       ├── index.js                # React entry point
│       │
│       ├── components/
│       │   ├── Navigation.jsx      
│       │   ├── FileUpload.jsx      
│       │   ├── Chart.jsx           
│       │   ├── AnomalyAlerts.jsx   
│       │   └── Dashboard.jsx       
│       │
│       ├── pages/
│       │   ├── Home.jsx            
│       │   ├── Upload.jsx          
│       │   ├── Forecast.jsx        
│       │   └── Anomalies.jsx       
│       │
│       ├── services/
│       │   └── api.js              # API client
│       │
│       └── styles/
│           └── App.css             # All styling
│
├── data/
│   └── sample_demand_data.csv       # 96 sample records
│
├── docs/
│   └── API.md                       # API reference
│
├── .gitignore                       # Git ignore
├── README.md                        # Main documentation
├── SETUP.md                         # Quick start (5 min)
├── ARCHITECTURE.md                  # This file
├── QUICKSTART.md                    # Visual overview
├── CHECKLIST.md                     # Verification
└── PROJECT_SUMMARY.md               # Detailed summary
```

---

## Clean Architecture Principles

### Backend (Flask)

**Entry Point**: `backend/app.py`
```python
app = create_app('development')
app.run()
```

**Layer Structure**:
1. **Routes Layer** (`src/api/routes.py`)
   - HTTP request handling
   - Input validation
   - Response formatting

2. **Business Logic Layer** (`src/ml/`)
   - Forecaster: Demand prediction
   - AnomalyDetector: Anomaly detection
   - DataProcessor: Feature engineering

3. **Utility Layer** (`src/utils/`)
   - File handling
   - Logging
   - Common functions

4. **Configuration Layer** (`config.py`)
   - Environment-based settings
   - Model parameters

**No External Dependencies**:
- No Docker needed
- No special deployment files
- No database migrations
- Pure Python with scikit-learn

---

### Frontend (React)

**Entry Point**: `frontend/src/App.jsx`
```jsx
function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        ...
      </Routes>
    </Router>
  );
}
```

**Component Hierarchy**:
```
App (Router)
├── Navigation (Top bar)
├── Home (Landing page)
├── Upload (Page)
│   └── FileUpload (Component)
├── Forecast (Page)
│   ├── Chart (Component)
│   └── Controls
├── Anomalies (Page)
│   └── AnomalyAlerts (Component)
```

**Data Flow**:
```
User Action → Component → api.js → Backend → ML Model → Response → Chart/Table
```

---

## API Endpoints (6 Total)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | System status |
| `/api/upload` | POST | Upload CSV file |
| `/api/train` | POST | Train ML models |
| `/api/forecast` | POST | Predict demand |
| `/api/anomalies` | POST | Detect anomalies |
| `/api/datasets` | GET | List datasets |

**All endpoints** are in `backend/src/api/routes.py` (~200 lines)

---

## ML Pipeline

### 1. Data Upload & Processing
```
CSV File → Validation → Feature Engineering → Processed Data
                ↓
         data_processor.py
         • Parse timestamps
         • Engineer features
         • Handle missing values
```

### 2. Model Training
```
Processed Data → Split (80/20) → Train Models → Serialized Models
                               ↓
                         • Forecaster (RF)
                         • Anomaly Detector (IF)
```

### 3. Inference
```
New Data → Features → Models → Predictions/Scores → API Response
```

---

## Configuration Management

### Backend Config (`config.py`)

**Development**:
```python
FLASK_ENV = 'development'
DEBUG = True
UPLOAD_FOLDER = 'uploaded_files'
```

**Production** (when you deploy):
```python
FLASK_ENV = 'production'
DEBUG = False
SECRET_KEY = 'your-secret'
```

Switch via:
```bash
export FLASK_ENV=production
python app.py
```

### Frontend Config (`.env`)

```
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

---

## File Sizes

```
backend/
  app.py                     ~50 lines
  config.py                  ~40 lines
  src/api/routes.py          ~200 lines
  src/ml/forecaster.py       ~150 lines
  src/ml/anomaly_detector.py ~160 lines
  src/ml/data_processor.py   ~170 lines
  ────────────────────────────────────
  Total: ~1000 lines (clean code)

frontend/
  App.jsx                    ~50 lines
  src/components/            ~500 lines
  src/pages/                 ~400 lines
  src/styles/App.css         ~350 lines
  ────────────────────────────────────
  Total: ~1300 lines (clean code)
```

---

## Development Workflow

### 1. Backend Development
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Key files to modify**:
- `src/ml/forecaster.py` - Change forecasting algorithm
- `src/ml/anomaly_detector.py` - Adjust anomaly detection
- `src/api/routes.py` - Add new endpoints

### 2. Frontend Development
```bash
cd frontend
npm install
npm start
```

**Key files to modify**:
- `src/pages/` - Add new pages
- `src/components/` - Create reusable components
- `src/styles/App.css` - Update styling
- `src/services/api.js` - Update API calls

### 3. Testing
```bash
# Test backend API
curl http://localhost:5000/api/health

# Test with sample data
curl -F "file=@data/sample_demand_data.csv" http://localhost:5000/api/upload
```

---

## Deployment (Manual)

### Backend Deployment Steps

1. **Set environment variables**:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your-secret-key
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install gunicorn  # WSGI server
   ```

3. **Run with gunicorn**:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
   ```

4. **Use a reverse proxy** (nginx/Apache):
   - Point domain to `localhost:5000`
   - Handle SSL/TLS
   - Load balancing (if needed)

### Frontend Deployment Steps

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Serve the `build/` folder**:
   - Upload to web server
   - Or use `serve -s build`
   - Point domain to this server

3. **Set API endpoint**:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

---

## Adding Features

### Add New API Endpoint

1. Create handler in `src/api/routes.py`:
```python
@api_bp.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    # Your logic here
    return jsonify({'result': 'success'}), 200
```

2. Add to frontend `src/services/api.js`:
```javascript
export const myEndpoint = async (params) => {
  const response = await api.post('/my-endpoint', params);
  return response.data;
};
```

3. Use in React component:
```jsx
const handleClick = async () => {
  const result = await myEndpoint({...});
  // Use result
};
```

---

## Common Tasks

### Change Forecasting Algorithm

Edit `backend/src/ml/forecaster.py`:
```python
# Change from Random Forest to XGBoost
from xgboost import XGBRegressor

self.model = XGBRegressor(...)  # Instead of RandomForestRegressor
```

### Add More Features to Charts

Edit `frontend/src/components/Chart.jsx`:
```jsx
datasets: [
  {label: 'Current', data: [...], ...},
  {label: 'Historical', data: [...], ...},  // Add new
  {label: 'Forecast', data: [...], ...},
]
```

### Change UI Styling

Edit `frontend/src/styles/App.css`:
```css
/* Modify colors, fonts, sizes, etc. */
.btn { background-color: #your-color; }
```

---

## Database Integration (Optional)

Currently uses CSV files. To add database:

1. **Install database driver**:
   ```bash
   pip install psycopg2  # PostgreSQL
   pip install pymongo   # MongoDB
   ```

2. **Create data layer**:
   ```
   backend/src/db/
   ├── __init__.py
   ├── connection.py
   └── queries.py
   ```

3. **Modify routes** to use database instead of CSV

---

## Performance Tips

### Backend
- Add caching: `pip install flask-caching`
- Use Redis for model caching
- Implement pagination for large datasets
- Add background jobs: `celery`

### Frontend
- Code splitting: Use `React.lazy()`
- Lazy load images
- Minimize bundle size
- Enable gzip compression

---

## Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Use HTTPS/SSL
- [ ] Validate all inputs
- [ ] Sanitize file uploads
- [ ] Add authentication (JWT)
- [ ] Rate limiting on endpoints
- [ ] CORS properly configured
- [ ] Environment variables not in code

---

## Monitoring & Logging

### Backend Logging
```
backend/
├── app.log          # Auto-generated
└── src/utils/logger.py
```

View logs:
```bash
tail -f backend/app.log
```

### Frontend Errors
- Check browser console: F12
- Check network requests: Network tab
- Use React DevTools extension

---

## Clean Code Principles Used

✓ **Modular**: Separate concerns (api, ml, utils)
✓ **Simple**: No unnecessary complexity
✓ **Documented**: Clear file structure
✓ **Testable**: Each module is independent
✓ **Scalable**: Easy to add features
✓ **No bloat**: Only essential dependencies

---

## Next Steps

1. **Understand the code**:
   - Read `backend/app.py`
   - Read `frontend/src/App.jsx`
   - Explore `src/ml/` for ML logic

2. **Customize**:
   - Modify models
   - Add features
   - Update UI

3. **Deploy**:
   - Follow deployment steps above
   - Monitor with logs
   - Scale as needed

---

**Clean. Simple. Ready to deploy.** ⚡
