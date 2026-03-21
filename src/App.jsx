import { useGeolocation } from './hooks/useGeolocation';
import Header from './components/Header/Header';
import MapView from './components/MapView/MapView';
import mockRoutes from './data/mockRoutes.json';
import './App.css';

function App() {
  const { latitude, longitude, loading, error } = useGeolocation();

  if (error) {
    return (
      <div className="app-status">
        <p>⚠️ Location error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-status">
        <p>📍 Getting your location…</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <MapView latitude={latitude} longitude={longitude} routes={mockRoutes} />
    </>
  );
}

export default App;
