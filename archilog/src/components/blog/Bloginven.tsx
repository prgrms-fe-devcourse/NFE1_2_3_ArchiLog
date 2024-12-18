import React, { useEffect, useState } from "react";
import Edit_W from "../../../public/images/edit_W.svg";
import Edit_B from "../../../public/images/edit_B.svg";
import Search from "../../../public/images/search.svg";
import Image from "next/image";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getPost } from "@/firebase/posts";
import { auth, database } from "@/firebase/firebase";
import { useRouter } from "next/router";
import Post from "@/types/Post";
import { ref, get } from "firebase/database";

interface BloginvenProps {
  initialPosts: Post[];
  username: string;
}

const Bloginven: React.FC<BloginvenProps> = ({ initialPosts, username: initialUsername }) => {
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  //(임시)유저네임 체크
  useEffect(() => {
    const getCurrentUsername = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userSnapshot = await get(ref(database, `users/${currentUser.uid}`));
          const userData = userSnapshot.val();
          console.log("현재 로그인된 유저:", userData?.username);
          console.log("페이지 username:", initialUsername);
        } catch (error) {
          console.error("오류:", error);
        }
      } else {
        console.log("로그인된 사용자 없음");
      }
    };

    getCurrentUsername();
  }, [initialUsername]);

  const currentUrl = router.asPath;
  const postLink = `${currentUrl}/post`;

  //게시물 태그 분류
  const extractUniqueTags = (posts: Post[]) => {
    const allTags = posts.reduce((tags: string[], post) => {
      return tags.concat(post.tags || []);
    }, []);

    const uniqueTags = Array.from(new Set(allTags));
    setUniqueTags(uniqueTags);
  };

  //이미지 추출
  const extractImageUrl = (content: string) => {
    const regex = /!\[.*?\]\((https:\/\/firebasestorage\.googleapis\.com\/.*?)\)/;
    const match = content.match(regex);
    return match ? match[1] : null;
  };

  //태그 클릭 검색
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  //게시물 작성
  const handleAddPost = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      const confirmLogin = window.confirm("로그인이 필요합니다.");
      if (confirmLogin) {
        router.push("/login");
      }
      return;
    }
    router.push(postLink);
  };

  //게시물 목록 데이터
  const fetchPosts = async () => {
    if (!initialUsername) return;

    try {
      setLoading(true);
      const fetchedPosts = await getPost(initialUsername);
      setPosts(fetchedPosts || []);
      extractUniqueTags(fetchedPosts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setUniqueTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPosts?.length > 0) {
      extractUniqueTags(initialPosts);
    }
  }, [initialPosts]);

  useEffect(() => {
    if (initialUsername) {
      fetchPosts();
    }
  }, [initialUsername]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && initialUsername) {
        try {
          const userSnapshot = await get(ref(database, `users/${user.uid}`));
          const userData = userSnapshot.val();
          const currentUsername = user.displayName || userData?.username;

          console.log("User data:", userData);
          console.log("Current user:", user);

          const isOwner = currentUsername === initialUsername;
          console.log("Auth state changed - Ownership check:", {
            currentUsername,
            pageUsername: initialUsername,
            isOwner,
            userData
          });

          setIsOwner(isOwner);
        } catch (error) {
          console.error("Error checking ownership:", error);
          setIsOwner(false);
        }
      } else {
        setIsOwner(false);
      }
    });

    return () => unsubscribe();
  }, [initialUsername]);

  //검색
  const displayedPosts =
    posts?.filter((post) => {
      const matchesSearch = searchTerm ? post.title?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    }) || [];

  //content데이터값 태그 제거(모든 마크다운 없애는 방법으로)
  const removeMarkdownAndHtml = (text: string) => {
    const withoutHeaders = text.replace(/^#{1,6}\s+.*$/gm, '');
    return withoutHeaders
      .replace(/<[^>]*>/g, '')                    
      .replace(/!\[.*?\]\(.*?\)/g, '')           
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') 
      .replace(/\*\*(.*?)\*\*/g, '$1')           
      .replace(/\*(.*?)\*/g, '$1')               
      .replace(/```[\s\S]*?```/g, '')            
      .replace(/`([^`]+)`/g, '$1')               
      .replace(/^>\s/gm, '')                     
      .replace(/^[-*+]\s/gm, '')                 
      .replace(/^\d+\.\s/gm, '')                 
      .replace(/\n+/g, ' ')                      
      .replace(/\s+/g, ' ')                     
      .trim();                                   
  };

  const handlePostClick = (id: string) => {
    router.push(`${currentUrl}/${id}`);
  };

  return (
    <div className="dark:text-white dark:bg-black">
      {/* 검색창 */}
      <div className="flex items-center mx-auto w-full pt-10 max-w-3xl px-4">
        <div className="font-bold text-[25px]">Posts</div>
        {isOwner && (
          <Image
            src={darkMode ? Edit_W : Edit_B}
            alt="edit"
            className="ml-5 cursor-pointer w-[20px] h-[20px] transition-transform duration-300 hover:scale-110"
            onClick={handleAddPost}
          />
        )}
        <div className="ml-auto bg-gray-200 dark:bg-white rounded-full h-[40px] p-4 dark:text-black flex items-center justify-center focus-within:border-[#b3c1ea] border-2">
          <input
            type="text"
            className="bg-gray-200 dark:bg-white dark:text-black outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
          <Image src={Search} alt="search" className="w-[20px] h-[20px] ml-2" />
        </div>
      </div>

      {/* 태그 */}
      <div className="flex items-center justify-center text-white dark:text-black font-bold text-[15px] mt-7 w-full max-w-3xl mx-auto flex-wrap pb-3">
        {uniqueTags.map((tag, index) => (
          <div
            key={index}
            className={`mx-1 my-1 px-3 py-1 rounded-full cursor-pointer transition-colors duration-300 ${
              selectedTag === tag
                ? "bg-[#6a8cc8] dark:bg-[#ffc848]"
                : "bg-[#94B9F3] hover:bg-[#6a8cc8] dark:bg-[#FDAD00] dark:hover:bg-[#ffc848]"
            }`}
            onClick={() => handleTagClick(tag)}>
            #{tag}
          </div>
        ))}

        <div className="border-b-[#E0E0E0]  border-b-[0.5px] w-full max-w-[740px] pt-5 mx-5"></div>
      </div>

      {/* 게시글 768px 이상 */}
      <div className="flex flex-col items-center mx-auto mb-4 max-w-3xl font-bold">
        {loading ? (
          <div className="hidden md:flex">Loading...</div>
        ) : (
          <>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="hidden md:flex w-full items-center px-2 mb-7 cursor-pointer group dark:border-[#FDAD00] relative">
                  {/* 포스트 전체값 */}
                  <div className="w-full flex items-center hover:translate-x-2 transition-transform duration-300 ease-in-out hover:text-[#6a8cc8] dark:hover:text-[#FDAD00] relative before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-[#94B9F3] before:dark:bg-[#FDAD00] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                    <div>
                      <Image
                        className="w-[230px] h-[160px] mx-3 "
                        src={extractImageUrl(post.content) || (darkMode ? "/images/Logo_W.svg" : "/images/Logo_B.svg")}
                        alt={post.title || "Post image"}
                        width={230}
                        height={160}
                      />
                    </div>
                    {/* 보더 바텀값 */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[740px] h-[0.5px] bg-[#d6dbe4] dark:bg-white" />

                    <div className="ml-8 w-full max-w-[700px] relative z-10">
                      <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-1">
                        {post.title}
                      </div>
                      <div className="font-light mt-2 overflow-hidden line-clamp-2 max-w-[700px]">
                        {removeMarkdownAndHtml(post.content)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="text-[12px] text-white dark:text-black bg-[#94B9F3] dark:bg-[#FDAD00] px-2 py-1 my-3 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="font-semibold text-[14px] text-dateColor pb-3 group-hover:text-black dark:group-hover:text-white">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "날짜 없음"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 hidden md:flex">
                {searchTerm || selectedTag ? "검색 결과가 없습니다." : "작성된 게시글이 없습니다."}
              </div>
            )}
          </>
        )}

        {/* 반응형 게시글 768px 이하 */}
        <div className="md:hidden flex flex-col items-center mx-auto w-full max-w-[450px]">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    onClick={() => handlePostClick(post.id)}
                    key={post.id}
                    className="w-full items-center px-2 mb-7 cursor-pointer group relative">
                    {/* 보더 바텀값 */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[410px] h-[2px] bg-[#d6dbe4] dark:bg-[#FDAD00]" />

                    {/* 포스트 전체값 */}
                    <div className="w-full flex items-center hover:translate-x-2 transition-transform duration-300 ease-in-out hover:text-[#6a8cc8] dark:hover:text-[#FDAD00] relative before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-[#94B9F3] before:dark:bg-[#FDAD00] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                      <div className="ml-5 w-full max-w-[400px] relative z-10">
                        <div className="font-regular text-[20px] mt-5 overflow-hidden max-w-[350px] line-clamp-1">
                          {post.title}
                        </div>
                        <div className="font-light mt-2 overflow-hidden line-clamp-2 max-w-[350px]">
                          {removeMarkdownAndHtml(post.content)}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="text-[12px] text-white dark:text-black bg-[#94B9F3] dark:bg-[#FDAD00] px-2 py-1 my-3 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="font-semibold text-[14px] text-dateColor pb-3 group-hover:text-black dark:group-hover:text-white">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "날짜 없음"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  {searchTerm || selectedTag ? "검색 결과가 없습니다." : "작성된 게시글이 없습니다."}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bloginven;
