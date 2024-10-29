import React, { useEffect, useState } from 'react';
import { getAbout } from "../firebase/users";
import { getCurrentUserId } from '../firebase/auth';
import dynamic from 'next/dynamic';
import { useDarkMode } from "../contexts/DarkModeContext";
import Image from 'next/image';
import Link from "next/link";

const MyPage = () => {
  const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

  const [userInfo, setUserInfo] = useState<{ name: string; resume: string; id: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const { darkMode } = useDarkMode();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getCurrentUserId();
        setCurrentUserId(userId);
        const data = await getAbout(userId);
        setUserInfo(data);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      {currentUserId === userInfo.id && (
        <div className="float-right mr-5">
          <Link href={'/mypage/edit'}>
            <Image src='/images/edit.svg' alt="Edit" width={24} height={24} />
          </Link>
        </div>
      )}
      <div className={`duration-300 h-screen h-full`} >
        <MarkdownPreview source={userInfo.resume} className={`p-10 h-full pt-0
      ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}/>
      </div>
    </div>
  );
};

export default MyPage;
