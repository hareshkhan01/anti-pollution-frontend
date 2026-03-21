import { useState, useEffect } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import Header from './components/Header/Header';
import MapView from './components/MapView/MapView';
import { fetchRoutesData } from './api/routeApi';
import mockPostData from './data/mockPostData.json';
import './App.css';

function App() {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();

  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState(null);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setRoutesLoading(true);
        // Using mockPostData for the POST request payload as requested
        const data = await fetchRoutesData(mockPostData);
        // Assuming API might return the array directly or inside a `routes` property or `data` property
        const actualRoutes = Array.isArray(data) ? data : (data?.routes || data?.data || []);
        console.log(actualRoutes);
        setRoutes(actualRoutes);
      } catch (err) {
        setRoutesError(err.message);
      } finally {
        setRoutesLoading(false);
      }
    };

    loadRoutes();
  }, []);

  if (locationError) {
    return (
      <div className="app-status">
        <p>⚠️ Location error: {locationError}</p>
      </div>
    );
  }

  if (locationLoading || routesLoading) {
    return (
      <div className="app-status">
        <p>📍 Loading map and routes…</p>
      </div>
    );
  }

  if (routesError) {
    return (
      <div className="app-status">
        <p>⚠️ API Error: {routesError}</p>
        <p>Make sure the API is running on localhost:3300</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <MapView latitude={latitude} longitude={longitude} routes={routes} />
    </>
  );
}

export default App;
