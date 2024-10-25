import { FC, useState } from "react";
import Logo_B from "../../../public/images/Logo_B.svg";
import Logo_W from "../../../public/images/Logo_W.svg";
import Sun from "../../../public/images/Sun.svg";
import Moon from "../../../public/images/Moon.svg";
import key_B from "../../../public/images/key_B.svg";
import key_W from "../../../public/images/key_W.svg";
import menu_B from "../../../public/images/menu_B.svg";
import menu_W from "../../../public/images/menu_W.svg";
import Image from "next/image";

interface Header {
  isDarkMode: boolean;
  DarkMode: () => void;
}

const Header: FC<Header> = ({ isDarkMode, DarkMode }) => {
  const [menu, setMenu] = useState(false);

  const togglemenu = () => {
    setMenu(!menu);
  };

  return (
    <>
      <header
        className={`flex z-50 items-center justify-between h-16 px-4 w-full
          ${menu ? "border-none" : "border-b-2 border-black dark:border-white"}
          ${isDarkMode ? "bg-black text-white" : "bg-white"} 
          transition-colors duration-300 ease-in-out top-0 fixed `}
      >
        <a href="/">
          <Image
            src={isDarkMode ? Logo_W : Logo_B}
            alt="Logo"
            className="w-[180px] h-[50px] cursor-pointer transition-transform duration-300 hover:scale-105"
          />
        </a>
        <nav className="flex items-center space-x-6 font-bold text-[20px]">
          <a
            href="/"
            className={`cursor-pointer hover:scale-105 ${isDarkMode ? "hover:text-headerDarkHover" : "hover:text-blue-500"} hidden lg:block`}
          >
            AboutMe
          </a>
          <a
            href="/project"
            className={`cursor-pointer hover:scale-105 ${isDarkMode ? "hover:text-headerDarkHover" : "hover:text-blue-500"} hidden lg:block`}
          >
            Projects
          </a>
          <a
            href="/blog"
            className={`cursor-pointer hover:scale-105 ${isDarkMode ? "hover:text-headerDarkHover" : "hover:text-blue-500"} hidden lg:block`}
          >
            Blog
          </a>
          <Image
            onClick={togglemenu}
            src={isDarkMode ? menu_W : menu_B}
            className="w-63px cursor-pointer transition-transform duration-300 hover:scale-105 w-[30px] h-[30px] lg:hidden"
            alt="menu"
          />
          <button
            onClick={DarkMode}
            className="flex items-center transition-transform hover:scale-110"
          >
            <Image src={isDarkMode ? Moon : Sun} alt="Darkmode" className="w-[30px] h-[30px] " />
          </button>
          <a href="/login">
            <Image
              src={isDarkMode ? key_W : key_B}
              className="w-63px cursor-pointer transition-transform duration-300 hover:scale-105 w-[30px] h-[30px] "
              alt="login"
            />
          </a>
        </nav>
      </header>
      {/* 메뉴 */}
      <div
        className={` fixed transition-transform  bg-white min-w-full top-16
      ${menu ? "translate-y-0" : "-translate-y-full"} dark:bg-black dark:text-white lg:hidden border-b-2 border-black dark:border-white z-10`}
      >
        <div className="pl-6 pb-3 space-y-3 font-bold text-[20px] flex-col flex">
          <a
            href="/"
            className="cursor-pointer hover:text-blue-500 dark:hover:text-headerDarkHover"
          >
            AboutMe
          </a>
          <a
            href="/project"
            className="cursor-pointer hover:text-blue-500
          dark:hover:text-headerDarkHover"
          >
            Projects
          </a>
          <a
            href="/blog"
            className="cursor-pointer hover:text-blue-500
          dark:hover:text-headerDarkHover"
          >
            Blog
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;