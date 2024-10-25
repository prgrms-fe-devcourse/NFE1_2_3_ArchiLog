import React from "react";
import Link from "next/link"; 

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const HeaderLogin: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header
      className={`w-screen px-5 border-b border-gray-700 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mx-auto" style={{ height: "80px" }}>
        <div className="flex items-center">
          <Link href="/">
            <span className="text-2xl md:text-xl lg:text-3xl font-bold">ArchiLog</span>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-3 md:space-x-5 lg:space-x-8 ml-auto">
          <a
            href="#"
            className={`text-sm md:text-base lg:text-lg ${
              darkMode ? "text-white hover:text-[#FDAD00]" : "text-black hover:text-[#4CAF50]"
            }`}
          >
            AboutUs
          </a>
        </nav>

        {/* 다크모드 전환 버튼 */}
        <div className="ml-5 cursor-pointer" onClick={toggleDarkMode}>
          <span className="text-2xl md:text-xl lg:text-3xl">{darkMode ? "🌙" : "🌞"}</span>
        </div>
      </div>
    </header>
  );
};

export default HeaderLogin;
