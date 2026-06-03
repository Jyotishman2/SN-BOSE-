import React from 'react';

const Dashboard = ({ stats }) => {
  if (!stats) {
    return (
      <div className="card">
        <h2> Dashboard</h2>
        <p>No data available. Please upload a dataset first.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="summary-card">
        <h3>Current System Status</h3>
        <div className="value">✓ Ready</div>
      </div>
      <div className="summary-card">
        <h3>Forecaster Model</h3>
        <div className="value">Active</div>
      </div>
      <div className="summary-card">
        <h3>Anomaly Detector</h3>
        <div className="value">Active</div>
      </div>
      <div className="summary-card">
        <h3>Last Update</h3>
        <div className="value">{new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
