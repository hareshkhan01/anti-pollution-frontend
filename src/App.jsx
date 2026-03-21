import { useEffect } from 'react';
import './App.css';
import { OlaMaps } from 'olamaps-web-sdk';

function App() {
  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: '90NQ4qVGTY4rF9fkXnyyqz432I3drMT9Ujqe09mN',
    });

    olaMaps.init({
      style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: 'map',
      center: [77.61648476788898, 12.931423492103944],
      zoom: 15,
    });
  }, []);

  return (
    <>
      <h1>Hello Map</h1>
      <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
    </>
  );
}

export default App;
