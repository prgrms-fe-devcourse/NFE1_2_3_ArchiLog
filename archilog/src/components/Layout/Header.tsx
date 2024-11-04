import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Link from "next/link";
import { auth, checkUsernameExists, logOutAndRedirect } from "../../firebase/auth"; 

interface HeaderProps {
  isLoggedIn: boolean; // 로그인 여부를 나타냄
}

const Header: React.FC<HeaderProps> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [logo, setLogo] = useState('ArchiLog');
  const [path, setPath] = useState('');
  const router = useRouter();
  const currentUrl = router.asPath;
  const splitUrl = currentUrl.split('/');
  const basePath = router.asPath.split(/[/?]/).slice(1, 2)[0];

  useEffect(() => {
    const verifyUsername = async () => {
      if (await checkUsernameExists(splitUrl[1])) {
        setLogo(splitUrl[1]);
        setPath(basePath);
      } else {
        setLogo('ArchiLog');
        setPath('login');
      }
    };
  
    verifyUsername();
  }, [splitUrl]);
  
  useEffect(() => {
    setIsLoggedIn(!!auth.currentUser);
  }, [auth.currentUser]);


  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 로그인 버튼 클릭 시 로그인 페이지로 이동
  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await logOutAndRedirect(router);
      alert("로그아웃 되었습니다."); 
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header
      className={`w-screen px-5 border-b border-gray-700 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className="flex justify-between items-center mx-auto"
        style={{ height: "80px" }}
      >
        {/* 왼쪽 로고 */}
        <div className="flex items-center">
          <Link href={`/${path}`} className="text-3xl md:text-3xl lg:text-3xl font-bold">
            {logo}
          </Link>
        </div>
        
        { !isLoggedIn && splitUrl[1] !== 'AboutUs' &&
          <header
          className={`w-screen border-gray-700 ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex justify-between items-center mx-auto" style={{ height: "80px" }}>
            <nav className="hidden md:flex space-x-3 md:space-x-5 lg:space-x-8 ml-auto">
              <Link
                href="/AboutUs"
                className={`text-sm md:text-base lg:text-lg${
                  darkMode ? "text-white hover:text-[#FDAD00]" : "text-black hover:text-[#4CAF50]"
                }`}
              >
                AboutUs
              </Link>
            </nav>
          </div>
        </header>
        }

        {/* 로그인 여부에 따른 네비게이션 메뉴 */}
        {isLoggedIn && (
          <nav className="hidden md:flex space-x-5 ml-auto">
            <Link
              href={`/${basePath}`}
              className={`text-sm md:text-lg lg:text-lg ${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              About Me
            </Link>
            <Link
              href={`/${basePath}/project`}
              className={`text-sm md:text-lg lg:text-lg ${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Projects
            </Link>
            <Link
              href={`/${basePath}/blog`}
              className={`text-sm md:text-lg lg:text-lg ${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Blog
            </Link>
            <button
                onClick={handleLogout}
                className={`text-sm md:text-lg lg:text-lg ${
                  darkMode
                    ? "text-white hover:text-[#FDAD00]"
                    : "text-black hover:text-[#4CAF50]"
                }`}
              >
                Logout
              </button>
          </nav>
        )}
        {!isLoggedIn && splitUrl[1] !== 'login' && splitUrl[1] !== 'register' && (
          <button
            onClick={handleLogin}
            className={`text-sm md:text-base lg:text-lg ml-auto pl-5 ${
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
            <Link
              href={`/${basePath}`}
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              About Me
            </Link>
            <Link
              href={`/${basePath}/project`}
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Projects
            </Link>
            <Link
              href={`/${basePath}/blog`}
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Blog
            </Link>

            <button
              onClick={handleLogout}
              className={`text-left ${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;