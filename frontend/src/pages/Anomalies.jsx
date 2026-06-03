import React, { useState, useEffect } from 'react';
import AnomalyAlerts from '../components/AnomalyAlerts';
import { getAnomalies } from '../services/api';

const Anomalies = () => {
  const [anomalies, setAnomalies] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDetectAnomalies = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await getAnomalies();
      setAnomalies(data.anomalies);
      setSummary(data.summary);
      setMessage('Anomaly detection completed!');
    } catch (error) {
      setMessage('Error detecting anomalies: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🔔 Anomaly Detection</h2>
        
        <button 
          onClick={handleDetectAnomalies} 
          disabled={loading}
          className="btn btn-success"
          style={{ marginBottom: '1rem' }}
        >
          {loading ? 'Analyzing...' : 'Detect Anomalies'}
        </button>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : anomalies ? (
          <AnomalyAlerts anomalies={anomalies} summary={summary} />
        ) : (
          <div className="alert alert-info">
            Click "Detect Anomalies" to analyze your data for unusual consumption patterns
          </div>
        )}
      </div>

      <div className="card">
        <h2>📚 What are Anomalies?</h2>
        <p>Anomalies are unusual consumption patterns that deviate significantly from normal behavior. They can indicate:</p>
        <ul style={{ marginLeft: '2rem' }}>
          <li><strong>Equipment failures:</strong> Sudden drops in demand</li>
          <li><strong>Unusual usage:</strong> Unexpected spikes or patterns</li>
          <li><strong>System issues:</strong> Irregular data points</li>
          <li><strong>External events:</strong> Special circumstances affecting consumption</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem' }}>Severity Levels</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <span className="anomaly-badge high">HIGH</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Critical anomalies requiring immediate attention</p>
          </div>
          <div>
            <span className="anomaly-badge medium">MEDIUM</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Moderate anomalies to monitor</p>
          </div>
          <div>
            <span className="anomaly-badge low">LOW</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Minor deviations from normal</p>
          </div>
        </div>

        <h3 style={{ marginTop: '1.5rem' }}>Detection Method</h3>
        <p>This system uses the <strong>Isolation Forest</strong> algorithm, which is effective at detecting anomalies in high-dimensional data by isolating outliers.</p>
      </div>
    </div>
  );
};

export default Anomalies;
