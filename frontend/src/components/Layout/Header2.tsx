import { FC } from "react";
import Logo_B from "../../assets/images/Logo_B.svg";
import Logo_W from "../../assets/images/Logo_W.svg";
import Sun from "../../assets/images/Sun.svg";
import Moon from "../../assets/images/Moon.svg";
import key_B from "../../assets/images/key_B.svg";
import key_W from "../../assets/images/key_W.svg";
import menu_B from "../../assets/images/menu_B.svg";
import menu_W from "../../assets/images/menu_W.svg";

interface Header {
  isDarkMode: boolean;
  DarkMode: () => void;
}

const Header: FC<Header> = ({ isDarkMode, DarkMode }) => {
  return (
    <header
      className={`flex z-50 items-center justify-between h-16 px-4 w-full 
    ${isDarkMode ? "bg-black text-white transition-all duration-300 border-b-white" : "bg-white transition-all duration-300 border-b-black"} sticky top-0 border-b-2
    `}
    >
      <img
        src={isDarkMode ? Logo_W : Logo_B}
        alt="Logo"
        className="w-63px h-10 cursor-pointer transition-transform duration-300 hover:scale-105"
      />
      <nav className="flex items-center space-x-6 font-bold text-[20px]">
        <a
          className={`cursor-pointer hover:scale-105 ${isDarkMode ? "hover:text-headerDarkHover" : "hover:text-blue-500"} hidden lg:block`}
        >
          AboutMe
        </a>
        <a
          className={`cursor-pointer hover:scale-105 ${isDarkMode ? "hover:text-headerDarkHover" : "hover:text-blue-500"} hidden lg:block`}
        >
          Projects
        </a>
        <a
          className={`cursor-pointer hover:scale-105 ${isDarkMode ? "hover:text-headerDarkHover" : "hover:text-blue-500"} hidden lg:block`}
        >
          Blog
        </a>
        <img
          src={isDarkMode ? menu_W : menu_B}
          className="w-63px cursor-pointer transition-transform duration-300 hover:scale-105 w-[30px] h-[30px] lg:hidden"
        />
        <button
          onClick={DarkMode}
          className="flex items-center transition-transform hover:scale-110"
        >
          <img src={isDarkMode ? Moon : Sun} alt="Darkmode" className="w-[30px] h-[30px]" />
        </button>
        <img
          src={isDarkMode ? key_W : key_B}
          className="w-63px cursor-pointer transition-transform duration-300 hover:scale-105 w-[30px] h-[30px] "
        />
      </nav>
    </header>
  );
};

export default Header;
