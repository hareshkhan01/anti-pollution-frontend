import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef(null)
  const blobRef = useRef(null)
  const headlineRef = useRef(null)
  const subheadlineRef = useRef(null)
  const scrollHintRef = useRef(null)
  const breathingCircleRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const blob = blobRef.current
    const headline = headlineRef.current
    const subheadline = subheadlineRef.current
    const scrollHint = scrollHintRef.current
    const breathingCircle = breathingCircleRef.current

    if (!section || !blob || !headline || !subheadline || !scrollHint) return

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(blob, { scale: 0.85, opacity: 0 })
      gsap.set(headline, { y: 24, opacity: 0 })
      gsap.set(subheadline, { y: 16, opacity: 0 })
      gsap.set(scrollHint, { opacity: 0, y: 10 })

      // Entrance animation timeline
      const entranceTl = gsap.timeline({ delay: 0.2 })

      entranceTl
        .to(blob, {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out'
        })
        .to(headline, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.5')
        .to(subheadline, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.4')
        .to(scrollHint, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: false,
          scrub: 0.5,
          onLeaveBack: () => {
            // Reset to visible when scrolling back to top
            gsap.to(blob, { y: 0, scale: 1, opacity: 1, duration: 0.3 })
            gsap.to(headline, { y: 0, opacity: 1, duration: 0.3 })
            gsap.to(subheadline, { y: 0, opacity: 1, duration: 0.3 })
            gsap.to(scrollHint, { opacity: 1, y: 0, duration: 0.3 })
          }
        }
      })

      // EXIT phase (70-100%)
      scrollTl
        .fromTo(blob,
          { y: 0, scale: 1, opacity: 1 },
          { y: '-18vh', scale: 1.08, opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo([headline, subheadline],
          { y: 0, opacity: 1 },
          { y: '-10vh', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(scrollHint,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.7
        )

      // Breathing circle animation
      if (breathingCircle) {
        gsap.to(breathingCircle, {
          scale: 1.2,
          opacity: 0.4,
          duration: 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--breathe-bg-primary)' }}
    >
      {/* Breathing circle behind blob */}
      <div
        ref={breathingCircleRef}
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(45, 180, 215, 0.15) 0%, transparent 70%)',
          opacity: 0.2
        }}
      />

      {/* Main hero blob */}
      <div
        ref={blobRef}
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[62vw] h-[62vw] max-w-[880px] max-h-[880px] blob breathe-gradient"
        style={{ opacity: 0.9 }}
      />

      {/* Decorative floating blobs */}
      <div 
        className="absolute -left-[10vw] -top-[10vh] w-[30vw] h-[30vw] blob breathe-gradient opacity-20 animate-float-slow"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="absolute -right-[8vw] top-[20vh] w-[20vw] h-[20vw] blob breathe-gradient opacity-15 animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div 
        className="absolute left-[15vw] -bottom-[5vh] w-[25vw] h-[25vw] blob breathe-gradient opacity-10 animate-float-slow"
        style={{ animationDelay: '4s' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-[1100px] mx-auto">
        <h1
          ref={headlineRef}
          className="font-heading font-bold text-breathe-text-primary mb-6"
          style={{ 
            fontSize: 'clamp(36px, 5vw, 56px)',
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(255, 255, 255, 0.5)'
          }}
        >
          Breathe Better, Live Better.
        </h1>
        
        <p
          ref={subheadlineRef}
          className="text-breathe-text-secondary max-w-[760px] mx-auto"
          style={{ 
            fontSize: 'clamp(16px, 1.5vw, 20px)',
            lineHeight: 1.6
          }}
        >
          A gentler way to get around—cleaner air, calmer streets, and guidance built for sensitive lungs.
        </p>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-breathe-text-secondary">Scroll to plan your route</span>
        <ChevronDown className="w-5 h-5 text-breathe-accent animate-bounce" />
      </div>
    </section>
  )
}
