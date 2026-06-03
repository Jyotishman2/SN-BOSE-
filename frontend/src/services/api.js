import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};

// Upload file
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Train models
export const trainModels = async () => {
  try {
    const response = await api.post('/train');
    return response.data;
  } catch (error) {
    console.error('Training failed:', error);
    throw error;
  }
};

// Get forecast
export const getForecast = async (hours = 24) => {
  try {
    const response = await api.post('/forecast', { hours });
    return response.data;
  } catch (error) {
    console.error('Forecast failed:', error);
    throw error;
  }
};

// Get anomalies
export const getAnomalies = async () => {
  try {
    const response = await api.post('/anomalies');
    return response.data;
  } catch (error) {
    console.error('Anomaly detection failed:', error);
    throw error;
  }
};

// Get datasets
export const getDatasets = async () => {
  try {
    const response = await api.get('/datasets');
    return response.data;
  } catch (error) {
    console.error('Get datasets failed:', error);
    throw error;
  }
};

export default api;
