import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Wind, Twitter, Instagram, Linkedin, Send } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const footerLinks = {
  Product: ['Features', 'Pricing', 'API', 'Integrations'],
  Support: ['Help Center', 'Contact Us', 'Community', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

export default function FooterSection() {
  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const newsletterRef = useRef(null)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const leftCol = leftColRef.current
    const rightCol = rightColRef.current
    const newsletter = newsletterRef.current

    if (!section || !leftCol || !rightCol || !newsletter) return

    const ctx = gsap.context(() => {
      // Left column animation
      gsap.fromTo(leftCol,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Right column animation
      gsap.fromTo(rightCol,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Newsletter animation
      gsap.fromTo(newsletter,
        { scale: 0.98, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <footer
      ref={sectionRef}
      id="footer"
      className="relative w-full py-14 lg:py-18 z-70"
      style={{ backgroundColor: 'var(--breathe-bg-secondary)', borderTop: '1px solid var(--breathe-border)' }}
    >
      <div className="max-w-[1100] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-12">
          {/* Left column - Logo and tagline */}
          <div ref={leftColRef}>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--breathe-accent)' }}>
                <Wind className="w-4 h-4" style={{ color: '#0d1117' }} />
              </div>
              <span className="font-heading font-bold text-lg text-breathe-text-primary">
                Breathe Easy
              </span>
            </a>
            
            <p className="text-breathe-text-secondary mb-6 max-w-sm">
              Breathe easier—one route at a time.
            </p>
            
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[{ Icon: Twitter, label: 'Twitter' }, { Icon: Instagram, label: 'Instagram' }, { Icon: Linkedin, label: 'LinkedIn' }].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                  style={{ border: '1px solid var(--breathe-border)', color: 'var(--breathe-text-secondary)' }}
                  aria-label={label}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--breathe-accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--breathe-border)'}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right column - Links and newsletter */}
          <div ref={rightColRef} className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-heading font-semibold text-breathe-text-primary mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-breathe-text-secondary hover:text-breathe-accent transition-colors duration-300 text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div
          ref={newsletterRef}
          className="breathe-card p-5 lg:p-6 mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h4 className="font-heading font-semibold text-breathe-text-primary mb-1 text-sm">
                Get air quality tips
              </h4>
              <p className="text-breathe-text-secondary text-xs">
                Weekly insights for healthier breathing.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full lg:w-56 h-10 px-4 breathe-input text-breathe-text-primary placeholder:text-breathe-text-secondary/60 text-sm"
                disabled={isSubscribed}
              />
              <button
                type="submit"
                disabled={isSubscribed || !email}
                className="h-10 px-5 breathe-button flex items-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                {isSubscribed ? <span>Subscribed!</span> : <><span>Subscribe</span><Send className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6" style={{ borderTop: '1px solid var(--breathe-border)' }}>
          <p className="text-breathe-text-secondary text-xs">
            © 2026 Breathe Easy. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" className="text-breathe-text-secondary hover:text-breathe-accent transition-colors duration-200 text-xs">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
