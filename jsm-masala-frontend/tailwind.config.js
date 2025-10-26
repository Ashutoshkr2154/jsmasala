/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F59E0B', // Saffron
          accent: '#B91C1C', // Deep Red
          neutral: '#5C4033', // Earth Brown
          background: '#FFF8F1', // Off-white
          text: '#111827',
        },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'], // Or Poppins
        body: ['Roboto', 'sans-serif'], // Or Noto Sans
      },
      borderRadius: {
        lg: '12px',
      },
    },
  },
  plugins: [],
};