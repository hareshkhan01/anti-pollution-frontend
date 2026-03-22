import { useState, useEffect } from 'react'
import { Menu, X, Wind } from 'lucide-react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      // Highlight active nav link based on scroll position
      const sections = ['route-planner', 'cleaner-routes', 'footer']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(`#${id}`)
            return
          }
        }
      }
      setActiveSection('')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'How it works', href: '#route-planner' },
    { label: 'Features', href: '#cleaner-routes' },
    { label: 'Support', href: '#footer' },
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-md'
            : 'bg-transparent'
        }`}
        style={isScrolled ? { background: 'rgba(13,17,23,0.85)', borderBottom: '1px solid var(--breathe-border)' } : {}}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--breathe-accent)' }}>
                <Wind className="w-4 h-4" style={{ color: '#0d1117' }} />
              </div>
              <span className="font-heading font-bold text-base text-breathe-text-primary">
                Breathe Easy
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm transition-colors duration-200"
                  style={{ color: activeSection === link.href ? 'var(--breathe-accent)' : 'var(--breathe-text-secondary)' }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => document.querySelector('#route-planner')?.scrollIntoView({ behavior: 'smooth' })}
                className="hidden lg:block breathe-button px-4 py-1.5 text-sm"
              >
                Plan a route
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded flex items-center justify-center transition-colors duration-200 hover:bg-breathe-border/30"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen
                  ? <X className="w-4 h-4 text-breathe-text-primary" />
                  : <Menu className="w-4 h-4 text-breathe-text-primary" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-99 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(13,17,23,0.97)', backdropFilter: 'blur(12px)' }}
      >
        <div className="h-full flex flex-col items-center justify-center gap-6" onClick={() => setIsMobileMenuOpen(false)}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-xl font-heading font-semibold text-breathe-text-primary hover:text-breathe-accent transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <button
            className="mt-4 breathe-button px-8 py-3 text-base font-semibold"
            onClick={() => { document.querySelector('#route-planner')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false) }}
          >
            Plan a route
          </button>
        </div>
      </div>
    </>
  )
}
