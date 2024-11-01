import React, { useEffect, useReducer, useState } from 'react';
import { getAbout, getUserInfo } from "../firebase/users";
import { getCurrentUserId } from '../firebase/auth';
import dynamic from 'next/dynamic';
import { useDarkMode } from "../contexts/DarkModeContext";
import Image from 'next/image';
import Link from "next/link";
import User from '@/types/User';
import getBasePath from '@/utils/getBasePath';

const MyPage = () => {
  const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const { darkMode } = useDarkMode();
  const basePath = getBasePath();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user: User | null = await getUserInfo(basePath);
        setUserInfo(user);

        const currentUserId = await getCurrentUserId();
        setCurrentUserId(currentUserId);
        console.log(user);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [basePath]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', darkMode ? 'dark' : 'light');
}, [darkMode]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className='box-border py-5 h-full'>
      {currentUserId === userInfo.userId && (
        <div className="float-right mr-5">
          <Link href={`/${userInfo.username}/edit`}>
            <img src='/images/edit.svg' alt="Edit" style={{ filter: darkMode ? 'invert(1)' : 'invert(0)' }} />
          </Link>
        </div>
      )}
      <div className={`duration-300 h-full`} >
        <MarkdownPreview source={userInfo.resume} className={`p-10 h-full pt-0
      ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}/>
      </div>
    </div>
  );
};

export default MyPage;
