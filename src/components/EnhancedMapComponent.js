import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Warehouse, 
  Navigation, 
  Zap, 
  Target,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

// Custom marker icons
const createCustomIcon = (color, iconType) => {
  const iconHtml = `
    <div style="
      background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${iconType === 'store' ? '🏪' : '🏭'}
      </div>
    </div>
    <div style="
      position: absolute;
      top: 32px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 12px solid ${color};
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44]
  });
};

const EnhancedMapComponent = ({ 
  stores = [], 
  optimalWarehouse = null, 
  mapView = 'satellite',
  onStoreClick,
  onMapClick 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [currentZoom, setCurrentZoom] = useState(10);
  const [mapCenter, setMapCenter] = useState([22.5726, 88.3639]); // Default to Kolkata
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // Map tile layers
  const tileLayers = {
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Create map instance
      const map = L.map(mapRef.current, {
        center: mapCenter,
        zoom: currentZoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add tile layer
      L.tileLayer(tileLayers[mapView], {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Map event listeners
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      map.on('moveend', () => {
        const center = map.getCenter();
        setMapCenter([center.lat, center.lng]);
      });

      map.on('click', (e) => {
        if (onMapClick) {
          onMapClick(e.latlng);
        }
      });

      mapInstanceRef.current = map;
      setIsLoading(false);

      // Cleanup function
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to load map');
      setIsLoading(false);
    }
  }, []);

  // Update tile layer when mapView changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    L.tileLayer(tileLayers[mapView], {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
  }, [mapView]);

  // Update markers when stores change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add store markers
    stores.forEach((store, index) => {
      const marker = L.marker([store.lat, store.lng], {
        icon: createCustomIcon('#6366f1', 'store')
      }).addTo(mapInstanceRef.current);

      const popupContent = `
        <div style="min-width: 200px; padding: 8px;">
          <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px;">
            ${store.name}
          </h3>
          <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">
            <strong>Location:</strong> ${store.city}
          </p>
          <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">
            <strong>Daily Demand:</strong> ${store.demand} units
          </p>
          <p style="color: #6b7280; margin: 4px 0; font-size: 12px;">
            <strong>Coordinates:</strong> ${store.lat.toFixed(4)}, ${store.lng.toFixed(4)}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        if (onStoreClick) {
          onStoreClick(store);
        }
      });

      markersRef.current.push(marker);
    });

    // Add optimal warehouse marker if exists
    if (optimalWarehouse) {
      const warehouseMarker = L.marker([optimalWarehouse.lat, optimalWarehouse.lng], {
        icon: createCustomIcon('#ec4899', 'warehouse')
      }).addTo(mapInstanceRef.current);

      const warehousePopup = `
        <div style="min-width: 200px; padding: 8px;">
          <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px;">
            🏭 Optimal Warehouse Location
          </h3>
          <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">
            <strong>Estimated Cost:</strong> ₹${optimalWarehouse.cost?.toLocaleString()}
          </p>
          <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">
            <strong>Avg Distance:</strong> ${optimalWarehouse.avgDistance} km
          </p>
          <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">
            <strong>Efficiency:</strong> ${optimalWarehouse.efficiency}%
          </p>
          <p style="color: #6b7280; margin: 4px 0; font-size: 12px;">
            <strong>Coordinates:</strong> ${optimalWarehouse.lat.toFixed(4)}, ${optimalWarehouse.lng.toFixed(4)}
          </p>
        </div>
      `;

      warehouseMarker.bindPopup(warehousePopup);
      markersRef.current.push(warehouseMarker);

      // Draw lines from warehouse to all stores
      stores.forEach(store => {
        const line = L.polyline(
          [[optimalWarehouse.lat, optimalWarehouse.lng], [store.lat, store.lng]], 
          {
            color: '#ec4899',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 10'
          }
        ).addTo(mapInstanceRef.current);
        markersRef.current.push(line);
      });
    }

    // Auto-fit bounds if there are stores
    if (stores.length > 0) {
      const group = new L.featureGroup(markersRef.current.filter(marker => marker instanceof L.Marker));
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [stores, optimalWarehouse]);

  // Map control functions
  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const resetView = () => {
    if (mapInstanceRef.current && stores.length > 0) {
      const group = new L.featureGroup(markersRef.current.filter(marker => marker instanceof L.Marker));
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const focusOnOptimalWarehouse = () => {
    if (mapInstanceRef.current && optimalWarehouse) {
      mapInstanceRef.current.setView([optimalWarehouse.lat, optimalWarehouse.lng], 15, {
        animate: true,
        duration: 1
      });
    }
  };

  if (mapError) {
    return (
      <div className="map-error">
        <div className="error-content">
          <Navigation size={48} />
          <h3>Map Loading Error</h3>
          <p>{mapError}</p>
          <button onClick={() => window.location.reload()}>
            <RotateCcw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-map-container">
      {isLoading && (
        <motion.div 
          className="map-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-content">
            <div className="loading-spinner" />
            <p>Loading Interactive Map...</p>
          </div>
        </motion.div>
      )}

      <div 
        ref={mapRef} 
        className={`map-instance ${isLoading ? 'loading' : ''}`}
        style={{ height: '100%', width: '100%' }}
      />

      {/* Map Controls */}
      <div className="map-controls">
        <motion.button
          className="map-control-btn zoom-in"
          onClick={zoomIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </motion.button>

        <motion.button
          className="map-control-btn zoom-out"
          onClick={zoomOut}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </motion.button>

        <motion.button
          className="map-control-btn reset-view"
          onClick={resetView}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset View"
        >
          <Target size={18} />
        </motion.button>

        {optimalWarehouse && (
          <motion.button
            className="map-control-btn focus-warehouse"
            onClick={focusOnOptimalWarehouse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Focus on Optimal Warehouse"
          >
            <Zap size={18} />
          </motion.button>
        )}
      </div>

      {/* Map Info */}
      <div className="map-info">
        <div className="map-stats">
          <span className="stat">
            <MapPin size={14} />
            {stores.length} Stores
          </span>
          {optimalWarehouse && (
            <span className="stat optimal">
              <Warehouse size={14} />
              Optimal Location Found
            </span>
          )}
          <span className="stat">
            <Layers size={14} />
            {mapView.charAt(0).toUpperCase() + mapView.slice(1)} View
          </span>
        </div>
      </div>

      <style jsx>{`
        .enhanced-map-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .map-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 26, 46, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-content {
          text-align: center;
          color: white;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(102, 126, 234, 0.3);
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .map-instance.loading {
          opacity: 0.5;
        }

        .map-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 1000;
        }

        .map-control-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #374151;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
        }

        .map-control-btn:hover {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .map-control-btn.focus-warehouse {
          background: linear-gradient(135deg, #ec4899, #f472b6);
          color: white;
        }

        .map-control-btn.focus-warehouse:hover {
          background: linear-gradient(135deg, #db2777, #ec4899);
        }

        .map-info {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 1000;
        }

        .map-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stat.optimal {
          background: linear-gradient(135deg, #ec4899, #f472b6);
          color: white;
        }

        .map-error {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: rgba(26, 26, 46, 0.95);
          border-radius: 20px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .error-content {
          text-align: center;
          color: white;
        }

        .error-content h3 {
          margin: 1rem 0 0.5rem;
          color: #ef4444;
        }

        .error-content p {
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .error-content button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 auto;
        }

        .error-content button:hover {
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Custom Leaflet popup styling */
        :global(.leaflet-popup-content-wrapper) {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        :global(.leaflet-popup-tip) {
          background: white;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        :global(.custom-div-icon) {
          background: transparent !important;
          border: none !important;
        }

        @media (max-width: 768px) {
          .map-controls {
            top: 0.5rem;
            right: 0.5rem;
          }

          .map-control-btn {
            width: 36px;
            height: 36px;
          }

          .map-info {
            bottom: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
          }

          .map-stats {
            gap: 0.5rem;
          }

          .stat {
            font-size: 0.8rem;
            padding: 0.4rem 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedMapComponent;
