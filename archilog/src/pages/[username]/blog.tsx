import React, { useEffect, useState } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Bloginven from "@/components/blog/Bloginven";
import { getPost } from '@/firebase/posts';
import Post from '@/types/Post';
import { useRouter } from 'next/router';
import { checkUsernameExists } from "@/firebase/auth";

const BlogPage: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useState<Post[]>([]);
  // const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const router = useRouter();
  const name = router.asPath.split('/').slice(1, 2)[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exists = await checkUsernameExists(name);
        // setUsernameExists(exists);

        if (exists) {
          const fetchedPosts = await getPost(name);
          setPosts(fetchedPosts || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  return (
    <div
      className={`duration-300 min-h-screen py-5 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <main>
        <Bloginven 
          initialPosts={posts || []} 
          username={name} 
        />
      </main>
    </div>
  );
};

export default BlogPage;