import React from "react";
import { useRouter } from "next/router";
import { logOutAndRedirect } from "@/firebase/auth"; 

// 로그아웃 지우셔도 됩니다. 
const Index = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOutAndRedirect(router); 
      alert("로그아웃 되었습니다.");
    } catch (error) {
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>메인페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default Index;
