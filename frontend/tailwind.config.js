/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        headerDarkHover: "#FDAD00",
        Datecolor: "#F1F1F1",
        primary: {
          DEFAULT: "#2bca43",
        },
      },
      gradientColors: {
        card: {
          from: "rgb(3, 3, 5)",
          to: "rgb(32, 32, 32)"
        }
      }
    },
  },
  plugins: [],
}