import React from "react";
import { useRouter } from "next/router";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Link from "next/link";
import { logOutAndRedirect } from "../../firebase/auth"; 

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className="flex justify-between items-center mx-auto"
        style={{ height: "80px" }}
      >
        <div className="flex items-center">
          <Link href="/" className="text-2xl md:text-xl lg:text-3xl font-bold">
            ArchiLog
          </Link>
        </div>

        {isLoggedIn ? (
          <>
            <nav className="hidden md:flex space-x-5 ml-auto">
              <Link
                href="/aboutme"
                className={`text-sm md:text-base lg:text-lg ${
                  darkMode
                    ? "text-white hover:text-[#FDAD00]"
                    : "text-black hover:text-[#4CAF50]"
                }`}
              >
                About Me
              </Link>
              <Link
                href="/project"
                className={`text-sm md:text-base lg:text-lg ${
                  darkMode
                    ? "text-white hover:text-[#FDAD00]"
                    : "text-black hover:text-[#4CAF50]"
                }`}
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className={`text-sm md:text-base lg:text-lg ${
                  darkMode
                    ? "text-white hover:text-[#FDAD00]"
                    : "text-black hover:text-[#4CAF50]"
                }`}
              >
                Blog
              </Link>

              <button
                onClick={handleLogout}
                className={`text-sm md:text-base lg:text-lg ${
                  darkMode
                    ? "text-white hover:text-[#FDAD00]"
                    : "text-black hover:text-[#4CAF50]"
                }`}
              >
                Logout
              </button>
            </nav>
          </>
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

        <div className="ml-5 cursor-pointer" onClick={toggleDarkMode}>
          <span className="text-2xl md:text-xl lg:text-3xl">
            {darkMode ? "🌙" : "🌞"}
          </span>
        </div>

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

          <nav className="flex flex-col p-5 space-y-4">
            <Link
              href="/aboutme"
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              About Me
            </Link>
            <Link
              href="/project"
              className={`${
                darkMode
                  ? "text-white hover:text-[#FDAD00]"
                  : "text-black hover:text-[#4CAF50]"
              }`}
            >
              Projects
            </Link>
            <Link
              href="/blog"
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
