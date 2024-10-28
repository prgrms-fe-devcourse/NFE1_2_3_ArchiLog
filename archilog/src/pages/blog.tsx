import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Blog from "@/components/blog/Bloginven";

const BlogPage: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`duration-300 min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <main className="pt-10">
        <Blog />
      </main>
    </div>
  );
};

export default BlogPage;
