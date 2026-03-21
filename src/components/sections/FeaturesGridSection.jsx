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
  },
  {
    icon: Wind,
    title: 'Real-time air + pollen',
    description: 'Forecasts that match your personal sensitivity profile.',
  },
  {
    icon: Heart,
    title: 'Breathing-friendly guidance',
    description: 'Gentle directions with rest stops and steady pacing.',
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
      className="relative w-full py-20 lg:py-32 overflow-hidden z-[60]"
      style={{ backgroundColor: 'var(--breathe-bg-secondary)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="font-heading font-bold text-breathe-text-primary text-center mb-12 lg:mb-16"
          style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
        >
          Built for sensitive lungs
        </h2>

        {/* Feature cards grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card breathe-card p-8 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl breathe-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="font-heading font-semibold text-breathe-text-primary mb-3" style={{ fontSize: 'clamp(18px, 1.5vw, 22px)' }}>
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-breathe-text-secondary" style={{ fontSize: 'clamp(14px, 1.1vw, 16px)', lineHeight: 1.6 }}>
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
            style={{ fontSize: 'clamp(24px, 2.5vw, 32px)' }}
          >
            Ready for calmer journeys?
          </h3>
          
          <button className="breathe-button px-10 py-4 text-lg font-medium inline-flex items-center gap-3 group">
            <span>Get the app</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <p className="text-breathe-text-secondary text-sm mt-4">
            Free to start. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
