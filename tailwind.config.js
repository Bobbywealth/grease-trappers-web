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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%':      { transform: 'translate(10px, -15px) scale(1.05)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.3 },
          '50%':      { opacity: 0.6 },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInLeft: {
          '0%':   { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: 0, transform: 'scale(0.92)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        spinSlow: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
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
        'fade-up-delay-5': 'fadeUp 0.8s ease-out 0.5s forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'slide-in-left': 'slideInLeft 0.7s ease-out forwards',
        'slide-in-right': 'slideInRight 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'spin-slow': 'spinSlow 20s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'underline-grow': 'underlineGrow 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};