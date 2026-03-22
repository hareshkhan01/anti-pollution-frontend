import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Route, Wind, Heart, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Route,
    title: 'Low-pollution routing',
    description: 'Prioritizes cleaner air corridors and low-traffic streets.',
    color: 'var(--breathe-accent)',
    bg: 'rgba(240,136,62,0.1)',
    border: 'rgba(240,136,62,0.25)',
  },
  {
    icon: Wind,
    title: 'Real-time air + pollen',
    description: 'Forecasts that match your personal sensitivity profile.',
    color: 'var(--breathe-accent-blue)',
    bg: 'rgba(88,166,255,0.1)',
    border: 'rgba(88,166,255,0.25)',
  },
  {
    icon: Heart,
    title: 'Breathing-friendly guidance',
    description: 'Gentle directions with rest stops and steady pacing.',
    color: 'var(--breathe-accent-green)',
    bg: 'rgba(63,185,80,0.1)',
    border: 'rgba(63,185,80,0.25)',
  },
]

export default function FeaturesGridSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const cards = cardsRef.current
    const cta = ctaRef.current

    if (!section || !title || !cards || !cta) return

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(title,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Cards stagger animation
      const cardElements = cards.querySelectorAll('.feature-card')
      gsap.fromTo(cardElements,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // CTA animation
      gsap.fromTo(cta,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="features-grid"
      className="relative w-full py-20 lg:py-28 overflow-hidden z-60"
      style={{ backgroundColor: 'var(--breathe-bg-secondary)', borderTop: '1px solid var(--breathe-border)' }}
    >
      <div className="max-w-275 mx-auto px-6">
        {/* Section title */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="dash-badge dash-badge-orange mb-4 inline-flex">Built for sensitive lungs</span>
          <h2
            ref={titleRef}
            className="font-heading font-bold text-breathe-text-primary"
            style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}
          >
            Everything you need to breathe easier
          </h2>
        </div>

        {/* Feature cards grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-16 lg:mb-20"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card breathe-card p-6 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded flex items-center justify-center mb-5" style={{ background: feature.bg, border: `1px solid ${feature.border}` }}>
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              
              {/* Title */}
              <h3 className="font-heading font-semibold text-breathe-text-primary mb-2" style={{ fontSize: 'clamp(15px, 1.3vw, 18px)' }}>
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-breathe-text-secondary" style={{ fontSize: 'clamp(13px, 1vw, 15px)', lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Big CTA */}
        <div
          ref={ctaRef}
          className="text-center"
        >
          <h3
            className="font-heading font-bold text-breathe-text-primary mb-6"
            style={{ fontSize: 'clamp(22px, 2.2vw, 30px)' }}
          >
            Ready for calmer journeys?
          </h3>
          
          <button
            onClick={() => document.querySelector('#route-planner')?.scrollIntoView({ behavior: 'smooth' })}
            className="breathe-button px-8 py-3 text-base font-semibold inline-flex items-center gap-2 group"
          >
            <span>Start planning</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          
          <p className="text-breathe-text-secondary text-sm mt-4">
            Free to start. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
