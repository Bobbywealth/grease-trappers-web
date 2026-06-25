/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Brief-specified palette
          copper: '#8C5523',     // primary bronze
          sienna: '#B97832',     // bronze
          bronze: '#B97832',     // alias
          gold: '#D9A441',       // gold accent
          champagne: '#F6D58A',  // light gold
          cream: '#F7F2E8',      // background tint
          black: '#0D0D0D',      // brief-specified background
          dark: '#0D0D0D',
          pink: '#E84DB2',       // legacy (unused)
        },
      },
      fontFamily: {
        display: ['Manrope', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        zoomHero: {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.03)' },
        },
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        underlineGrow: {
          '0%':   { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'zoom-hero': 'zoomHero 20s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-up-delay-1': 'fadeUp 0.8s ease-out 0.1s forwards',
        'fade-up-delay-2': 'fadeUp 0.8s ease-out 0.2s forwards',
        'fade-up-delay-3': 'fadeUp 0.8s ease-out 0.3s forwards',
        'fade-up-delay-4': 'fadeUp 0.8s ease-out 0.4s forwards',
      },
    },
  },
  plugins: [],
};