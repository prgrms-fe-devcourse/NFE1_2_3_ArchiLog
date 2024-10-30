import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Bloginven from "@/components/blog/Bloginven";

const BlogPage: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`duration-300 min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <main>
        <Bloginven />
      </main>
    </div>
  );
};

export default BlogPage;
