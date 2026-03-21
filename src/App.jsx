import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Home page imports
import Navigation from './components/sections/Navigation'
import HeroSection from './components/sections/HeroSection'
import RoutePlannerSection from './components/sections/RoutePlannerSection'
import FeatureSection from './components/sections/FeatureSection'
import FeaturesGridSection from './components/sections/FeaturesGridSection'
import FooterSection from './components/sections/FooterSection'
import FloatingParticles from "./components/FloatingParticles.jsx"

// Map page imports
import { useGeolocation } from './hooks/useGeolocation';
import Header from './components/Header/Header';
import MapView from './components/MapView/MapView';
import { fetchRoutesData } from './api/routeApi';
import mockPostData from './data/mockPostData.json';

import './App.css'

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const mainRef = useRef(null)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start)

      const maxScroll = ScrollTrigger.maxScroll(window)
      if (!maxScroll || pinned.length === 0) return

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }))

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02)
            if (!inPinned) return value

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            )
            return target
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out"
        }
      })
    }

    const timer = setTimeout(setupGlobalSnap, 500)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <div ref={mainRef} className="relative min-h-screen">
      <div className="grain-overlay" />
      <FloatingParticles />
      <Navigation
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="relative">
        <HeroSection />
        <RoutePlannerSection />
        <FeatureSection
          id="cleaner-routes"
          title="Cleaner routes, calmer lungs"
          description="We prioritize streets with lower traffic, greener corridors, and better ventilation—so you can move without the wheeze."
          bullets={[
            "Low-traffic roads first",
            "Green corridors & parks",
            "Shorter exposure time"
          ]}
          image="https://placehold.co/600x40"
          imagePosition="right"
          zIndex={30}
        />
        <FeatureSection
          id="air-awareness"
          title="Know the air before you step out"
          description="Real-time air quality, pollen, and weather—personalized to your sensitivity and daily routine."
          bullets={[
            "AQI + pollen forecasts",
            "Sensitivity-based tips",
            "Best times to travel"
          ]}
          image="https://placehold.co/600x400"
          imagePosition="left"
          zIndex={40}
        />
        <FeatureSection
          id="breathing-friendly"
          title="Guidance that respects your pace"
          description="Turn-by-turn directions designed for steadiness: fewer hills, less congestion, and optional reminders to pause and breathe."
          bullets={[
            "Elevation-friendly paths",
            "Rest-stop suggestions",
            "Gentle audio cues"
          ]}
          image="https://placehold.co/600x400"
          imagePosition="right"
          zIndex={50}
        />
        <FeaturesGridSection />
        <FooterSection />
      </main>
    </div>
  )
}

function MapPage() {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  )
}

export default App