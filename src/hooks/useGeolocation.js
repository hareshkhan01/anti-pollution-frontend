import { useEffect, useState } from 'react';

/**
 * Custom hook to get the user's current geolocation.
 * Returns { latitude, longitude, loading, error }
 */
export function useGeolocation() {
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { ...position, loading, error };
}
