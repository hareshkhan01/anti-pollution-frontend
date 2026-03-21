import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/sections/Navigation'
import HeroSection from './components/sections/HeroSection'
import RoutePlannerSection from './components/sections/RoutePlannerSection'
import FeatureSection from './components/sections/FeatureSection'
import FeaturesGridSection from './components/sections/FeaturesGridSection'
import FooterSection from './components/sections/FooterSection'
import FloatingParticles from './components/FloatingParticles'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
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
          image="/feature_image_01.jpg"
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
          image="/feature_image_02.jpg"
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
          image="/feature_image_03.jpg"
          imagePosition="right"
          zIndex={50}
        />
        <FeaturesGridSection />
        <FooterSection />
      </main>
    </div>
  )
}

export default App