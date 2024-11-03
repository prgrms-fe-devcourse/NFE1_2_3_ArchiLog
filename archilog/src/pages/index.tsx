import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth"; 

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // 로그인되지 않은 사용자는 로그인 페이지로 이동
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      <h1>메인페이지</h1>
    </div>
  );
};

export default Index;
