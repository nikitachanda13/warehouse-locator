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
  RotateCcw,
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Settings,
  Users,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnhancedMapComponent from './EnhancedMapComponent';
import './WarehouseLocator.css';

const SimpleEnhancedWarehouseLocator = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [optimalWarehouse, setOptimalWarehouse] = useState(null);
  const [optimization, setOptimization] = useState('cost');
  const [isCalculating, setIsCalculating] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [mapView, setMapView] = useState('satellite');

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
          weight = store.demand * 0.8;
          break;
        case 'distance':
          weight = 1;
          break;
        case 'capacity':
          weight = store.demand;
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
    <div className="warehouse-locator enhanced">
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
            <span>Back to Home</span>
          </button>
          <div className="header-title">
            <Warehouse className="header-icon" />
            <h1>LocateIQ Enhanced</h1>
            <span className="header-subtitle">AI-Powered Warehouse Optimization</span>
          </div>
          <div className="header-actions">
            <button className="map-control-btn">
              <Target />
              Enhanced Mode
            </button>
            <select 
              className="map-view-select"
              value={mapView}
              onChange={(e) => setMapView(e.target.value)}
            >
              <option value="street">Street View</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      </motion.header>

      <div className="locator-content">
        {/* Enhanced Left Panel */}
        <motion.div 
          className="left-panel enhanced"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Store Management */}
          <div className="panel-section">
            <h3><Store className="section-icon" />Store Locations ({stores.length})</h3>
          <div className="store-actions">
            <button className="add-store-btn" onClick={addStore}>
              <Plus />Add Store
            </button>
            <button className="load-sample-btn" onClick={loadSampleData}>
              <Users />Sample Data
            </button>
          </div>
            <div className="store-list">
              {stores.map(store => (
                <motion.div 
                  key={store.id} 
                  className="store-item enhanced"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="store-info">
                    <div className="store-header">
                      <MapPin className="store-icon" />
                      <strong>{store.name}</strong>
                    </div>
                    <div className="store-details">
                      <span className="store-location">{store.city}, {store.district}</span>
                      <span className="store-demand">Demand: {store.demand} units/day</span>
                      <span className="store-coords">
                        {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeStore(store.id)}
                  >
                    <Trash2 />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Optimization Settings */}
          <div className="panel-section">
            <h3><Settings className="section-icon" />Optimization</h3>
            <div className="optimization-controls">
              <label>
                <input 
                  type="radio" 
                  value="cost" 
                  checked={optimization === 'cost'}
                  onChange={(e) => setOptimization(e.target.value)}
                />
                <span><DollarSign />Cost Optimization</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  value="distance" 
                  checked={optimization === 'distance'}
                  onChange={(e) => setOptimization(e.target.value)}
                />
                <span><Navigation />Distance Optimization</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  value="capacity" 
                  checked={optimization === 'capacity'}
                  onChange={(e) => setOptimization(e.target.value)}
                />
                <span><Warehouse />Capacity Optimization</span>
              </label>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="panel-section">
            <div className="calculation-controls">
              <motion.button 
                className={`calculate-btn ${isCalculating ? 'calculating' : ''}`}
                onClick={calculateOptimalLocation}
                disabled={isCalculating || stores.length < 2}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCalculating ? (
                  <>
                    <div className="spinner" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator />
                    Find Optimal Location
                  </>
                )}
              </motion.button>
              <button className="reset-btn" onClick={resetCalculation}>
                <RotateCcw />Reset
              </button>
            </div>
          </div>

          {/* Results */}
          {showResults && optimalWarehouse && (
            <motion.div 
              className="panel-section results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3><TrendingUp className="section-icon" />Optimization Results</h3>
              <div className="result-metrics">
                <div className="metric">
                  <DollarSign className="metric-icon" />
                  <div>
                    <span className="metric-label">Est. Cost</span>
                    <span className="metric-value">₹{optimalWarehouse.cost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="metric">
                  <Navigation className="metric-icon" />
                  <div>
                    <span className="metric-label">Avg Distance</span>
                    <span className="metric-value">{optimalWarehouse.avgDistance} km</span>
                  </div>
                </div>
                <div className="metric">
                  <Warehouse className="metric-icon" />
                  <div>
                    <span className="metric-label">Capacity</span>
                    <span className="metric-value">{optimalWarehouse.capacity.toLocaleString()}</span>
                  </div>
                </div>
                <div className="metric">
                  <Zap className="metric-icon" />
                  <div>
                    <span className="metric-label">Efficiency</span>
                    <span className="metric-value">{optimalWarehouse.efficiency}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Weather & Traffic */}
          <div className="panel-section">
            <h3><CloudRain className="section-icon" />Environmental Data</h3>
            {weatherData && (
              <div className="env-data">
                <div className="weather-info">
                  <div className="weather-item">
                    <Thermometer />
                    <span>{weatherData.temperature}°C</span>
                  </div>
                  <div className="weather-item">
                    <Wind />
                    <span>{weatherData.windSpeed} km/h</span>
                  </div>
                  <div className="weather-item">
                    <Eye />
                    <span>{weatherData.visibility} km</span>
                  </div>
                </div>
                {trafficData && (
                  <div className="traffic-info">
                    <div className="traffic-item">
                      <span className="traffic-label">Traffic:</span>
                      <span className={`traffic-status ${trafficData.status.toLowerCase()}`}>
                        {trafficData.status}
                      </span>
                    </div>
                    <div className="traffic-item">
                      <Clock />
                      <span>{trafficData.avgDelay}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Map Container */}
        <motion.div 
          className="map-container enhanced"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <EnhancedMapComponent
            stores={stores}
            optimalWarehouse={optimalWarehouse}
            mapView={mapView}
            onStoreClick={(store) => console.log('Store clicked:', store)}
            onMapClick={(latlng) => console.log('Map clicked:', latlng)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleEnhancedWarehouseLocator;
