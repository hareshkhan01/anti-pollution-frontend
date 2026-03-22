import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function FeatureSection({
  id,
  title,
  description,
  bullets,
  image,
  imagePosition,
  zIndex
}) {
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
      className="breathe-card p-8 lg:p-10 flex flex-col justify-center"
      style={{ 
        width: 'clamp(320px, 58vw, 860px)',
        height: 'clamp(380px, 68vh, 560px)'
      }}
    >
      {/* Accent line */}
      <div className="w-8 h-0.5 mb-5 rounded-full" style={{ background: 'var(--breathe-accent)' }} />
      
      <h2
        ref={titleRef}
        className="font-heading font-bold text-breathe-text-primary mb-4"
        style={{ fontSize: 'clamp(22px, 2.6vw, 36px)', lineHeight: 1.2 }}
      >
        {title}
      </h2>
      
      <p
        ref={bodyRef}
        className="text-breathe-text-secondary mb-8"
        style={{ fontSize: 'clamp(14px, 1.2vw, 17px)', lineHeight: 1.65 }}
      >
        {description}
      </p>
      
      <ul ref={bulletsRef} className="space-y-3">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(240,136,62,0.15)', border: '1px solid rgba(240,136,62,0.3)' }}>
              <Check className="w-3 h-3" style={{ color: 'var(--breathe-accent)' }} />
            </div>
            <span className="text-breathe-text-primary" style={{ fontSize: 'clamp(13px, 1vw, 15px)' }}>
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
      className="overflow-hidden"
      style={{ 
        width: 'clamp(260px, 32vw, 480px)',
        height: 'clamp(380px, 68vh, 560px)',
        borderRadius: 8,
        border: '1px solid var(--breathe-border)',
        background: 'var(--breathe-bg-card)'
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover opacity-70"
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
