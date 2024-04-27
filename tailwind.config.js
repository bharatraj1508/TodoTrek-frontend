/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        page: "#FFF2E1",
        sidebar: "#503C3C",
        logo: "#DAC0A3",
        "hover-sidbar": "#EADBC8",
        form: "#F8F0E5",
      },
    },
  },
  plugins: [],
};
