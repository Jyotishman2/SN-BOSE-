import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

import Navigation from './components/Navigation';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Forecast from './pages/Forecast';
import Anomalies from './pages/Anomalies';

import { healthCheck } from './services/api';

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const health = await healthCheck();
      setStatus(health);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Navigation status={status} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/anomalies" element={<Anomalies />} />
      </Routes>
    </Router>
  );
}

export default App;
