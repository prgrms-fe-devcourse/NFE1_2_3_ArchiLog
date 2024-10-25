import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdOutlineAccountCircle } from "react-icons/md";

interface HeaderProps {
  isLoggedIn: boolean; // 로그인 여부를 나타냄
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // 다크모드 상태를 로컬 스토리지에서 불러오기
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedDarkMode);
  }, []);

  // 다크모드 토글 함수
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString()); // 상태를 로컬 스토리지에 저장
  };

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 로그인 버튼 클릭 시 로그인 페이지로 이동
  const handleLogin = () => {
    router.push("/login");
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

        {/* 로그인 여부에 따른 네비게이션 메뉴 */}
        {isLoggedIn ? (
          <nav className="hidden md:flex space-x-5 ml-auto">
            <a
              href="/aboutme"
              className={`text-sm md:text-base lg:text-lg ${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              About Me
            </a>
            <a
              href="/project"
              className={`text-sm md:text-base lg:text-lg ${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Projects
            </a>
            <a
              href="/blog"
              className={`text-sm md:text-base lg:text-lg ${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Blog
            </a>
          </nav>
        ) : (
          <button
            onClick={handleLogin}
            className={`text-sm md:text-base lg:text-lg ${
              darkMode
                ? "text-white hover:text-[#FDAD00]"
                : "text-black hover:text-[#4CAF50]"
            }`}
          >
            Login
          </button>
        )}

        {/* 계정 아이콘 */}
        {/* <div className="hidden md:flex items-center ml-5">
          <MdOutlineAccountCircle
            className={`${darkMode ? "text-white" : "text-black"} text-3xl`}
          />
        </div> */}

        {/* 다크모드 전환 버튼 */}
        <div className="ml-5 cursor-pointer" onClick={toggleDarkMode}>
          <span className="text-2xl md:text-xl lg:text-3xl">
            {darkMode ? "🌙" : "🌞"}
          </span>
        </div>

        {/* 모바일 햄버거 메뉴 (로그인 후에만 표시) */}
        {isLoggedIn && (
          <div className="md:hidden flex items-center ml-auto">
            <button onClick={toggleSidebar}>
              <span
                className={`${darkMode ? "text-white" : "text-black"} text-3xl`}
              >
                ☰
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 모바일 사이드바 (로그인 후에만 표시) */}
      {isLoggedIn && sidebarOpen && (
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
          {/* <div className="flex flex-col items-center mt-8">
            <MdOutlineAccountCircle className="text-5xl" />
            <span className="mt-2 text-lg">My Account</span>
          </div> */}

          {/* 구분선 */}
          {/* <div className="border-b my-4"></div> */}

          <nav className="flex flex-col p-5 space-y-4">
            <a
              href="/aboutme"
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              About Me
            </a>
            <a
              href="/project"
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Projects
            </a>
            <a
              href="/blog"
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
