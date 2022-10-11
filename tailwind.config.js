/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],

  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'], 
        'jakarta': ['Plus Jakarta Sans', 'sans-serif']
      },
    },
  },
  plugins: [],
};
