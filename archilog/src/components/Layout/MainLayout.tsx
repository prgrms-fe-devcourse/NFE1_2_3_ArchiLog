import React from "react";
import Header from "./Header";
import { useDarkMode } from "@/contexts/DarkModeContext";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      <header>
        {/* 로그인 전 로그인 후 상태를 보기 위해서 */}
        <Header isLoggedIn={true} />
      </header>
      <main className="pt-10">{children}</main>
    </div>
  );
};

export default MainLayout;
