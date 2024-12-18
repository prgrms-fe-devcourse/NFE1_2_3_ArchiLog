import React from "react";
import Header from "./Header";
import { useDarkMode } from "@/contexts/DarkModeContext";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-white" : "bg-white text-black"
      } min-h-screen w-full overflow-x-hidden`}
      style={{ boxSizing: "border-box" }}
    >
      <header>
        <Header isLoggedIn={true} />
      </header>

      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
