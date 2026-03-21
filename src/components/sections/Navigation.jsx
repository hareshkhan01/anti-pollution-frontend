import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun, Wind } from 'lucide-react'

export default function Navigation({ isDarkMode, setIsDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-[#0A1620]/80 backdrop-blur-lg shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full breathe-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Wind className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-lg lg:text-xl text-breathe-text-primary">
                Breathe Easy
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-breathe-text-secondary hover:text-breathe-accent transition-colors duration-300 text-sm font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-breathe-border/30 transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-breathe-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-breathe-text-secondary" />
                )}
              </button>

              {/* CTA Button - Desktop */}
              <button className="hidden lg:block breathe-button px-6 py-2.5 text-sm font-medium">
                Get the App
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-breathe-border/30 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-breathe-text-primary" />
                ) : (
                  <Menu className="w-5 h-5 text-breathe-text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 z-[99] lg:hidden transition-all duration-500 ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-breathe-bg-primary/95 dark:bg-[#0A1620]/95 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative h-full flex flex-col items-center justify-center gap-8">
          {navLinks.map((link, index) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl font-heading font-semibold text-breathe-text-primary hover:text-breathe-accent transition-colors duration-300"
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${index * 100}ms`
              }}
            >
              {link.label}
            </button>
          ))}
          <button 
            className="mt-4 breathe-button px-8 py-3 text-lg font-medium"
            style={{ 
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${navLinks.length * 100}ms`
            }}
          >
            Get the App
          </button>
        </div>
      </div>
    </>
  )
}
