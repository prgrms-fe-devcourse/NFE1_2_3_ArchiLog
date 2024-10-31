import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import { useDarkMode } from "@/contexts/DarkModeContext";
import {
  getPostDetails,
  addComment,
  deleteComment,
  deletePost,
} from "@/firebase/posts";


interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

const PostDetail = () => {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { postId } = router.query;
  const postContentRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { darkMode } = useDarkMode();

  const username = router.asPath.split("/")[1];

  useEffect(() => {
    if (postId) {
      fetchPostDetails(postId as string);
    }
  }, [postId]);

  const fetchPostDetails = async (postId: string) => {
    try {
      const postData = await getPostDetails(username, postId);
      setPost(postData);
      console.log(postData);
      const commentsArray = Object.entries(postData.comments || {}).map(([id, comment]) => ({
        id,
        ...comment,
      }));
      setComments(commentsArray);
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!commentText.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await addComment(commentText, postId as string);
      setCommentText("");
      fetchPostDetails(postId as string);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = confirm("정말로 게시글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await deletePost(postId as string);
        router.push(`/${user?.displayName}/blog`); // 게시글 목록 페이지로 이동
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleUpdatePost = () => {
    router.push(`/${user?.displayName}/blog/edit/${postId}`); // 수정 페이지로 이동
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmDelete = confirm("정말로 댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await deleteComment(postId as string, commentId);
        fetchPostDetails(postId as string);
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  const generateTableOfContents = () => {
    if (!post) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const headings = Array.from(doc.querySelectorAll("h2, h3"));
    return headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent,
      level: heading.tagName,
    }));
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`max-w-4xl mx-auto mt-8 p-6 rounded-lg shadow-md ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* 게시글 제목 */}
      {post && (
        <div className="flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-2 mb-6">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className={`text-sm px-2 py-1 rounded-full ${
                    darkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 게시글 내용 */}
            <div
              className={`prose ${
                darkMode ? "prose-invert" : ""
              } max-w-none mb-10`}
              ref={postContentRef}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* 댓글 */}
            <div className="mt-8 space-y-4">
              {user ? (
                <div
                  className={`flex items-center rounded-full px-4 py-3 mt-4 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="bg-transparent flex-grow outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    className="focus:outline-none"
                    aria-label="Submit comment"
                  >
                    {/* SVG for Paper Airplane Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 transform rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10l9-9m0 0l9 9m-9-9v18"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">
                  로그인 후 댓글 작성이 가능합니다.
                </p>
              )}
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className={`p-4 rounded-lg shadow-md border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-gray-300"
                        : "bg-gray-100 border-gray-300 text-gray-800"
                    }`}
                  >
                    <div>
                      <span className="font-semibold">작성자 이름</span>{" "}
                      <span className="text-sm">{comment.createdAt}</span>
                    </div>
                    <p>{comment.content}</p>
                    {user?.uid === comment.authorId && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 목차 */}
          <aside
            className={`ml-0 lg:ml-8 mt-6 lg:mt-0 lg:w-1/4 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-100 border-gray-300"
            } p-4`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">목차</h2>
              {user?.uid === post.authorId && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="focus:outline-none"
                  >
                    •••
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-black rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={handleUpdatePost}
                        className="w-full px-4 py-2 text-left text-sm text-white-700 hover:bg-gray-100"
                      >
                        수정
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <ul className="space-y-1 mt-4">
              {generateTableOfContents().map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer text-sm ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } hover:underline pl-${item.level === "H2" ? "4" : "8"}`}
                  onClick={() => handleScrollToSection(item.id)}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
