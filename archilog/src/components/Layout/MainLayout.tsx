import React from "react";
import Header from "./Header";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useDarkMode();
  const router = useRouter();

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      <header>
        <Header isLoggedIn={true} />
      </header>
      
      <main>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
