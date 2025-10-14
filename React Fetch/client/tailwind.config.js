/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b86614",
        "background-light": "#f8f7f6",
        "background-dark": "#211911",
      },
      fontFamily: {
        display: ["Newsreader", "serif"],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

