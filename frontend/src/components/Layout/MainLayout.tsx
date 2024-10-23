import React from "react";
import PostForm from "../PostForm";
import Header from "./Header";

const MainLayout: React.FC = () => {
  return (
    <div>
      <header>
        <Header></Header>
      </header>
      <main>{<PostForm></PostForm>}</main>
    </div>
  );
};

export default MainLayout;
