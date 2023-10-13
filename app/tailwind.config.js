/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

const mainColor = colors.sky;

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/templates/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: mainColor[100],
          200: mainColor[200],
          300: mainColor[300],
          400: mainColor[400],
          500: mainColor[500],
          600: mainColor[600],
          700: mainColor[700],
          800: mainColor[800],
          900: mainColor[900],
        },
        focus: "rgb(var(--focus-color))",
        skin: {
          primary: "rgb(var(--border-color) / var(--border-opacity))",
          secondary: "rgb(var(--focus-color))",
        },
      },
      textColor: {
        color: {
          primary: "rgb(var(--text-color-primary))",
          secondary: "rgb(var(--text-color-secondary))",
          third: "rgb(var(--text-color-third))",
        },
      },
      backgroundColor: {
        fill: {
          primary: "rgb(var(--fill-color-primary))",
          secondary: "rgb(var(--fill-color-secondary))",
          third: "rgb(var(--fill-color-third))",
          opacity: "rgb(var(--fill-color-third) / var(--fill-opacity))",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("flowbite/plugin"),
  ],
};
