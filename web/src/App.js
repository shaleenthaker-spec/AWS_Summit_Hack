import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data for demonstration
const mockServices = [
  {
    id: '1',
    name: 'City Mall Restroom',
    type: 'bathroom',
    rating: 4.2,
    reviewCount: 156,
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Main St, Downtown',
    amenities: ['wheelchair', 'baby-changing'],
    isOpen: true,
    distance: 0.5,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Central Park Water Fountain',
    type: 'water_fountain',
    rating: 4.5,
    reviewCount: 89,
    latitude: 37.7849,
    longitude: -122.4094,
    address: '456 Park Ave',
    amenities: ['filtered-water'],
    isOpen: true,
    distance: 1.2,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Airport Terminal Sanitizer Station',
    type: 'hand_sanitizer',
    rating: 4.5,
    reviewCount: 234,
    latitude: 37.7649,
    longitude: -122.4294,
    address: '789 Airport Blvd',
    amenities: ['touchless'],
    isOpen: true,
    distance: 2.1,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Public Library Hand Washing Station',
    type: 'sink',
    rating: 4.5,
    reviewCount: 67,
    latitude: 37.7949,
    longitude: -122.3994,
    address: '321 Library St',
    amenities: ['hot-water', 'soap-dispenser'],
    isOpen: true,
    distance: 0.8,
    createdAt: new Date().toISOString()
  }
];

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Get user's location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation(userLocation);
        setLocationLoading(false);
        fetchNearbyServices(userLocation);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enable location services.');
        setLocationLoading(false);
        // Use default location (San Francisco) for demo
        const defaultLocation = { latitude: 37.7749, longitude: -122.4194, accuracy: 100 };
        setLocation(defaultLocation);
        fetchNearbyServices(defaultLocation);
      }
    );
  };

  // Fetch nearby services (mock implementation)
  const fetchNearbyServices = async (userLocation) => {
    setServicesLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter services by distance (mock calculation)
    const servicesWithDistance = mockServices.map(service => ({
      ...service,
      distance: Math.sqrt(
        Math.pow(service.latitude - userLocation.latitude, 2) +
        Math.pow(service.longitude - userLocation.longitude, 2)
      ) * 111 // Rough conversion to km
    })).filter(service => service.distance <= 5); // Within 5km

    setNearbyServices(servicesWithDistance);
    setServicesLoading(false);
  };

  // Get service icon
  const getServiceIcon = (type) => {
    switch (type) {
      case 'bathroom': return '🚽';
      case 'water_fountain': return '💧';
      case 'hand_sanitizer': return '🧴';
      case 'sink': return '🚰';
      default: return '📍';
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star">⭐</span>);
    }
    
    return stars;
  };

  // Home Screen Component
  const HomeScreen = () => (
    <div>
      <div className="card">
        <h2>📍 Current Location</h2>
        {locationLoading && <div className="loading">Getting location...</div>}
        {locationError && <div className="error">{locationError}</div>}
        {location && (
          <div>
            <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
            <p><strong>Accuracy:</strong> {location.accuracy.toFixed(0)}m</p>
          </div>
        )}
        <button className="button" onClick={getCurrentLocation} disabled={locationLoading}>
          🔄 {locationLoading ? 'Getting Location...' : 'Get My Location'}
        </button>
      </div>

      <div className="card">
        <h2>⚡ Quick Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button className="button" onClick={() => setCurrentTab('search')}>
            🚽 Bathrooms
          </button>
          <button className="button" onClick={() => setCurrentTab('search')}>
            💧 Water Fountains
          </button>
          <button className="button" onClick={() => setCurrentTab('search')}>
            🧴 Hand Sanitizer
          </button>
          <button className="button" onClick={() => setCurrentTab('search')}>
            🚰 Sinks
          </button>
        </div>
      </div>

      <div className="card">
        <h2>🏪 Nearby Services</h2>
        {servicesLoading && <div className="loading">Finding nearby services...</div>}
        {!servicesLoading && nearbyServices.length === 0 && location && (
          <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
            No services found nearby
          </p>
        )}
        {!servicesLoading && nearbyServices.length > 0 && (
          <div>
            {nearbyServices.slice(0, 3).map((service) => (
              <div key={service.id} className="service-item">
                <span className="service-icon">{getServiceIcon(service.type)}</span>
                <div className="service-info">
                  <div className="service-name">{service.name}</div>
                  <div className="service-details">
                    {service.type.replace('_', ' ')} • {service.distance.toFixed(1)}km • 
                    <span className="rating">
                      {renderStars(service.rating)} {service.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {nearbyServices.length > 3 && (
              <p style={{ textAlign: 'center', color: '#2563eb', fontStyle: 'italic', marginTop: '8px' }}>
                +{nearbyServices.length - 3} more services nearby
              </p>
            )}
          </div>
        )}
        <button className="button" onClick={() => location && fetchNearbyServices(location)}>
          🔄 Refresh Services
        </button>
      </div>

      <div className="card">
        <h2>ℹ️ App Status</h2>
        <div className="success">
          ✅ Web version running on localhost<br/>
          ✅ Location services available<br/>
          ✅ Mock data loaded<br/>
          ✅ Ready for AWS integration
        </div>
      </div>
    </div>
  );

  // Search Screen Component
  const SearchScreen = () => (
    <div>
      <div className="card">
        <h2>🔍 Search Services</h2>
        <input 
          type="text" 
          className="input" 
          placeholder="Search for bathrooms, water fountains, etc..."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <button className="button">🚽 Bathrooms</button>
          <button className="button">💧 Water</button>
          <button className="button">🧴 Sanitizer</button>
          <button className="button">🚰 Sinks</button>
        </div>
      </div>

      <div className="card">
        <h2>📍 All Services</h2>
        {mockServices.map((service) => (
          <div key={service.id} className="service-item">
            <span className="service-icon">{getServiceIcon(service.type)}</span>
            <div className="service-info">
              <div className="service-name">{service.name}</div>
              <div className="service-details">
                {service.address} • 
                <span className="rating">
                  {renderStars(service.rating)} {service.rating.toFixed(1)} ({service.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Map Screen Component
  const MapScreen = () => (
    <div>
      <div className="card">
        <h2>🗺️ Interactive Map</h2>
        <div style={{ 
          height: '400px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: '500'
        }}>
          🗺️ Interactive Map View<br/>
          <small style={{ fontSize: '14px', opacity: 0.8 }}>
            (Map integration would go here)
          </small>
        </div>
        <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px' }}>
          This would show an interactive map with service markers, similar to Google Maps.
        </p>
      </div>
    </div>
  );

  // Profile Screen Component
  const ProfileScreen = () => (
    <div>
      <div className="card">
        <h2>👤 Profile & Settings</h2>
        <div style={{ marginBottom: '16px' }}>
          <h3>App Settings</h3>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <input type="checkbox" defaultChecked /> Enable location services
          </label>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <input type="checkbox" defaultChecked /> Enable notifications
          </label>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <input type="checkbox" /> Dark mode
          </label>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <h3>Search Radius</h3>
          <select className="input" style={{ marginBottom: '0' }}>
            <option value="1">1 km</option>
            <option value="2">2 km</option>
            <option value="5" selected>5 km</option>
            <option value="10">10 km</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h2>📊 App Information</h2>
        <p><strong>Version:</strong> 1.0.0 (Web)</p>
        <p><strong>Platform:</strong> React Web App</p>
        <p><strong>Backend:</strong> AWS (Ready for integration)</p>
        <p><strong>Features:</strong> Location services, Service search, Reviews</p>
      </div>
    </div>
  );

  // Get current screen content
  const getCurrentScreen = () => {
    switch (currentTab) {
      case 'home': return <HomeScreen />;
      case 'search': return <SearchScreen />;
      case 'map': return <MapScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  // Load location on app start
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          🚽 Lavatory Finder
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Find nearby lavatory services - Web Version
        </p>
      </header>

      <nav className="navigation">
        <button 
          className={`nav-button ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentTab('home')}
        >
          🏠 Home
        </button>
        <button 
          className={`nav-button ${currentTab === 'search' ? 'active' : ''}`}
          onClick={() => setCurrentTab('search')}
        >
          🔍 Search
        </button>
        <button 
          className={`nav-button ${currentTab === 'map' ? 'active' : ''}`}
          onClick={() => setCurrentTab('map')}
        >
          🗺️ Map
        </button>
        <button 
          className={`nav-button ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentTab('profile')}
        >
          👤 Profile
        </button>
      </nav>

      <main>
        {getCurrentScreen()}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px', padding: '20px', color: '#6b7280' }}>
        <p>🚽 Lavatory Finder - Built with React • Ready for AWS Integration</p>
        <p style={{ fontSize: '12px', marginTop: '8px' }}>
          Running on localhost:3000 • Mock data for demonstration
        </p>
      </footer>
    </div>
  );
}

export default App;
