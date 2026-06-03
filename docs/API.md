# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-render-app.onrender.com/api`

## Authentication
Currently, no authentication is required. (Consider adding JWT auth for production)

## Response Format
All responses are in JSON format.

### Success Response
```json
{
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Endpoints

### 1. Health Check
Check if the system is running.

**Request:**
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "forecaster_ready": true,
  "anomaly_detector_ready": true
}
```

---

### 2. Upload File
Upload a CSV file for analysis.

**Request:**
```
POST /upload
Content-Type: multipart/form-data

file: <CSV file>
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file_path": "uploaded_files/20240601_120000_abc123_data.csv",
  "summary": {
    "rows": 168,
    "columns": 2,
    "date_range": {
      "start": "2024-01-01T00:00:00",
      "end": "2024-01-08T00:00:00"
    },
    "demand_stats": {
      "mean": 1850.5,
      "min": 1390,
      "max": 2600,
      "std": 350.2
    }
  }
}
```

**Errors:**
- `400`: No file provided or invalid format
- `413`: File too large (max 50MB)

---

### 3. Train Models
Train forecaster and anomaly detector on uploaded data.

**Request:**
```
POST /train
```

**Response:**
```json
{
  "message": "Models trained successfully",
  "forecaster_score": 0.8752,
  "anomaly_detector_ready": true
}
```

**Errors:**
- `400`: No data available for training
- `500`: Training failed

---

### 4. Get Forecast
Generate demand forecast for next N hours.

**Request:**
```
POST /forecast
Content-Type: application/json

{
  "hours": 24
}
```

**Parameters:**
- `hours` (required): 24, 48, or 72

**Response:**
```json
{
  "forecast": [
    {
      "timestamp": "2024-01-09T00:00:00",
      "demand": 1850.5,
      "hours_ahead": 1
    },
    {
      "timestamp": "2024-01-09T01:00:00",
      "demand": 1825.3,
      "hours_ahead": 2
    }
  ],
  "hours": 24,
  "count": 24
}
```

**Errors:**
- `400`: Invalid hours parameter or model not trained
- `500`: Forecast generation failed

---

### 5. Detect Anomalies
Detect anomalies in the uploaded data.

**Request:**
```
POST /anomalies
Content-Type: application/json

{
  "threshold": 0.6
}
```

**Parameters:**
- `threshold` (optional): Anomaly score threshold (0-1)

**Response:**
```json
{
  "summary": {
    "total_samples": 168,
    "anomaly_count": 12,
    "anomaly_percentage": 7.14,
    "top_anomalies": [
      {
        "timestamp": "2024-01-03T14:00:00",
        "demand": 2850.5,
        "anomaly_score": -0.85
      }
    ]
  },
  "anomalies": [
    {
      "timestamp": "2024-01-03T14:00:00",
      "demand": 2850.5,
      "anomaly_score": -0.85,
      "severity": "high"
    },
    {
      "timestamp": "2024-01-04T08:00:00",
      "demand": 1200.0,
      "anomaly_score": -0.62,
      "severity": "medium"
    }
  ]
}
```

**Errors:**
- `400`: Invalid threshold or model not trained
- `500`: Anomaly detection failed

---

### 6. List Datasets
Get list of available sample datasets.

**Request:**
```
GET /datasets
```

**Response:**
```json
{
  "datasets": [
    {
      "name": "sample1",
      "path": "data/sample_demand_data.csv"
    }
  ]
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - File uploaded |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Endpoint doesn't exist |
| 413 | Payload Too Large - File too big |
| 500 | Internal Server Error - Server error |

---

## Example Usage

### Using cURL

**Upload file:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@data/sample_demand_data.csv"
```

**Get forecast:**
```bash
curl -X POST http://localhost:5000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{"hours": 24}'
```

**Detect anomalies:**
```bash
curl -X POST http://localhost:5000/api/anomalies \
  -H "Content-Type: application/json"
```

### Using Python

```python
import requests

API_BASE = "http://localhost:5000/api"

# Upload file
with open("data.csv", "rb") as f:
    files = {"file": f}
    response = requests.post(f"{API_BASE}/upload", files=files)
    print(response.json())

# Train models
response = requests.post(f"{API_BASE}/train")
print(response.json())

# Get forecast
response = requests.post(f"{API_BASE}/forecast", json={"hours": 24})
print(response.json())

# Detect anomalies
response = requests.post(f"{API_BASE}/anomalies")
print(response.json())
```

---

## Rate Limiting

Currently no rate limiting. Consider adding for production:
- 100 requests per minute per IP
- 10 file uploads per hour per IP

---

## CORS

CORS is enabled for all origins in development. For production, set `ALLOWED_ORIGINS` in environment.

---

## Future Enhancements

- [ ] Authentication (JWT/API keys)
- [ ] Database storage instead of in-memory
- [ ] Model versioning and history
- [ ] Advanced filtering and analysis
- [ ] Export forecasts to PDF/CSV
- [ ] Scheduled predictions
- [ ] Comparison with actual vs predicted
