// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PostForm from "../PostForm";
// import PostDetail from "../PostDetail";
// import Header from "./Header";

// const MainLayout: React.FC = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   // 다크 모드 상태 전환 함수
//   const toggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//   };

//   return (
//     <div
//       className={`${darkMode ? "dark bg-black text-white" : "bg-white text-black"} min-h-screen`}
//     >
//       <Router>
//         <header>
//           <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
//         </header>
//         <main className="pt-10">
//           {/* 라우팅 */}
//           <Routes>
//             {/* 메인 페이지 (PostForm) */}
//             <Route path="/" element={<PostForm darkMode={darkMode} />} />

//             {/* 게시글 상세 페이지 */}
//             <Route path="/post/:postId" element={<PostDetail darkMode={darkMode} />} />
//           </Routes>
//         </main>
//       </Router>
//     </div>
//   );
// };

// export default MainLayout;

import React, { useState } from "react";
import Header from "./Header";
import { useRouter } from 'next/router';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // 다크 모드 상태 전환 함수
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`${darkMode ? "dark bg-black text-white" : "bg-white text-black"} min-h-screen`}>
      {router.pathname !== '/login' && router.pathname !== '/register' && (
        <header>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </header>
      )}
      <main className="pt-0"> 
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
