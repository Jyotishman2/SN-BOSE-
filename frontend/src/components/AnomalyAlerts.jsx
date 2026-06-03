import React from 'react';

const AnomalyAlerts = ({ anomalies, summary }) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="card">
        <h2>🔔 Anomalies Detected</h2>
        <p>No anomalies found in the data.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🔔 Anomalies Detected</h2>
      
      {summary && (
        <div className="grid">
          <div className="summary-card">
            <h3>Total Samples</h3>
            <div className="value">{summary.total_samples}</div>
          </div>
          <div className="summary-card">
            <h3>Anomalies</h3>
            <div className="value">{summary.anomaly_count}</div>
          </div>
          <div className="summary-card">
            <h3>Percentage</h3>
            <div className="value">{summary.anomaly_percentage.toFixed(2)}%</div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Demand (MW)</th>
            <th>Anomaly Score</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {anomalies.map((anomaly, idx) => (
            <tr key={idx}>
              <td>{new Date(anomaly.timestamp).toLocaleString()}</td>
              <td>{anomaly.demand ? anomaly.demand.toFixed(2) : 'N/A'}</td>
              <td>{anomaly.anomaly_score.toFixed(4)}</td>
              <td>
                <span className={`anomaly-badge ${anomaly.severity}`}>
                  {anomaly.severity.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnomalyAlerts;
