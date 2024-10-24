/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        headerDarkHover: "#FDAD00",
        tagDarkHover: "#ffd52d",
        Datecolor: "#F1F1F1",
        primary: {
          DEFAULT: "#2bca43",
        },
      },
    },
  },
  plugins: [],
}
