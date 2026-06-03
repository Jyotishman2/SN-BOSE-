import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { healthCheck } from '../services/api';

const Home = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const health = await healthCheck();
      setStatus(health);
      setLoading(false);
    };
    checkHealth();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to Power Demand Prediction System</h2>
        <p style={{ marginBottom: '1rem' }}>
          This system helps you forecast electricity demand and detect anomalies in power consumption data.
        </p>
        
        <h3>How to use:</h3>
        <ol style={{ marginLeft: '2rem' }}>
          <li>Go to <strong>Upload</strong> and upload your CSV file with demand data</li>
          <li>The system will automatically train ML models on your data</li>
          <li>Visit <strong>Forecast</strong> to get demand predictions for next 24-72 hours</li>
          <li>Check <strong>Anomalies</strong> to see unusual consumption patterns</li>
        </ol>

        <h3 style={{ marginTop: '1.5rem' }}>System Status</h3>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : status ? (
          <div style={{ background: '#f0f4ff', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
            <p><strong>Forecaster:</strong> {status.forecaster_ready ? '✓ Ready' : '✗ Not Ready'}</p>
            <p><strong>Anomaly Detector:</strong> {status.anomaly_detector_ready ? '✓ Ready' : '✗ Not Ready'}</p>
          </div>
        ) : (
          <div className="alert alert-error">Failed to connect to backend</div>
        )}
      </div>

      <div className="grid">
        <div className="card">
          <h3>Features</h3>
          <ul style={{ marginLeft: '1rem' }}>
            <li>24, 48, 72-hour demand forecasting</li>
            <li>Real-time anomaly detection</li>
            <li>CSV file upload support</li>
            <li>Interactive visualizations</li>
          </ul>
        </div>

        <div className="card">
          <h3>Technology</h3>
          <ul style={{ marginLeft: '1rem' }}>
            <li>Random Forest for forecasting</li>
            <li>Isolation Forest for anomalies</li>
            <li>Flask API backend</li>
            <li>React frontend</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
