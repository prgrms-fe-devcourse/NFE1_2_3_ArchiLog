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
      {router.pathname !== "/login" && router.pathname !== "/register" && (
        <header>
          <Header isLoggedIn={true} />
        </header>
      )}
      <main className={router.pathname === "/login" || router.pathname === "/register" ? "" : "pt-10"}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
