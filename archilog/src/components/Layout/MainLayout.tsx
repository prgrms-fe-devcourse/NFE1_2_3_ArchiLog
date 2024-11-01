// NFE1_2_3_ArchiLog/archilog/src/components/Layout/MainLayout.tsx
import React, { useEffect } from "react";
import Header from "./Header";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { useDarkMode } from "@/contexts/DarkModeContext";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useDarkMode();
  const router = useRouter();

  // 로그인하지 않은 경우 로그인 페이지로 이동하기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); 
      }
    });

    return () => unsubscribe();
  }, [router]);

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
