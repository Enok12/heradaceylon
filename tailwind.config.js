/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EE',
        linen: '#F0EAE0',
        sand: '#E4D9CC',
        warm: '#CDB99E',
        gold: '#B5935A',
        'gold-light': '#D4AE78',
        espresso: '#1E1208',
        charcoal: '#1A1A1A',
        mist: '#F9F6F2',
        muted: '#7A6E65',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jost)', 'Helvetica Neue', 'sans-serif'],
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
        reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
        luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
