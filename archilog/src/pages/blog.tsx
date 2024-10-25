import { useState } from "react";
import Header from "@/components/Layout/Header2";
import Blog from "@/components/blog/Bloginven";

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
    <div className={`duration-300 h-screen ${isDarkMode ? "dark:bg-black" : "bg-white"}`}>
      <Header isDarkMode={isDarkMode} DarkMode={DarkMode} />
      <Blog isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
