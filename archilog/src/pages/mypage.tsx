import React, { useEffect, useState } from 'react';
import { getAbout } from "../firebase/users";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState<{ name: string; resume: string } | null>(null);
  const userId = process.env.USER_ID || '';

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAbout(userId);
      console.log(data);
      setUserInfo(data);
    };

    fetchData();
  }, [userId]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userInfo.name}
      {userInfo.resume}
    </div>
  );
};

export default MyPage;
