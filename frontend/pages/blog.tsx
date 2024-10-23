import { useState } from "react";
import Header2 from "../src/components/Layout/Header2";
import Blog from "../src/components/blog/Bloginven";


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
      <Header2 isDarkMode={isDarkMode} DarkMode={DarkMode} />
      <Blog isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
