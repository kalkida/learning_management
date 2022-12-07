/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js}"],

  theme: {
    extend: {
      fontFamily: {
        // poppins: ["Poppins", "sans-serif"],
        // jakarta: ["Plus Jakarta Sans", "sans-serif"],
         jakarta: ["Inter"]
      },
    },
  },
  plugins: [],
};
