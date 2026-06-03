from src.utils import get_logger

logger = get_logger(__name__)

def validate_forecast_request(data):
    """Validate forecast API request"""
    errors = []
    
    if not data:
        errors.append("Request body is empty")
        return False, errors
    
    if 'hours' not in data:
        errors.append("'hours' field is required")
    else:
        if not isinstance(data['hours'], int):
            errors.append("'hours' must be an integer")
        elif data['hours'] not in [24, 48, 72]:
            errors.append("'hours' must be 24, 48, or 72")
    
    return len(errors) == 0, errors

def validate_anomaly_request(data):
    """Validate anomaly detection request"""
    errors = []
    
    if not data:
        errors.append("Request body is empty")
        return False, errors
    
    if 'threshold' in data:
        if not isinstance(data['threshold'], (int, float)):
            errors.append("'threshold' must be a number")
        elif not (0 <= data['threshold'] <= 1):
            errors.append("'threshold' must be between 0 and 1")
    
    return len(errors) == 0, errors

def validate_file_upload(file_obj):
    """Validate uploaded file"""
    errors = []
    
    if not file_obj:
        errors.append("No file provided")
        return False, errors
    
    if file_obj.filename == '':
        errors.append("File name is empty")
        return False, errors
    
    # Check extension
    if '.' not in file_obj.filename:
        errors.append("File must have an extension")
        return False, errors
    
    ext = file_obj.filename.rsplit('.', 1)[1].lower()
    if ext != 'csv':
        errors.append("Only CSV files are allowed")
        return False, errors
    
    return True, errors
