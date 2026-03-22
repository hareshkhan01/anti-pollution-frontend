import { useEffect, useRef, useState, useMemo } from 'react';
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
  const [sliderIndex, setSliderIndex] = useState(0);

  // Sort routes by pes ascending
  const sortedRoutes = useMemo(() => {
    if (!routes) return [];
    return [...routes].sort((a, b) => (a.pes || 0) - (b.pes || 0));
  }, [routes]);

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
        if (!sortedRoutes || sortedRoutes.length === 0) return;
        console.log("Maps: ", sortedRoutes)
        // Calculate bounds to view all routes
        if (sortedRoutes.length > 0 && sortedRoutes[0].polyline && sortedRoutes[0].polyline.length > 0) {
          let minLng = sortedRoutes[0].polyline[0][0];
          let maxLng = sortedRoutes[0].polyline[0][0];
          let minLat = sortedRoutes[0].polyline[0][1];
          let maxLat = sortedRoutes[0].polyline[0][1];
          
          sortedRoutes.forEach(route => {
            route.polyline.forEach(coord => {
              if (coord[0] < minLng) minLng = coord[0];
              if (coord[0] > maxLng) maxLng = coord[0];
              if (coord[1] < minLat) minLat = coord[1];
              if (coord[1] > maxLat) maxLat = coord[1];
            });
          });
          
          myMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40 });
        }

        // Draw all routes
        sortedRoutes.forEach((route, index) => {
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
        const firstRoute = sortedRoutes[0];
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
        sortedRoutes.forEach((route, index) => {
          myMap.on('click', route.routeId, () => {
            setSliderIndex(index);
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

  // Effect to handle slider index changes and update highlighted route
  useEffect(() => {
    if (!mapInstanceRef.current || !sortedRoutes || sortedRoutes.length === 0) return;
    const myMap = mapInstanceRef.current;
    
    // Make sure the map style is loaded before trying to update layer properties
    if (myMap.getStyle && myMap.getStyle()) {
      try {
        sortedRoutes.forEach((r, index) => {
          if (myMap.getLayer(r.routeId)) {
            const isSelected = index === sliderIndex;
            myMap.setPaintProperty(r.routeId, 'line-color', isSelected ? '#007bff' : '#999');
            myMap.setPaintProperty(r.routeId, 'line-width', isSelected ? 6 : 4);
          }
        });
      } catch (e) {
        console.log("Layers not ready yet for update.");
      }
    }
  }, [sliderIndex, sortedRoutes]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="map-container w-full h-full" />
      
      {/* Route Filter Slider Overlay */}
      {sortedRoutes.length > 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 breathe-card px-6 py-4 flex flex-col gap-3 w-[min(90vw,420px)] shadow-xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-breathe-text-primary">Pollution Level Filter</label>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,123,255,0.1)', color: '#007bff' }}>
              PES: {sortedRoutes[sliderIndex]?.pes || 'N/A'}
            </span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max={Math.max(0, sortedRoutes.length - 1)} 
            step="1" 
            value={sliderIndex} 
            onChange={(e) => setSliderIndex(Number(e.target.value))}
            className="w-full accent-[#007bff] cursor-pointer"
          />
          
          <div className="flex justify-between text-xs font-medium text-breathe-text-secondary mt-1 options-labels">
            <span className={sliderIndex === 0 ? "text-[#007bff]" : ""}>Best Route</span>
            {sortedRoutes.length > 2 && <span className={sliderIndex === 1 ? "text-[#007bff]" : ""} style={{ transform: 'translateX(-50%)', left: '50%', position: 'absolute' }}>Moderate Polluted</span>}
            {sortedRoutes.length > 1 && <span className={sliderIndex === sortedRoutes.length - 1 && sliderIndex !== 0 ? "text-[#007bff]" : ""}>Highly Polluted</span>}
          </div>
        </div>
      )}
    </div>
  );
}
