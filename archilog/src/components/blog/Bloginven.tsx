import React, { useEffect, useState } from "react";
import Edit_W from "../../../public/images/edit_W.svg";
import Edit_B from "../../../public/images/edit_B.svg";
import Search from "../../../public/images/search.svg";
import Image from "next/image";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getPost } from "@/firebase/posts";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  createdAt: number;
  updatedAt: number;
}

const Blog: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();

  const extractUniqueTags = (posts: Post[]) => {
    const allTags = posts.reduce((tags: string[], post) => {
      return tags.concat(post.tags || []);
    }, []);

    const uniqueTags = Array.from(new Set(allTags));
    setUniqueTags(uniqueTags);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const handleAddPost = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      const confirmLogin = window.confirm("로그인이 필요합니다.");
      if (confirmLogin) {
        router.push("/login");
      }
      return;
    }
    router.push("/createpost");
  };

  const fetchPosts = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const fetchedPosts = await getPost();
      const userPosts = fetchedPosts.filter((post) => post.authorId === currentUser.uid);
      console.log("Fetched posts:", userPosts);
      setPosts(userPosts || []);
      extractUniqueTags(userPosts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPosts();
      } else {
        setPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const displayedPosts = posts.filter((post) => {
    const matchesSearch = searchTerm ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  const removeHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="dark:text-white dark:bg-black">
      {/* 검색창 */}
      <div className="flex items-center mx-auto w-full max-w-3xl px-4">
        <div className="font-bold text-[25px]">Posts</div>
        {auth.currentUser && (
          <Image
            src={darkMode ? Edit_W : Edit_B}
            alt="edit"
            className="ml-5 cursor-pointer w-[20px] h-[20px] transition-transform duration-300 hover:scale-110"
            onClick={handleAddPost}
          />
        )}
        <div className="ml-auto bg-gray-200 dark:bg-white rounded-full h-[40px] p-4 dark:text-black flex items-center justify-center focus-within:border-blue-500 border-2">
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
      <div className="flex items-center justify-center text-white dark:text-black font-bold text-[15px] mt-7 w-full max-w-3xl mx-auto flex-wrap pb-7">
        {uniqueTags.map((tag, index) => (
          <div
            key={index}
            className={`mx-1 my-1 px-3 py-1 rounded-full cursor-pointer transition-colors duration-300 ${
              selectedTag === tag
                ? "bg-[#388E3C] dark:bg-[#FFA000]"
                : "bg-[#4CAF50] hover:bg-[#43A047] dark:bg-[#FDAD00] dark:hover:bg-[#FFB300]"
            }`}
            onClick={() => handleTagClick(tag)}>
            #{tag}
          </div>
        ))}
        <div className="border-b-[#E5E7EB] dark:border-b-white border-b-2 w-full max-w-[740px] pt-5 mx-5"></div>
      </div>

      {/* 게시글 768px 이상 */}
      <div className="flex flex-col items-center mx-auto my-8 max-w-3xl font-bold">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <div
                  key={post.id}
                  className="hidden md:flex w-full items-center px-4 mb-7 hover:text-[#4CAF50] dark:hover:text-[#FDAD00] cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group border-2 rounded-lg">
                  <div className="ml-5">
                    <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-1">
                      {post.title}
                    </div>
                    <div className="font-light mt-2 overflow-hidden line-clamp-2"
                    >{removeHtmlTags(post.content)}</div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-[12px] text-white dark:text-black bg-[#4CAF50] dark:bg-[#FDAD00] px-2 py-1 my-3 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="font-light text-[14px] text-dateColor pb-3 group-hover:text-black dark:group-hover:text-white">
                      {new Date(post.createdAt).toLocaleDateString()}
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

        {/* 반응형 게시글 768px 이하 */}
        <div className="md:hidden flex flex-col items-center mx-auto">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="items-center px-4 w-[450px] hover:text-[#4CAF50] dark:hover:text-[#FDAD00] cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group border-2 my-2 rounded-lg">
                    <div className="ml-5">
                      <div className="font-regular text-[20px] mt-5 overflow-hidden max-w-[450px] line-clamp-1">
                        {post.title}
                      </div>
                      <div className="font-light mt-2 overflow-hidden line-clamp-2"
                    >{removeHtmlTags(post.content)}</div>
                      <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-[12px] text-white dark:text-black bg-[#4CAF50] dark:bg-[#FDAD00] px-2 py-1 my-3 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="font-light text-[14px] text-dateColor pb-3 group-hover:text-black dark:group-hover:text-white">
                      {new Date(post.createdAt).toLocaleDateString()}
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

export default Blog;
