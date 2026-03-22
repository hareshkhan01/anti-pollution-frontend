import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Flag, ArrowRight, Wind, TrendingUp, VolumeX } from 'lucide-react'
import { fetchLatLongByAddr } from '../../api/getLatLong'

gsap.registerPlugin(ScrollTrigger)

const FEATURE_PILLS = [
  { icon: Wind, label: 'Air quality', color: '#2DB4D7', bg: 'rgba(45,180,215,0.10)' },
  { icon: TrendingUp, label: 'Elevation', color: '#5BA4CF', bg: 'rgba(91,164,207,0.10)' },
  { icon: VolumeX, label: 'Quiet streets', color: '#7EE3FA', bg: 'rgba(126,227,250,0.10)' },
]

export default function RoutePlannerSection() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const titleRef = useRef(null)
  const inputARef = useRef(null)
  const inputBRef = useRef(null)
  const buttonRef = useRef(null)
  const pillsRef = useRef(null)
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)

  const [startingPoint, setStartingPoint] = useState('')
  const [destination, setDestination] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    const title = titleRef.current
    const inputA = inputARef.current
    const inputB = inputBRef.current
    const button = buttonRef.current
    const pills = pillsRef.current
    const blob1 = blob1Ref.current
    const blob2 = blob2Ref.current

    if (!section || !card || !title || !inputA || !inputB || !button) return

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        }
      })

      // ENTRANCE
      scrollTl
        .fromTo(card, { y: '60vh', scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: 'none' }, 0)
        .fromTo(title, { x: '-8vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo(inputA, { x: '-10vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.08)
        .fromTo(inputB, { x: '10vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.10)
        .fromTo(button, { y: '10vh', scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: 'none' }, 0.12)
        .fromTo(pills, { y: 16, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.15)
        .fromTo([blob1, blob2], { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.35, ease: 'none' }, 0)

      // EXIT
      scrollTl
        .to(card, { y: '-55vh', scale: 0.96, opacity: 0.25, ease: 'power2.in' }, 0.7)
        .to(title, { x: '-6vw', opacity: 0.2, ease: 'power2.in' }, 0.7)
        .to(inputA, { x: '-8vw', opacity: 0.2, ease: 'power2.in' }, 0.7)
        .to(inputB, { x: '8vw', opacity: 0.2, ease: 'power2.in' }, 0.7)
        .to(button, { y: '-8vh', opacity: 0.2, ease: 'power2.in' }, 0.7)
        .to(pills, { opacity: 0.2, ease: 'power2.in' }, 0.7)
        .to([blob1, blob2], { scale: 1.1, opacity: 0, ease: 'power2.in' }, 0.7)

      gsap.to(blob1, { y: '+=10', duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to(blob2, { y: '-=10', duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true })
    }, section)

    return () => ctx.revert()
  }, [])

  const handleFindRoute = async () => {
    if (!startingPoint || !destination) return
    setIsSearching(true)

    try {
      const sourceRes = await fetchLatLongByAddr(startingPoint)
      const destRes = await fetchLatLongByAddr(destination)
      console.log(sourceRes, destRes)

      const originLoc = sourceRes?.geocodingResults?.[0]?.geometry?.location
      const destLoc = destRes?.geocodingResults?.[0]?.geometry?.location

      if (!originLoc || !destLoc) {
        alert("Could not find coordinates for one or both locations. Please try more specific addresses.")
        setIsSearching(false)
        return
      }

      navigate('/map', {
        state: {
          originLat: originLoc.lat,
          originLng: originLoc.lng,
          destLat: destLoc.lat,
          destLng: destLoc.lng
        }
      })
    } catch (err) {
      console.error(err)
      alert("Error fetching location data. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="route-planner"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
      style={{ backgroundColor: 'var(--breathe-bg-primary)' }}
    >
      {/* Decorative blobs */}
      <div ref={blob1Ref} className="absolute -left-[10vw] -top-[10vh] w-[34vw] h-[34vw] blob breathe-gradient opacity-0" />
      <div ref={blob2Ref} className="absolute -right-[10vw] -bottom-[12vh] w-[38vw] h-[38vw] blob breathe-gradient opacity-0" />

      {/* Planner Card */}
      <div
        ref={cardRef}
        className="relative w-[min(90vw,680px)] breathe-card overflow-hidden"
        style={{ padding: 0 }}
      >
        {/* Card top accent bar */}
        <div
          className="w-full h-1.5 breathe-gradient"
          style={{ borderRadius: '28px 28px 0 0' }}
        />

        <div className="px-8 pt-7 pb-8 lg:px-10 lg:pt-8 lg:pb-10">
          {/* Header */}
          <div ref={titleRef} className="mb-7">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--breathe-accent)' }}>
              Route Planner
            </p>
            <h2
              className="font-heading font-bold text-breathe-text-primary leading-tight"
              style={{ fontSize: 'clamp(20px, 2.4vw, 30px)' }}
            >
              Plan a low-pollution route
            </h2>
          </div>

          {/* Input fields */}
          <div className="space-y-3 mb-5">
            <div ref={inputARef} className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: 'var(--breathe-accent)' }}>
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Starting point"
                value={startingPoint}
                onChange={(e) => setStartingPoint(e.target.value)}
                className="w-full h-13 pl-12 pr-5 breathe-input text-breathe-text-primary placeholder:text-breathe-text-secondary/60 text-sm"
                style={{ height: '52px' }}
              />
            </div>

            {/* Connector dot */}
            <div className="flex items-center gap-3 px-5">
              <div className="w-px flex-1" style={{ background: 'var(--breathe-border)' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--breathe-accent)', opacity: 0.5 }} />
              <div className="w-px flex-1" style={{ background: 'var(--breathe-border)' }} />
            </div>

            <div ref={inputBRef} className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#5BA4CF' }}>
                <Flag className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-13 pl-12 pr-5 breathe-input text-breathe-text-primary placeholder:text-breathe-text-secondary/60 text-sm"
                style={{ height: '52px' }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            ref={buttonRef}
            onClick={handleFindRoute}
            disabled={isSearching || !startingPoint || !destination}
            className="w-full breathe-button flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
            style={{ height: '52px' }}
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Finding route...</span>
              </>
            ) : (
              <>
                <span>Find the safest route</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Feature pills */}
          <div ref={pillsRef} className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            {FEATURE_PILLS.map(({ icon: Icon, label, color, bg }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: bg, color }}
              >
                <Icon className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
