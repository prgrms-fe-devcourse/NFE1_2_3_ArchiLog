import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import PostForm from "@/components/PostForm";

const CreatePostPage: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`duration-300 min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <main className="pt-10">
        <PostForm darkMode={darkMode} />
      </main>
    </div>
  );
};

export default CreatePostPage;
