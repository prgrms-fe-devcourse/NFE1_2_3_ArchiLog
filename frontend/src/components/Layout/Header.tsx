import React, { useState } from "react";
import { MdOutlineAccountCircle } from "react-icons/md";

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 다크모드 전환 함수
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header
      className={`w-screen px-5 border-b border-gray-700 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className="flex justify-between items-center mx-auto"
        style={{ height: "80px" }}
      >
        {/* 왼쪽 로고 */}
        <div className="flex items-center">
          <span className="text-2xl md:text-xl lg:text-3xl font-bold">
            ArchiLog
          </span>
        </div>

        {/* 네비게이션 메뉴 및 계정 아이콘 */}
        <nav className="hidden md:flex space-x-3 md:space-x-5 lg:space-x-8 ml-auto">
          <a
            href="#"
            className={`text-sm md:text-base lg:text-lg ${
              darkMode
                ? "text-white hover:text-[#FDAD00]"
                : "text-black hover:text-[#4CAF50]"
            }`}
          >
            AboutMe
          </a>
          <a
            href="#"
            className={`text-sm md:text-base lg:text-lg ${
              darkMode
                ? "text-white hover:text-[#FDAD00]"
                : "text-black hover:text-[#4CAF50]"
            }`}
          >
            Projects
          </a>
          <a
            href="#"
            className={`text-sm md:text-base lg:text-lg ${
              darkMode
                ? "text-white hover:text-[#FDAD00]"
                : "text-black hover:text-[#4CAF50]"
            }`}
          >
            Blog
          </a>
        </nav>

        {/* 계정 아이콘 */}
        <div className="hidden md:flex items-center ml-5">
          <MdOutlineAccountCircle
            className={`${darkMode ? "text-white" : "text-black"} text-3xl`}
          />
        </div>

        {/* 다크모드 아이콘 */}
        <div className="ml-5 cursor-pointer" onClick={toggleDarkMode}>
          <span className="text-2xl md:text-xl lg:text-3xl">
            {darkMode ? "🌙" : "🌞"}
          </span>
        </div>

        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden flex items-center ml-auto">
          <button onClick={toggleSidebar}>
            <span
              className={`${darkMode ? "text-white" : "text-black"} text-3xl`}
            >
              ☰
            </span>
          </button>
        </div>
      </div>

      {/* 모바일 사이드바 */}
      {sidebarOpen && (
        <div
          className={`fixed top-0 right-0 w-64 h-full ${
            darkMode ? "bg-black text-white" : "bg-white text-black"
          } z-50 border ${darkMode ? "border-white" : "border-black"}`}
        >
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-2xl"
          >
            ✕
          </button>

          {/* 계정 아이콘 */}
          <div className="flex flex-col items-center mt-8">
            <MdOutlineAccountCircle className="text-5xl" />
            <span className="mt-2 text-lg">My Account</span>
          </div>

          {/* 구분선 */}
          <div className="border-b my-4"></div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex flex-col p-5 space-y-4">
            <a
              href="#"
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              AboutMe
            </a>
            <a
              href="#"
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Projects
            </a>
            <a
              href="#"
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Blog
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
