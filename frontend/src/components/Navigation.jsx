import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ status }) => {
  return (
    <nav className="navbar">
      <h1>Power Demand Predictor</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/forecast">Forecast</Link>
        <Link to="/anomalies">Anomalies</Link>
      </div>
      <div>
        {status && (
          <span>
            <span className={`status-indicator ${status.forecaster_ready ? 'online' : 'offline'}`}></span>
            {status.forecaster_ready ? 'Ready' : 'Not Ready'}
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
