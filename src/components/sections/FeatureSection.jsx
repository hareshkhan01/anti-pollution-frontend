import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface FeatureSectionProps {
  id: string
  title: string
  description: string
  bullets: string[]
  image: string
  imagePosition: 'left' | 'right'
  zIndex: number
}

export default function FeatureSection({
  id,
  title,
  description,
  bullets,
  image,
  imagePosition,
  zIndex
) {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const bodyRef = useRef(null)
  const bulletsRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    const imageEl = imageRef.current
    const titleEl = titleRef.current
    const bodyEl = bodyRef.current
    const bulletsEl = bulletsRef.current

    if (!section || !card || !imageEl || !titleEl || !bodyEl || !bulletsEl) return

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

      // ENTRANCE (0-30%)
      if (imagePosition === 'right') {
        // Card from left, image from right
        scrollTl
          .fromTo(card,
            { x: '-60vw', rotate: -2, opacity: 0 },
            { x: 0, rotate: 0, opacity: 1, ease: 'none' },
            0
          )
          .fromTo(imageEl,
            { x: '60vw', scale: 0.96, opacity: 0 },
            { x: 0, scale: 1, opacity: 1, ease: 'none' },
            0
          )
      } else {
        // Image from left, card from right
        scrollTl
          .fromTo(imageEl,
            { x: '-60vw', opacity: 0 },
            { x: 0, opacity: 1, ease: 'none' },
            0
          )
          .fromTo(card,
            { x: '60vw', rotate: 2, opacity: 0 },
            { x: 0, rotate: 0, opacity: 1, ease: 'none' },
            0
          )
      }

      // Title entrance
      scrollTl.fromTo(titleEl,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      )

      // Body entrance
      scrollTl.fromTo(bodyEl,
        { y: '5vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      )

      // Bullets entrance with stagger
      const bulletItems = bulletsEl.querySelectorAll('li')
      bulletItems.forEach((item, index) => {
        scrollTl.fromTo(item,
          { x: '-4vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.14 + index * 0.02
        )
      })

      // SETTLE (30-70%) - hold position

      // EXIT (70-100%)
      if (imagePosition === 'right') {
        scrollTl
          .to(card,
            { x: '-40vw', rotate: 2, opacity: 0.25, ease: 'power2.in' },
            0.7
          )
          .to(imageEl,
            { x: '40vw', opacity: 0.25, ease: 'power2.in' },
            0.7
          )
      } else {
        scrollTl
          .to(imageEl,
            { x: '-40vw', opacity: 0.25, ease: 'power2.in' },
            0.7
          )
          .to(card,
            { x: '40vw', rotate: -2, opacity: 0.25, ease: 'power2.in' },
            0.7
          )
      }

      scrollTl
        .to(titleEl,
          { y: '-4vh', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .to(bodyEl,
          { opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .to(bulletItems,
          { opacity: 0.2, ease: 'power2.in', stagger: 0.01 },
          0.7
        )
    }, section)

    return () => ctx.revert()
  }, [imagePosition])

  const cardContent = (
    <div
      ref={cardRef}
      className="breathe-card p-8 lg:p-12 flex flex-col justify-center"
      style={{ 
        width: 'clamp(320px, 58vw, 920px)',
        height: 'clamp(400px, 72vh, 600px)'
      }}
    >
      {/* Accent dot */}
      <div className="w-2 h-2 rounded-full bg-breathe-accent mb-4" />
      
      <h2
        ref={titleRef}
        className="font-heading font-bold text-breathe-text-primary mb-4"
        style={{ fontSize: 'clamp(24px, 3vw, 40px)', lineHeight: 1.15 }}
      >
        {title}
      </h2>
      
      <p
        ref={bodyRef}
        className="text-breathe-text-secondary mb-8"
        style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', lineHeight: 1.6 }}
      >
        {description}
      </p>
      
      <ul ref={bulletsRef} className="space-y-4">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-breathe-accent/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-breathe-accent" />
            </div>
            <span className="text-breathe-text-primary font-medium" style={{ fontSize: 'clamp(14px, 1.1vw, 16px)' }}>
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  const imageContent = (
    <div
      ref={imageRef}
      className="rounded-4xl overflow-hidden shadow-card"
      style={{ 
        width: 'clamp(280px, 34vw, 520px)',
        height: 'clamp(400px, 72vh, 600px)'
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  )

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: 'var(--breathe-bg-primary)',
        zIndex 
      }}
    >
      <div className="w-full px-[6vw] flex items-center justify-between gap-8">
        {imagePosition === 'left' ? (
          <>
            {imageContent}
            {cardContent}
          </>
        ) : (
          <>
            {cardContent}
            {imageContent}
          </>
        )}
      </div>
    </section>
  )
}
