import { useEffect } from 'react';
import './App.css';
import { OlaMaps } from 'olamaps-web-sdk';

function App() {
  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: '90NQ4qVGTY4rF9fkXnyyqz432I3drMT9Ujqe09mN',
    }, []);

    olaMaps.init({
      style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: 'map',
      center: [22.5742293, 88.4340046],
      zoom: 5,
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
