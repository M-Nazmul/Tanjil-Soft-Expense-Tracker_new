/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.1)',
        glassDark: 'rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}