import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Home page imports
import HeroSection from "./components/sections/HeroSection";
import RoutePlannerSection from "./components/sections/RoutePlannerSection";
import FeatureSection from "./components/sections/FeatureSection";
import FeaturesGridSection from "./components/sections/FeaturesGridSection";
import FooterSection from "./components/Footer/FooterSection.jsx";
import FloatingParticles from "./components/FloatingParticles.jsx";

import Navigation from "./components/Header/Header";
import Footer from "./components/Footer/FooterSection";

import { useGeolocation } from "./hooks/useGeolocation";
import Header from "./components/Header/Header";
import MapView from "./components/MapView/MapView";
import { fetchRoutesData } from "./api/routeApi";
import mockPostData from "./data/mockPostData.json";
import { fetchLatLongByAddr } from "./api/getLatLong";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const mainRef = useRef(null);

  useEffect(() => {
    // Always dark
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02,
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0,
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out",
        },
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen">
      <div className="grain-overlay" />
      <FloatingParticles />
      <main className="relative">
        <HeroSection />
        <RoutePlannerSection />
        <FeatureSection
          id="cleaner-routes"
          title="Cleaner routes, calmer lungs"
          description="We prioritize streets with lower traffic, greener corridors, and better ventilation—so you can move without the wheeze."
          bullets={["", "Green corridors & parks", "Shorter exposure time"]}
          image="https://placehold.co/600x400"
          imagePosition="right"
          zIndex={30}
        />
        <FeatureSection
          id="air-awareness"
          title="Know the air before you step out"
          description="Real-time air quality, pollen, and weather—personalized to your sensitivity and daily routine."
          bullets={["AQI + pollen forecasts", "Sensitivity-based tips", "Best times to travel"]}
          image="https://placehold.co/600x400"
          imagePosition="left"
          zIndex={40}
        />
        <FeatureSection
          id="breathing-friendly"
          title="Guidance that respects your pace"
          description="Turn-by-turn directions designed for steadiness: fewer hills, less congestion, and optional reminders to pause and breathe."
          bullets={["Elevation-friendly paths", "Rest-stop suggestions", "Gentle audio cues"]}
          image="https://placehold.co/600x400"
          imagePosition="right"
          zIndex={50}
        />
        <FeaturesGridSection />
        <FooterSection />
      </main>
    </div>
  );
}

function MapPage() {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const location = useLocation();

  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState(null);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setRoutesLoading(true);
        let postPayload = mockPostData;

        if (location.state && location.state.originLat) {
          postPayload = {
            originLat: Number(location.state.originLat),
            originLng: Number(location.state.originLng),
            destLat: Number(location.state.destLat),
            destLng: Number(location.state.destLng),
          };
        }

        // Using dynamically constructed payload based on form input or mock data
        const data = await fetchRoutesData(postPayload);
        // Assuming API might return the array directly or inside a `routes` property or `data` property
        const actualRoutes = Array.isArray(data) ? data : data?.routes || data?.data || [];
        console.log("Fetched routes:", actualRoutes);
        setRoutes(actualRoutes);
      } catch (err) {
        setRoutesError(err.message);
      } finally {
        setRoutesLoading(false);
      }
    };

    loadRoutes();
  }, [location.state]);

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
      <div
        className="app-status"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1rem",
          background: "var(--breathe-bg-primary)",
          color: "var(--breathe-text-primary)",
        }}
      >
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ff4d4d" }}>
          ⚠️ Route Planning Error
        </p>
        <p style={{ fontSize: "1.1rem", maxWidth: "80%", textAlign: "center" }}>{routesError}</p>
        <a
          href="/"
          className="breathe-button"
          style={{
            padding: "0.75rem 1.5rem",
            textDecoration: "none",
            marginTop: "1rem",
            display: "inline-block",
          }}
        >
          Try Another Location
        </a>
      </div>
    );
  }

  return (
    <>
      <MapView latitude={latitude} longitude={longitude} routes={routes} />
    </>
  );
}

function TestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("jadajsdjasdjasjd");
    const fetchData = async () => {
      try {
        const res = await fetchLatLongByAddr("Kolkata, West Bengal");
        console.log(res.geocodingResults);
        setData(res.geocodingResults);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navigation />
      <div style={{ padding: "2rem", background: "#333", color: "white", minHeight: "100vh" }}>
        <h1>Test Route API Output</h1>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!data && !error ? <p>Loading data...</p> : null}
        {data && (
          <pre style={{ background: "#111", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <Footer />
      </div>
    </>
  );

  function App() {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
