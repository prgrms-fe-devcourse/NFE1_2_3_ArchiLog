import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Header2 from './components/Layout/Header2';
import Blog from './components/blog/Blog';
import Login from '../pages/login'; 
import Register from '../pages/register'; 
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const DarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <Router>
      <Routes>
        {/* 메인 레이아웃 페이지 */}
        <Route
          path="/"
          element={
            <MainLayout>
              <div className={`duration-300 h-screen ${isDarkMode ? 'dark:bg-black' : 'bg-white'}`}>
                <Header2 isDarkMode={isDarkMode} DarkMode={DarkMode} />
                <Blog isDarkMode={isDarkMode} />
              </div>
            </MainLayout>
          }
        />
        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />

        {/* 회원가입 페이지 */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
