import { useEffect, useRef } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';
import './MapView.css';

const API_KEY = import.meta.env.VITE_OLA_MAPS_API_KEY;
const MAP_STYLE = 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json';
const DEFAULT_ZOOM = 9;

/**
 * MapView — renders an OlaMaps instance centered on the given coordinates.
 * Handles map initialization, markers, and popups.
 *
 * @param {{ latitude: number, longitude: number, routes: any[] }} props
 */
export default function MapView({ latitude, longitude, routes }) {
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    const olaMaps = new OlaMaps({ apiKey: API_KEY });

    (async () => {
      const myMap = await olaMaps.init({
        style: MAP_STYLE,
        container: 'map',
        center: [longitude, latitude],
        zoom: DEFAULT_ZOOM,
      });

      mapInstanceRef.current = myMap;

      myMap.on('load', () => {
        if (!routes || routes.length === 0) return;

        // Draw all routes
        routes.forEach((route, index) => {
          myMap.addSource(route.routeId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: route.polyline,
              },
            },
          });

          myMap.addLayer({
            id: route.routeId,
            type: 'line',
            source: route.routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': index === 0 ? '#007bff' : '#999', // Blue for first route, gray for others
              'line-width': index === 0 ? 6 : 4,
              'line-opacity': 0.8,
            },
          });
        });

        // Add start and end markers based on the first route
        const firstRoute = routes[0];
        if (firstRoute && firstRoute.polyline.length > 0) {
          olaMaps
            .addMarker({ offset: [0, -10], anchor: 'bottom' })
            .setLngLat(firstRoute.polyline[0])
            .addTo(myMap);

          olaMaps
            .addMarker({ offset: [0, -10], anchor: 'bottom', color: 'red' })
            .setLngLat(firstRoute.polyline[firstRoute.polyline.length - 1])
            .addTo(myMap);
        }

        // Switch highlighted route on click
        routes.forEach((route) => {
          myMap.on('click', route.routeId, () => {
            routes.forEach((r) => {
              myMap.setPaintProperty(r.routeId, 'line-color', '#999');
              myMap.setPaintProperty(r.routeId, 'line-width', 4);
            });
            myMap.setPaintProperty(route.routeId, 'line-color', '#007bff');
            myMap.setPaintProperty(route.routeId, 'line-width', 6);
          });

          myMap.on('mouseenter', route.routeId, () => {
            myMap.getCanvas().style.cursor = 'pointer';
          });
          myMap.on('mouseleave', route.routeId, () => {
            myMap.getCanvas().style.cursor = '';
          });
        });
      });
    })();

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return <div id="map" className="map-container" />;
}
