import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
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
  RotateCcw,
  Layers,
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Settings,
  Users,
  Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './WarehouseLocator.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const storeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const warehouseIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -44],
  shadowSize: [41, 41]
});

const EnhancedWarehouseLocator = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [stores, setStores] = useState([]);
  const [optimalWarehouse, setOptimalWarehouse] = useState(null);
  const [optimization, setOptimization] = useState('cost');
  const [isCalculating, setIsCalculating] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [showCoverage, setShowCoverage] = useState(true);

  // West Bengal map center
  const mapCenter = [22.9868, 87.8550];
  const mapZoom = 8;

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

  const getTileLayerUrl = () => {
    switch (mapView) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
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
            <h1>WareFlow Locator</h1>
            <span className="header-subtitle">AI-Powered Warehouse Optimization</span>
          </div>
          <div className="header-actions">
            <button className="map-control-btn" onClick={() => setShowCoverage(!showCoverage)}>
              <Target />
              Coverage
            </button>
            <select 
              className="map-view-select"
              value={mapView}
              onChange={(e) => setMapView(e.target.value)}
            >
              <option value="street">Street</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      </motion.header>

      <div className="locator-content">
        {/* Left Panel */}
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
              <button className="action-btn primary" onClick={addStore}>
                <Plus />Add Store
              </button>
              <button className="action-btn secondary" onClick={loadSampleData}>
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

        {/* Map Container */}
        <motion.div 
          className="map-container enhanced"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="leaflet-map"
            ref={mapRef}
          >
            <TileLayer
              url={getTileLayerUrl()}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Store Markers */}
            {stores.map(store => (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
                icon={storeIcon}
              >
                <Popup>
                  <div className="popup-content">
                    <h4>{store.name}</h4>
                    <p><strong>Location:</strong> {store.city}, {store.district}</p>
                    <p><strong>Daily Demand:</strong> {store.demand} units</p>
                    <p><strong>Coordinates:</strong> {store.lat.toFixed(4)}, {store.lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Optimal Warehouse Marker */}
            {optimalWarehouse && (
              <>
                <Marker
                  position={[optimalWarehouse.lat, optimalWarehouse.lng]}
                  icon={warehouseIcon}
                >
                  <Popup>
                    <div className="popup-content warehouse">
                      <h4>🏭 Optimal Warehouse Location</h4>
                      <p><strong>Estimated Cost:</strong> ₹{optimalWarehouse.cost.toLocaleString()}</p>
                      <p><strong>Average Distance:</strong> {optimalWarehouse.avgDistance} km</p>
                      <p><strong>Capacity:</strong> {optimalWarehouse.capacity.toLocaleString()} units</p>
                      <p><strong>Efficiency:</strong> {optimalWarehouse.efficiency}%</p>
                      <p><strong>Coordinates:</strong> {optimalWarehouse.lat.toFixed(4)}, {optimalWarehouse.lng.toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Coverage Circles */}
                {showCoverage && (
                  <Circle
                    center={[optimalWarehouse.lat, optimalWarehouse.lng]}
                    radius={50000} // 50km coverage
                    pathOptions={{ 
                      fillColor: '#6366f1', 
                      color: '#6366f1', 
                      fillOpacity: 0.1,
                      weight: 2
                    }}
                  />
                )}
              </>
            )}
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedWarehouseLocator;
