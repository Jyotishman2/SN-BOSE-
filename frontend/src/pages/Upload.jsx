import React from 'react';
import FileUpload from '../components/FileUpload';

const Upload = () => {
  const handleUploadSuccess = (data) => {
    console.log('Upload successful:', data);
  };

  return (
    <div className="container">
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      
      <div className="card">
        <h2>📋 CSV Format Requirements</h2>
        <p>Your CSV file should contain the following columns:</p>
        
        <table>
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>timestamp</strong></td>
              <td>Date and time of measurement</td>
              <td>2024-01-01 00:00:00</td>
            </tr>
            <tr>
              <td><strong>demand</strong></td>
              <td>Electricity demand in MW</td>
              <td>1500.5</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ marginTop: '1.5rem' }}>Sample CSV Format</h3>
        <pre style={{ background: '#f0f4ff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
timestamp,demand
2024-01-01 00:00:00,1500
2024-01-01 01:00:00,1480
2024-01-01 02:00:00,1450
        </pre>

        <h3 style={{ marginTop: '1.5rem' }}>Tips</h3>
        <ul style={{ marginLeft: '2rem' }}>
          <li>Ensure timestamps are in ISO format (YYYY-MM-DD HH:MM:SS)</li>
          <li>Demand values should be numeric (no text)</li>
          <li>File size should not exceed 50 MB</li>
          <li>At least 48 hours of historical data recommended for good forecasts</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;
