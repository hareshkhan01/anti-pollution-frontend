import { useEffect, useState } from 'react';
import './App.css';
import { OlaMaps } from 'olamaps-web-sdk';

function App() {

  const [currentLat, setCurrentLat] = useState(null)
  const [currentLong, setCurrentLong] = useState(null)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLat(position.coords.latitude)
      setCurrentLong(position.coords.longitude)

    })
  }, [])

  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: '90NQ4qVGTY4rF9fkXnyyqz432I3drMT9Ujqe09mN',
    });

    (async () => {
      const myMap = await olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: 'map',
        center: [currentLong, currentLat],
        zoom: 9,
      });

      const olaIcon = document.createElement('div');
      olaIcon.classList.add('olalogo');

      olaMaps.addMarker({ element: olaIcon, offset: [0, -10], anchor: 'bottom' })
        .setLngLat([currentLong, currentLat])
        .addTo(myMap);

      olaMaps.addMarker({ offset: [0, 6], anchor: 'bottom' })
        .setLngLat([currentLong, currentLat])
        .addTo(myMap);

      const popup = olaMaps.addPopup({ offset: [0, -30], anchor: 'bottom' })
        .setHTML('<div>This is a simple Popup</div>');

      olaMaps.addMarker({
        offset: [0, 6],
        anchor: 'bottom',
        color: 'red',
        draggable: true,
      }).setLngLat([currentLong, currentLat])
        .setPopup(popup)
        .addTo(myMap);
    })();
    console.log([currentLong, currentLat])
  }, [currentLat, currentLong]);

  return (
    <>
      <h1>Hello Map</h1>
      <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
    </>
  );
}

export default App;
