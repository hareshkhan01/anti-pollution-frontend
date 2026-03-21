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
      className="relative w-full py-16 lg:py-20 z-[70]"
      style={{ backgroundColor: 'var(--breathe-bg-primary)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-12">
          {/* Left column - Logo and tagline */}
          <div ref={leftColRef}>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full breathe-gradient flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-breathe-text-primary">
                Breathe Easy
              </span>
            </a>
            
            <p className="text-breathe-text-secondary mb-6 max-w-sm">
              Breathe easier—one route at a time.
            </p>
            
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-breathe-border/30 flex items-center justify-center hover:bg-breathe-accent/20 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-breathe-text-secondary hover:text-breathe-accent transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-breathe-border/30 flex items-center justify-center hover:bg-breathe-accent/20 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-breathe-text-secondary hover:text-breathe-accent transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-breathe-border/30 flex items-center justify-center hover:bg-breathe-accent/20 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-breathe-text-secondary hover:text-breathe-accent transition-colors" />
              </a>
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
          className="breathe-card p-6 lg:p-8 mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h4 className="font-heading font-semibold text-breathe-text-primary mb-1">
                Get air quality tips
              </h4>
              <p className="text-breathe-text-secondary text-sm">
                Weekly insights for healthier breathing.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full lg:w-64 h-12 px-5 breathe-input text-breathe-text-primary placeholder:text-breathe-text-secondary/60"
                  disabled={isSubscribed}
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribed || !email}
                className="h-12 px-6 breathe-button flex items-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                {isSubscribed ? (
                  <span>Subscribed!</span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-breathe-border">
          <p className="text-breathe-text-secondary text-sm">
            © 2026 Breathe Easy. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-breathe-text-secondary hover:text-breathe-accent transition-colors duration-300 text-sm">
              Privacy
            </a>
            <a href="#" className="text-breathe-text-secondary hover:text-breathe-accent transition-colors duration-300 text-sm">
              Terms
            </a>
            <a href="#" className="text-breathe-text-secondary hover:text-breathe-accent transition-colors duration-300 text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
