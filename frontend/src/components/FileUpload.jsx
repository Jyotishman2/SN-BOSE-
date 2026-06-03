import React, { useState } from 'react';
import { uploadFile, trainModels } from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setLoading(true);
    try {
      const response = await uploadFile(file);
      setMessage('File uploaded successfully!');
      setSummary(response.summary);
      
      // Train models after upload
      setTimeout(async () => {
        const trainResponse = await trainModels();
        setMessage('Models trained successfully!');
        if (onUploadSuccess) {
          onUploadSuccess(response);
        }
      }, 1000);
    } catch (error) {
      setMessage('Error uploading file: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📤 Upload Dataset</h2>
      
      <div className="file-upload">
        <input
          type="file"
          id="file-input"
          accept=".csv"
          onChange={handleFileChange}
        />
        <label htmlFor="file-input">
          📁 Click to upload or drag & drop your CSV file
        </label>
        {file && <p style={{ marginTop: '1rem' }}>Selected: {file.name}</p>}
      </div>

      <button 
        onClick={handleUpload} 
        disabled={!file || loading}
        style={{ marginTop: '1rem', width: '100%' }}
      >
        {loading ? 'Processing...' : 'Upload & Train Models'}
      </button>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}
             style={{ marginTop: '1rem' }}>
          {message}
        </div>
      )}

      {summary && (
        <div style={{ marginTop: '1.5rem', background: '#f0f4ff', padding: '1rem', borderRadius: '4px' }}>
          <h3>Data Summary</h3>
          <p><strong>Rows:</strong> {summary.rows}</p>
          <p><strong>Columns:</strong> {summary.columns}</p>
          {summary.date_range && (
            <>
              <p><strong>Date Range:</strong> {summary.date_range.start} to {summary.date_range.end}</p>
            </>
          )}
          {summary.demand_stats && (
            <>
              <p><strong>Avg Demand:</strong> {summary.demand_stats.mean.toFixed(2)} MW</p>
              <p><strong>Min/Max:</strong> {summary.demand_stats.min.toFixed(2)} / {summary.demand_stats.max.toFixed(2)} MW</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
