/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slide: 'slide 0.5s ease forwards',
      },
      keyframes:{
        slide:{
          from: {transform: "translateY(100%)"},
          to: {transform: "translateY(0%)"}
        }
      }
    },
    colors:{
      "blue": "#1DA1F2",
      'white': '#ffffff',
      'lightWhite': "#F2F2F2",
      'darkBlue': "#323238",
      'lightBlue': "#EDF8FF",
      "borderTop": "#F2F2F2",
      "gray": "#a9a9a9",
      "heading": "#e6e6e6",
      "role": "#a6a6a6",
      "fade": "#b7e1fb",
      "transparent": "transparent",
    },
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
    },
  },
  plugins: [],
}

