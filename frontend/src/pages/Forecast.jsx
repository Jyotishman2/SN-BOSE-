import React, { useState, useEffect } from 'react';
import Chart from '../components/Chart';
import { getForecast } from '../services/api';

const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleForecast = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await getForecast(hours);
      
      // Format data for chart
      const chartData = {
        labels: data.forecast.map(f => new Date(f.timestamp).toLocaleString()),
        datasets: [
          {
            label: 'Forecasted Demand',
            data: data.forecast.map(f => f.demand),
            borderColor: '#1e3a8a',
            backgroundColor: 'rgba(30, 58, 138, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#1e3a8a'
          }
        ]
      };
      
      setForecast(chartData);
      setMessage('Forecast generated successfully!');
    } catch (error) {
      setMessage('Error generating forecast: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Demand Forecast</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="hours-select">Select forecast period:</label>
            <select 
              id="hours-select"
              value={hours} 
              onChange={(e) => setHours(Number(e.target.value))}
              disabled={loading}
            >
              <option value={24}>Next 24 hours</option>
              <option value={48}>Next 48 hours</option>
              <option value={72}>Next 72 hours</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={handleForecast} 
              disabled={loading}
              className="btn btn-success"
            >
              {loading ? 'Generating...' : 'Generate Forecast'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : forecast ? (
          <>
            <Chart data={forecast} title={`Electricity Demand Forecast (Next ${hours} Hours)`} />
            
            <div style={{ background: '#f0f4ff', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
              <h3>📈 Forecast Summary</h3>
              <p><strong>Period:</strong> {hours} hours</p>
              <p><strong>Data Points:</strong> {forecast.datasets[0].data.length}</p>
              <p><strong>Min Forecast:</strong> {Math.min(...forecast.datasets[0].data).toFixed(2)} MW</p>
              <p><strong>Max Forecast:</strong> {Math.max(...forecast.datasets[0].data).toFixed(2)} MW</p>
              <p><strong>Avg Forecast:</strong> {(forecast.datasets[0].data.reduce((a, b) => a + b, 0) / forecast.datasets[0].data.length).toFixed(2)} MW</p>
            </div>
          </>
        ) : (
          <div className="alert alert-info">
            Select forecast period and click "Generate Forecast" to see predictions
          </div>
        )}
      </div>

      <div className="card">
        <h2> About Forecasting</h2>
        <p>This system uses a <strong>Random Forest</strong> machine learning model to predict electricity demand.</p>
        <p><strong>Features considered:</strong> Historical demand patterns, time of day, day of week, seasonal trends, and rolling statistics.</p>
        <p><strong>Accuracy improves with:</strong> More historical data, consistent data quality, and seasonal variations.</p>
      </div>
    </div>
  );
};

export default Forecast;
