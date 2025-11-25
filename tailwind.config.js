/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luminous: {
          bg: '#FFFBF2',       // Warm Cream
          card: '#FFFFFF',     // Pure White
          gold: '#D4AF37',     // Classic Gold
          goldLight: '#F9E5B9', // Pale Gold
          saffron: '#FF6B35',  // Vibrant Orange
          maroon: '#4A0404',   // Deep Red
          text: '#2D1810',     // Dark Brown
          gray: '#8A8A8A',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Cinzel', 'serif'], // New decorative font
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
