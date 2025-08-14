import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoadingPage from './components/LoadingPage';
import WarehouseLocator from './components/WarehouseLocator';
import SimpleEnhancedWarehouseLocator from './components/SimpleEnhancedWarehouseLocator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/warehouse-locator" element={<WarehouseLocator />} />
          <Route path="/enhanced-warehouse-locator" element={<SimpleEnhancedWarehouseLocator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
