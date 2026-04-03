/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green:   '#1DB954',
          dark:    '#17a349',
          pale:    '#E8F8EE',
          mid:     '#B8E8C8',
          black:   '#0F1410',
          ink:     '#1A2420',
          body:    '#4A5C50',
          muted:   '#8A9E92',
          border:  '#E2ECE6',
          surface: '#F6FAF7',
          red:     '#FF4757',
          orange:  '#FF8C42',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        sans:    ['"Noto Sans KR"', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        hero: '20px',
        pill: '100px',
      },
    },
  },
  plugins: [],
}
