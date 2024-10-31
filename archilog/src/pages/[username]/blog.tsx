import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Bloginven from "@/components/blog/Bloginven";
import { GetStaticPaths, GetStaticProps } from 'next';
import { getDatabase, ref, get } from 'firebase/database';
import { getPost } from '@/firebase/posts';
import Post from '@/types/Post';

interface BlogPageProps {
  initialPosts: Post[];
  username: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ initialPosts, username }) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`duration-300 min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <main>
        <Bloginven 
          initialPosts={initialPosts || []} 
          username={username} 
        />
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const db = getDatabase();
  const usersRef = ref(db, 'users');
  
  try {
    const snapshot = await get(usersRef);
    const paths = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((userSnapshot) => {
        const userData = userSnapshot.val();
        if (userData.username) {
          paths.push({
            params: { username: userData.username }
          });
        }
      });
    }

    console.log('Generated paths:', paths);

    return {
      paths,
      fallback: 'blocking' // 새로운 사용자가 추가될 수 있으므로 blocking으로 설정
    };
  } catch (error) {
    console.error('Error getting users:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = params?.username as string;
  
  try {
    const posts = await getPost(username);
    console.log(`Fetched posts for ${username}:`, posts);
    
    return {
      props: {
        initialPosts: posts || [],
        username
      },
      revalidate: 60 // 60초마다 재생성
    };
  } catch (error) {
    console.error('Error getting posts:', error);
    return {
      props: {
        initialPosts: [],
        username
      },
      revalidate: 60
    };
  }
};

export default BlogPage;