/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      500: '500px',
      600: '600px',
      100 : '100px'
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}