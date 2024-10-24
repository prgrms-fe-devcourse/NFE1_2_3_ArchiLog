import { useState } from "react";
import MainLayout from "./components/Layout/MainLayout";
import "./App.css";
import Header2 from "./components/Layout/Header2";
import Blog from "./components/blog/Blog";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const DarkMode = () => {
    setIsDarkMode((p) => !p);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <MainLayout>
      <div className={`duration-300 h-screen ${isDarkMode ? "dark:bg-black" : "bg-white"}`}>
        <Header2 isDarkMode={isDarkMode} DarkMode={DarkMode} />
        <Blog isDarkMode={isDarkMode} />

    </MainLayout>
  );
}

export default App;
