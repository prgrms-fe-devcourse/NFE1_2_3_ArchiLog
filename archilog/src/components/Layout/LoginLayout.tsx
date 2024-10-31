import { useDarkMode } from "@/contexts/DarkModeContext";
import React, { useEffect, useState } from "react";


const LoginLayout: React.FC = () => {
  const { darkMode } = useDarkMode();

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', darkMode ? 'dark' : 'light');
}, [darkMode]);

  return (
    <div className={`${darkMode ? "dark bg-black text-white" : "bg-white text-black"} min-h-screen flex flex-col`}>
      {/* Main */}
      <main className="flex-grow flex m-0 p-5 md:p-0">
        {/* Left Side */}
        <div className="flex-none w-full md:w-1/2 flex items-center justify-center m-0 p-0"> 
          <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-md shadow-2xl p-6 md:p-8 w-full md:max-w-[85%] mx-4 min-h-[45rem] flex flex-col justify-between transition-all duration-300`}>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-none w-full md:w-1/2 flex items-center justify-center"> 
          <div className="text-center">
            <p className={`text-3xl md:text-4xl ${darkMode ? "text-white" : "text-black"}`}>Hello!</p>
            <p className={`text-3xl md:text-4xl ${darkMode ? "text-white" : "text-black"} mt-2`}>Thank you for visiting ArchiLog.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginLayout;