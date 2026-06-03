import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from src.utils import setup_logger
from src.api import api_bp, load_models

# Setup logger
logger = setup_logger('power_demand_app')

def create_app(config_name=None):
    """Application factory"""
    
    # Determine config
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Create necessary directories
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploaded_files'), exist_ok=True)
    os.makedirs(app.config.get('MODEL_FOLDER', 'models'), exist_ok=True)
    
    # Register blueprints
    app.register_blueprint(api_bp)
    
    # Load pre-trained models
    load_models(app.config.get('MODEL_FOLDER', 'models'))
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'message': 'Power Demand Prediction & Anomaly Detection API',
            'version': '1.0',
            'endpoints': {
                'health': '/api/health',
                'upload': '/api/upload (POST)',
                'forecast': '/api/forecast (POST)',
                'anomalies': '/api/anomalies (POST)',
                'train': '/api/train (POST)',
                'datasets': '/api/datasets (GET)'
            }
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    logger.info(f"Flask app created with config: {config_name}")
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
