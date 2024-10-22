import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import Header2 from "./components/Layout/Header2.tsx";
import Blog from "./components/blog/Blog.tsx";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const DarkMode = () => {
    setIsDarkMode(p => !p);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <div className={`duration-300 h-screen ${isDarkMode ? "dark:bg-black" : "bg-white"}`}>
      <Header2 isDarkMode={isDarkMode} DarkMode={DarkMode}/>
      <Blog isDarkMode={isDarkMode}/>
     
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p> */}
    </div>
  );
}

export default App;
