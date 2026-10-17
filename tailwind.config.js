export default {
  content: [
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ivory: '#FFF9EF',
        champagne: '#F3E7D0',
        gold: { DEFAULT: '#B88A44', soft: '#D9BE8C', deep: '#8A6224' },
        brown: { DEFAULT: '#563323', soft: '#76503F' },
        rose: '#B77772',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Noto Serif Sinhala"', 'Georgia', 'serif'],
        sans: ['Jost', '"Noto Sans Sinhala"', 'system-ui', 'sans-serif'],
        script: ['"Pinyon Script"', '"Noto Serif Sinhala"', 'cursive'],
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
};
