/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};
