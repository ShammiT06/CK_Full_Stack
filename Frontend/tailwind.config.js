/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily:{
        open:["Open Sans","sans-serif"],
        inter:[ "Inter", "sans-serif"],
        marienda:["Merienda", "cursive"],
        satoshi: ['Satoshi-Light']
      },
      backgroundColor:{
        baby:"#A246BB14",
        dark:"#ED174FCC",
      },
    },
  },
  plugins: [],
}

