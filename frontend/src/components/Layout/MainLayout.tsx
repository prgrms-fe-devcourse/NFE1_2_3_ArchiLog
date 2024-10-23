import React, { useState } from "react";
import PostForm from "../PostForm";
import Header from "./Header";

const MainLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // 다크 모드 상태 전환 함수
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`${darkMode ? "dark bg-black" : "bg-white"} min-h-screen`}>
      <header>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>
      <main className="pt-10">
        <PostForm darkMode={darkMode} />
      </main>
    </div>
  );
};

export default MainLayout;
