from flask import Blueprint, request, jsonify, current_app
import os
import logging
from src.ml import DataProcessor, DemandForecaster, AnomalyDetector
from src.utils import save_uploaded_file, get_logger
from src.api.validators import validate_file_upload, validate_forecast_request, validate_anomaly_request
from src.constants import *

logger = get_logger(__name__)

# Create blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Global model instances
forecaster = DemandForecaster()
anomaly_detector = AnomalyDetector(contamination=ANOMALY_CONTAMINATION)
processor = DataProcessor()

def load_models(model_dir):
    """Load pre-trained models if they exist"""
    try:
        if os.path.exists(f"{model_dir}/forecaster_model.pkl"):
            forecaster.load_model(model_dir)
        if os.path.exists(f"{model_dir}/anomaly_model.pkl"):
            anomaly_detector.load_model(model_dir)
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.warning(f"Could not load models: {str(e)}")

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'forecaster_ready': forecaster.is_trained,
        'anomaly_detector_ready': anomaly_detector.is_trained
    }), SUCCESS

@api_bp.route('/upload', methods=['POST'])
def upload_file():
    """Upload CSV file for analysis"""
    try:
        # Validate file
        if 'file' not in request.files:
            return jsonify({'error': ERROR_NO_FILE}), BAD_REQUEST
        
        file = request.files['file']
        is_valid, errors = validate_file_upload(file)
        
        if not is_valid:
            return jsonify({'errors': errors}), BAD_REQUEST
        
        # Save file
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploaded_files')
        file_path = save_uploaded_file(file, upload_folder)
        
        if not file_path:
            return jsonify({'error': 'Failed to save file'}), SERVER_ERROR
        
        # Process and analyze
        processor.load_csv(file_path)
        if not processor.validate_data():
            return jsonify({'error': ERROR_NO_DATA}), BAD_REQUEST
        
        processor.engineer_features()
        summary = processor.get_summary()
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file_path': file_path,
            'summary': summary
        }), CREATED
    
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        return jsonify({'error': str(e)}), SERVER_ERROR

@api_bp.route('/forecast', methods=['POST'])
def forecast():
    """Get demand forecast"""
    try:
        data = request.get_json(silent=True) or {}
        
        # Validate request
        is_valid, errors = validate_forecast_request(data)
        if not is_valid:
            return jsonify({'errors': errors}), BAD_REQUEST
        
        hours = data.get('hours', DEFAULT_FORECAST_HOURS)
        
        # Check if forecaster is ready
        if not forecaster.is_trained:
            return jsonify({'error': 'Forecaster model not trained yet. Please upload and train on data first.'}), BAD_REQUEST
        
        # Get forecast data
        df = processor.get_dataframe()
        if df is None or len(df) == 0:
            return jsonify({'error': 'No data available for forecasting'}), BAD_REQUEST
        
        # Generate forecast
        forecast_data = forecaster.forecast_next_hours(df, hours)
        
        if forecast_data is None:
            return jsonify({'error': 'Failed to generate forecast'}), SERVER_ERROR
        
        # Format response
        forecast_response = []
        for item in forecast_data:
            forecast_response.append({
                'timestamp': item['timestamp'].isoformat(),
                'demand': float(item['demand']),
                'hours_ahead': item['hours_ahead']
            })
        
        return jsonify({
            'forecast': forecast_response,
            'hours': hours,
            'count': len(forecast_response)
        }), SUCCESS
    
    except Exception as e:
        logger.error(f"Error in forecast: {str(e)}")
        return jsonify({'error': str(e)}), SERVER_ERROR

@api_bp.route('/anomalies', methods=['POST'])
def detect_anomalies():
    """Detect anomalies in data"""
    try:
        data = request.get_json(silent=True) or {}
        
        # Validate request
        is_valid = True
        errors = []
        if not is_valid:
            return jsonify({'errors': errors}), BAD_REQUEST
        
        # Check if anomaly detector is ready
        if not anomaly_detector.is_trained:
            return jsonify({'error': 'Anomaly detector model not trained yet. Please upload and train on data first.'}), BAD_REQUEST
        
        # Get processed data
        df = processor.get_dataframe()
        if df is None or len(df) == 0:
            return jsonify({'error': 'No data available for anomaly detection'}), BAD_REQUEST
        
        # Detect anomalies
        result_df = anomaly_detector.detect_anomalies(df)
        
        if result_df is None:
            return jsonify({'error': 'Failed to detect anomalies'}), SERVER_ERROR
        
        # Get summary
        summary = anomaly_detector.get_anomalies_summary(result_df)
        anomalies = anomaly_detector.get_anomaly_details(result_df, limit=50)
        
        return jsonify({
            'summary': summary,
            'anomalies': anomalies
        }), SUCCESS
    
    except Exception as e:
        logger.error(f"Error detecting anomalies: {str(e)}")
        return jsonify({'error': str(e)}), SERVER_ERROR

@api_bp.route('/train', methods=['POST'])
def train_models():
    """Train models on uploaded data"""
    
    try:
        # Get processed data
        df = processor.get_dataframe()
        if df is None or len(df) == 0:
            return jsonify({'error': 'No data available for training'}), BAD_REQUEST
        
        # Prepare features
        X, feature_names = processor.get_features()
        y = processor.get_target()
        
        if X is None or y is None or len(X) == 0:
            return jsonify({'error': 'Invalid data for training'}), BAD_REQUEST
        
        # Train forecaster
        forecaster.feature_names = feature_names
        print("X Shape:", X.shape)
        print("Feature Names:", feature_names)
        print("Y Shape:", y.shape)
        forecast_score = forecaster.train(X, y)
        print("FORECAST TRAINED:", forecaster.is_trained)
        
        # Train anomaly detector
        anomaly_detector.train(X)
        print("ANOMALY TRAINED:", anomaly_detector.is_trained)
        
        # Save models
        model_dir = current_app.config.get('MODEL_FOLDER', 'models')
        os.makedirs(model_dir, exist_ok=True)
        forecaster.save_model(model_dir)
        anomaly_detector.save_model(model_dir)
        
        return jsonify({
            'message': 'Models trained successfully',
            'forecaster_score': forecast_score,
            'anomaly_detector_ready': True
        }), SUCCESS
    
    except Exception as e:
        logger.error(f"Error training models: {str(e)}")
        return jsonify({'error': str(e)}), SERVER_ERROR

@api_bp.route('/datasets', methods=['GET'])
def list_datasets():
    """List available sample datasets"""
    try:
        datasets = []
        for name, path in SAMPLE_DATASETS.items():
            if os.path.exists(path):
                datasets.append({
                    'name': name,
                    'path': path
                })
        
        return jsonify({'datasets': datasets}), SUCCESS
    except Exception as e:
        logger.error(f"Error listing datasets: {str(e)}")
        return jsonify({'error': str(e)}), SERVER_ERROR

@api_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), NOT_FOUND

@api_bp.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), SERVER_ERROR
