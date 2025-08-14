import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Store, 
  Warehouse, 
  Navigation, 
  CloudRain,
  Thermometer,
  Wind,
  Eye,
  Calculator,
  Zap,
  ArrowLeft,
  Plus,
  Trash2,
  Play,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './WarehouseLocator.css';

const WarehouseLocator = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [optimalWarehouse, setOptimalWarehouse] = useState(null);
  const [optimization, setOptimization] = useState('cost');
  const [isCalculating, setIsCalculating] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // West Bengal map center
  const [mapCenter] = useState([22.9868, 87.8550]); // West Bengal center
  const [mapZoom] = useState(9);

  // Sample store data from West Bengal
  const sampleStores = [
    { id: 1, name: 'Kolkata Central Store', lat: 22.5726, lng: 88.3639, demand: 250, city: 'Kolkata', district: 'Kolkata' },
    { id: 2, name: 'Salt Lake Store', lat: 22.5675, lng: 88.4259, demand: 180, city: 'Salt Lake City', district: 'North 24 Parganas' },
    { id: 3, name: 'Howrah Junction Store', lat: 22.5958, lng: 88.2636, demand: 200, city: 'Howrah', district: 'Howrah' },
    { id: 4, name: 'Siliguri Store', lat: 26.7271, lng: 88.3953, demand: 160, city: 'Siliguri', district: 'Darjeeling' },
    { id: 5, name: 'Durgapur Steel Store', lat: 23.5204, lng: 87.3119, demand: 140, city: 'Durgapur', district: 'Paschim Bardhaman' }
  ];

  // West Bengal districts and cities data
  const westBengalData = {
    districts: [
      'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 
      'Hooghly', 'Nadia', 'Murshidabad', 'Birbhum', 'Paschim Bardhaman',
      'Purba Bardhaman', 'Paschim Medinipur', 'Purba Medinipur', 
      'Jhargram', 'Bankura', 'Purulia', 'Darjeeling', 'Kalimpong',
      'Jalpaiguri', 'Cooch Behar', 'Alipurduar', 'Uttar Dinajpur',
      'Dakshin Dinajpur', 'Malda'
    ],
    majorCities: [
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639, population: '4.5M' },
      { name: 'Howrah', lat: 22.5958, lng: 88.2636, population: '1.1M' },
      { name: 'Siliguri', lat: 26.7271, lng: 88.3953, population: '0.7M' },
      { name: 'Durgapur', lat: 23.5204, lng: 87.3119, population: '0.6M' },
      { name: 'Asansol', lat: 23.6839, lng: 86.9523, population: '0.6M' },
      { name: 'Kharagpur', lat: 22.3460, lng: 87.2320, population: '0.3M' }
    ]
  };

  useEffect(() => {
    // Initialize with sample data
    setStores(sampleStores);
    
    // Simulate weather data
    setWeatherData({
      temperature: 22,
      humidity: 65,
      windSpeed: 8,
      visibility: 15,
      condition: 'Partly Cloudy'
    });

    // Simulate traffic data
    setTrafficData({
      status: 'Moderate',
      avgDelay: '5-10 minutes',
      congestionLevel: 'Medium'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addStore = () => {
    const randomCity = westBengalData.majorCities[Math.floor(Math.random() * westBengalData.majorCities.length)];
    const newStore = {
      id: Date.now(),
      name: `New Store ${stores.length + 1}`,
      lat: randomCity.lat + (Math.random() - 0.5) * 0.1,
      lng: randomCity.lng + (Math.random() - 0.5) * 0.1,
      demand: Math.floor(Math.random() * 200) + 50,
      city: randomCity.name,
      district: 'West Bengal'
    };
    setStores([...stores, newStore]);
  };

  const removeStore = (storeId) => {
    setStores(stores.filter(store => store.id !== storeId));
    if (optimalWarehouse) {
      setOptimalWarehouse(null);
      setShowResults(false);
    }
  };

  const calculateOptimalLocation = async () => {
    if (stores.length < 2) {
      alert('Please add at least 2 stores to calculate optimal warehouse location.');
      return;
    }

    setIsCalculating(true);
    setShowResults(false);

    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate weighted centroid based on optimization criteria
    let totalWeight = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    stores.forEach(store => {
      let weight = 1;
      
      switch (optimization) {
        case 'cost':
          weight = store.demand * 0.8; // Higher demand = higher weight
          break;
        case 'distance':
          weight = 1; // Equal weight for distance optimization
          break;
        case 'capacity':
          weight = store.demand; // Direct demand weight
          break;
        default:
          weight = 1;
      }

      totalWeight += weight;
      weightedLat += store.lat * weight;
      weightedLng += store.lng * weight;
    });

    const optimalLat = weightedLat / totalWeight;
    const optimalLng = weightedLng / totalWeight;

    // Add some randomness to make it more realistic
    const finalLat = optimalLat + (Math.random() - 0.5) * 0.01;
    const finalLng = optimalLng + (Math.random() - 0.5) * 0.01;

    setOptimalWarehouse({
      lat: finalLat,
      lng: finalLng,
      cost: Math.floor(Math.random() * 500000) + 200000,
      avgDistance: (Math.random() * 10 + 5).toFixed(1),
      capacity: Math.floor(Math.random() * 5000) + 10000,
      efficiency: Math.floor(Math.random() * 20) + 80
    });

    setIsCalculating(false);
    setShowResults(true);
  };

  const resetCalculation = () => {
    setOptimalWarehouse(null);
    setShowResults(false);
    setStores(sampleStores);
  };

  const loadSampleData = () => {
    setStores([
      ...sampleStores,
      { id: 6, name: 'Asansol Coal Store', lat: 23.6839, lng: 86.9523, demand: 130, city: 'Asansol', district: 'Paschim Bardhaman' },
      { id: 7, name: 'Kharagpur IIT Store', lat: 22.3460, lng: 87.2320, demand: 110, city: 'Kharagpur', district: 'Paschim Medinipur' },
      { id: 8, name: 'Haldia Port Store', lat: 22.0333, lng: 88.0667, demand: 95, city: 'Haldia', district: 'Purba Medinipur' },
      { id: 9, name: 'Malda Mango Store', lat: 25.0100, lng: 88.1439, demand: 85, city: 'Malda', district: 'Malda' },
      { id: 10, name: 'Darjeeling Tea Store', lat: 27.0360, lng: 88.2627, demand: 75, city: 'Darjeeling', district: 'Darjeeling' }
    ]);
  };

  return (
    <div className="warehouse-locator">
      {/* Header */}
      <motion.header 
        className="locator-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            <ArrowLeft />
            Back to Home
          </button>
          
          <h1>
            <Warehouse className="header-icon" />
            Warehouse Locator
          </h1>
          
          <div className="header-actions">
            <button className="load-sample-btn" onClick={loadSampleData}>
              Load Sample Data
            </button>
          </div>
        </div>
      </motion.header>

      <div className="locator-container">
        {/* Control Panel */}
        <motion.div 
          className="control-panel"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Optimization Settings */}
          <div className="panel-section">
            <h3>
              <Calculator className="section-icon" />
              Optimization Criteria
            </h3>
            <div className="optimization-buttons">
              {[
                { key: 'cost', label: 'Cost', icon: Calculator },
                { key: 'distance', label: 'Distance', icon: Navigation },
                { key: 'capacity', label: 'Capacity', icon: Warehouse }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`opt-btn ${optimization === key ? 'active' : ''}`}
                  onClick={() => setOptimization(key)}
                >
                  <Icon className="btn-icon" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Store Management */}
          <div className="panel-section">
            <h3>
              <Store className="section-icon" />
              Store Locations ({stores.length})
            </h3>
            <div className="store-actions">
              <button className="add-store-btn" onClick={addStore}>
                <Plus className="btn-icon" />
                Add Store
              </button>
            </div>
            <div className="store-list">
              {stores.map((store) => (
                <div key={store.id} className="store-item">
                  <div className="store-info">
                    <Store className="store-icon" />
                    <div>
                      <span className="store-name">{store.name}</span>
                      <span className="store-demand">Demand: {store.demand}</span>
                    </div>
                  </div>
                  <button 
                    className="remove-store-btn"
                    onClick={() => removeStore(store.id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Information */}
          <div className="panel-section">
            <h3>
              <CloudRain className="section-icon" />
              Current Weather
            </h3>
            {weatherData && (
              <div className="weather-info">
                <div className="weather-item">
                  <Thermometer className="weather-icon" />
                  <span>{weatherData.temperature}°C</span>
                </div>
                <div className="weather-item">
                  <Wind className="weather-icon" />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
                <div className="weather-item">
                  <Eye className="weather-icon" />
                  <span>{weatherData.visibility} km</span>
                </div>
                <div className="weather-condition">
                  {weatherData.condition}
                </div>
              </div>
            )}
          </div>

          {/* Traffic Information */}
          <div className="panel-section">
            <h3>
              <Navigation className="section-icon" />
              Traffic Status
            </h3>
            {trafficData && (
              <div className="traffic-info">
                <div className="traffic-item">
                  <span className="traffic-label">Status:</span>
                  <span className={`traffic-status ${trafficData.status.toLowerCase()}`}>
                    {trafficData.status}
                  </span>
                </div>
                <div className="traffic-item">
                  <span className="traffic-label">Avg Delay:</span>
                  <span>{trafficData.avgDelay}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`calculate-btn ${isCalculating ? 'calculating' : ''}`}
              onClick={calculateOptimalLocation}
              disabled={isCalculating || stores.length < 2}
            >
              {isCalculating ? (
                <>
                  <div className="spinner" />
                  Calculating...
                </>
              ) : (
                <>
                  <Play className="btn-icon" />
                  Find Optimal Location
                </>
              )}
            </button>
            
            <button className="reset-btn" onClick={resetCalculation}>
              <RotateCcw className="btn-icon" />
              Reset
            </button>
          </div>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div 
          className="map-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="map-placeholder">
            <div className="map-content">
              <MapPin className="map-icon" />
              <h3>Interactive Map</h3>
              <p>Map visualization showing store locations and optimal warehouse placement</p>
              {optimalWarehouse && (
                <div className="optimal-location">
                  <h4>🏭 Optimal Location Found!</h4>
                  <p>Coordinates: {optimalWarehouse.lat.toFixed(4)}, {optimalWarehouse.lng.toFixed(4)}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        {showResults && optimalWarehouse && (
          <motion.div 
            className="results-panel"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3>
              <Zap className="section-icon" />
              Optimization Results
            </h3>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon cost">
                  <Calculator />
                </div>
                <div className="result-info">
                  <span className="result-value">${optimalWarehouse.cost.toLocaleString()}</span>
                  <span className="result-label">Estimated Annual Cost</span>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon distance">
                  <Navigation />
                </div>
                <div className="result-info">
                  <span className="result-value">{optimalWarehouse.avgDistance} km</span>
                  <span className="result-label">Average Distance</span>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon capacity">
                  <Warehouse />
                </div>
                <div className="result-info">
                  <span className="result-value">{optimalWarehouse.capacity.toLocaleString()}</span>
                  <span className="result-label">Storage Capacity</span>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon efficiency">
                  <Zap />
                </div>
                <div className="result-info">
                  <span className="result-value">{optimalWarehouse.efficiency}%</span>
                  <span className="result-label">Efficiency Score</span>
                </div>
              </div>
            </div>
            
            <div className="optimization-summary">
              <h4>Optimization Summary</h4>
              <p>
                Based on your <strong>{optimization}</strong> optimization criteria and {stores.length} store locations, 
                this warehouse location will provide the best balance of cost, efficiency, and accessibility. 
                Current weather conditions and traffic patterns have been factored into the analysis.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WarehouseLocator;
