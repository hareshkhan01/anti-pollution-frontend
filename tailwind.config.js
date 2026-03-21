/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        breathe: {
          bg: {
            primary: 'var(--breathe-bg-primary)',
            secondary: 'var(--breathe-bg-secondary)',
          },
          accent: 'var(--breathe-accent)',
          'accent-light': 'var(--breathe-accent-light)',
          'accent-lighter': 'var(--breathe-accent-lighter)',
          text: {
            primary: 'var(--breathe-text-primary)',
            secondary: 'var(--breathe-text-secondary)',
          },
          border: 'var(--breathe-border)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '28px',
        'pill': '999px',
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'card': '0 18px 45px rgba(14, 42, 60, 0.10)',
        'card-hover': '0 24px 55px rgba(14, 42, 60, 0.14)',
        'input': '0 10px 30px rgba(14, 42, 60, 0.08)',
        'button': '0 14px 35px rgba(45, 180, 215, 0.28)',
        'button-hover': '0 18px 45px rgba(45, 180, 215, 0.35)',
        'glow': '0 0 20px rgba(45, 180, 215, 0.3)',
        'glow-strong': '0 0 40px rgba(45, 180, 215, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.15)", opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%": { transform: "translateY(-15px) translateX(10px)" },
          "66%": { transform: "translateY(10px) translateX(-5px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(45, 180, 215, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(45, 180, 215, 0.5)" },
        },
        "particle": {
          "0%": { transform: "translateY(100vh) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translateY(-100vh) translateX(50px)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "particle": "particle 12s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
