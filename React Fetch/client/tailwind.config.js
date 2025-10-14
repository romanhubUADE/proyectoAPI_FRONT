// tailwind.config.js  (ESM o CJS, el que uses)
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",   // incluye pages, components, context, etc.
    "./views/**/*.{js,jsx,ts,tsx}", // si usas /views
  ],
  theme: { extend: {} },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/aspect-ratio")],
};
