import React, { useEffect, useState } from "react";
import Edit_W from "../../../public/images/edit_W.svg";
import Edit_B from "../../../public/images/edit_B.svg";
import Search from "../../../public/images/search.svg";
import Image from "next/image";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getPost } from "@/firebase/posts";
import { auth, database } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { ref, get } from "firebase/database";

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
  const { username } = router.query;
  const [isOwner, setIsOwner] = useState(false);

  //(임시)유저네임 체크
  useEffect(() => {
    const getCurrentUsername = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userSnapshot = await get(ref(database, `users/${currentUser.uid}`));
          const userData = userSnapshot.val();
          console.log("현재 유저:", userData?.username);
        } catch (error) {
          console.error("오류:", error);
        }
      } else {
        console.log("없어요");
      }
    };

    getCurrentUsername();
  }, []);

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

  //게시물 상세 페이지
  const handlePostDetail = (postId: string) => {
    router.push(`${currentUrl}/${postId}`);
  };


  //게시물 목록 데이터
  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPost();
      //URL과 username일치하는 게시물 필터링
      const filteredPosts = await Promise.all(
        fetchedPosts.map(async (post) => {
          try {
            const userSnapshot = await get(ref(database, `users/${post.authorId}`));
            const userData = userSnapshot.val();

            return userData?.username === username ? post : null;
          } catch (error) {
            console.error("Error fetching user data for post:", post.id, error);
            return null;
          }
        })
      );
      const userPosts = filteredPosts.filter((post): post is Post => post !== null);
      setPosts(userPosts);

      if (userPosts.length > 0) {
        extractUniqueTags(userPosts);
      } else {
        setUniqueTags([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setUniqueTags([]);
    } finally {
      setLoading(false);
    }
  };

  //사용자에 따라 게시물 렌더링
  useEffect(() => {
    if (username && typeof username === "string") {
      fetchPosts();
      isCurrentUserProfile().then(setIsOwner);
    }
  }, [username]);

  //검색
  const displayedPosts = posts.filter((post) => {
    const matchesSearch = searchTerm ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  //현재 사용자 확인용
  const isCurrentUserProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    try {
      const userSnapshot = await get(ref(database, `users/${currentUser.uid}`));
      const userData = userSnapshot.val();
      return userData && userData.username === username;
    } catch (error) {
      console.error("Error checking current user:", error);
      return false;
    }
  };

  //content데이터값 태그 제거
  const removeHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="dark:text-white dark:bg-black">
      {/* 검색창 */}
      <div className="flex items-center mx-auto w-full max-w-3xl px-4">
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
      <div className="flex items-center justify-center text-white dark:text-black font-bold text-[15px] mt-7 w-full max-w-3xl mx-auto flex-wrap pb-7">
        {uniqueTags.map((tag, index) => (
          <div
            key={index}
            className={`mx-1 my-1 px-3 py-1 rounded-full cursor-pointer transition-colors duration-300 ${
              selectedTag === tag
                ? "bg-[#b3c1ea] dark:bg-[#ffc848]"
                : "bg-[#6A8CC8] hover:bg-[#b3c1ea] dark:bg-[#FDAD00] dark:hover:bg-[#ffc848]"
            }`}
            onClick={() => handleTagClick(tag)}>
            #{tag}
          </div>
        ))}
        <div className="border-b-[#E0E0E0]  border-b-2 w-full max-w-[740px] pt-5 mx-5"></div>
      </div>

      {/* 게시글 768px 이상 */}
      <div className="flex flex-col items-center mx-auto my-8 max-w-3xl font-bold">
        {loading ? (
          <div className="hidden md:flex">Loading...</div>
        ) : (
          <>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostDetail(post.id)}
                  className="hidden md:flex w-full items-center px-2 mb-7 hover:text-[#6A8CC8] dark:hover:text-[#FDAD00] cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group  dark:border-[#FDAD00] rounded-xl border-2 border-[#6A8CC8]">
                  {/* <Image
                    className="w-[230px] h-[160px]"
                    src="/images/Example.png"
                    alt="Example"
                    width={500}
                    height={300}
                  /> */}
                  <div className="ml-5">
                    <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-1">
                      {post.title}
                    </div>
                    <div className="font-light mt-2 overflow-hidden line-clamp-2">{removeHtmlTags(post.content)}</div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-[12px] text-white dark:text-black bg-[#6A8CC8] dark:bg-[#FDAD00] px-2 py-1 my-3 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="font-semibold text-[14px] text-dateColor pb-3 group-hover:text-black dark:group-hover:text-white">
                      {new Date(post.createdAt).toLocaleDateString()}
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
        <div className="md:hidden flex flex-col items-center mx-auto">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostDetail(post.id)}
                    className="items-center px-4 w-[450px] hover:text-[#6A8CC8] dark:hover:text-[#FDAD00] cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group border-2 border-[#6A8CC8] my-2 rounded-lg">
                    <div className="ml-5">
                      <div className="font-regular text-[20px] mt-5 overflow-hidden max-w-[450px] line-clamp-1">
                        {post.title}
                      </div>
                      <div className="font-light mt-2 overflow-hidden line-clamp-2">{removeHtmlTags(post.content)}</div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="text-[12px] text-white dark:text-black bg-[#6A8CC8] dark:bg-[#FDAD00] px-2 py-1 my-3 rounded-full">
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
