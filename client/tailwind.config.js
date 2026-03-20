/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // Contrôlé par la classe 'dark' sur <html>
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#EFF6FF', 100:'#DBEAFE', 200:'#BFDBFE',
          400:'#60A5FA', 500:'#3B82F6', 600:'#2563EB',
          700:'#1D4ED8', 800:'#1E40AF', 900:'#1E3A5F',
        },
        accent : { 400:'#FBBF24', 500:'#F59E0B', 600:'#D97706' },
        success: { 100:'#DCFCE7', 500:'#22C55E', 600:'#16A34A' },
        danger : { 100:'#FEE2E2', 500:'#EF4444', 600:'#DC2626' },
        warning: { 100:'#FEF3C7', 500:'#F59E0B', 600:'#D97706' },
      },
      fontFamily: {
        sans   : ["'Outfit'", 'system-ui', 'sans-serif'],
        display: ["'Syne'",   'sans-serif'],
      },
      animation: {
        'fade-in'   : 'fadeIn 0.25s ease-out',
        'slide-up'  : 'slideUp 0.3s ease-out',
        'slide-in-r': 'slideInRight 0.3s ease-out',
        'spin-slow' : 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn      : { from:{ opacity:'0' }, to:{ opacity:'1' } },
        slideUp     : { from:{ opacity:'0', transform:'translateY(10px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        slideInRight: { from:{ opacity:'0', transform:'translateX(100%)' }, to:{ opacity:'1', transform:'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
