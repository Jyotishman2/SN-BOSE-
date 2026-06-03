# Constants for the application

# Model parameters
DEFAULT_FORECAST_HOURS = 24
FORECAST_HOURS_OPTIONS = [24, 48, 72]
ANOMALY_CONTAMINATION = 0.1

# File upload
MAX_UPLOAD_SIZE_MB = 50
ALLOWED_EXTENSIONS = ['csv']

# API response codes
SUCCESS = 200
CREATED = 201
BAD_REQUEST = 400
NOT_FOUND = 404
SERVER_ERROR = 500

# Error messages
ERROR_NO_FILE = "No file provided"
ERROR_INVALID_FILE_TYPE = "Invalid file type. Only CSV files allowed"
ERROR_FILE_TOO_LARGE = "File size exceeds maximum allowed size"
ERROR_NO_DATA = "No valid data found in file"
ERROR_MODEL_NOT_FOUND = "Model not found"

# Sample dataset paths
SAMPLE_DATASETS = {
    'sample1': 'data/sample_demand_data.csv'
}
