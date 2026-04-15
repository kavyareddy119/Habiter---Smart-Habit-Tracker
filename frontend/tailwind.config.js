/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
