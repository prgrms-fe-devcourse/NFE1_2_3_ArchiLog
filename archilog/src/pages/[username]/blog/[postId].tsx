import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import { useDarkMode } from "@/contexts/DarkModeContext";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remark } from "remark";
import remarkHtml from "remark-html";
import dynamic from "next/dynamic";
import {
  getPostDetails,
  addComment,
  deleteComment,
  deletePost,
} from "@/firebase/posts";
import Post from "@/types/Post";
import Comment from "@/types/Comment";

import { TOCItem } from "@/types/Post";

const PostDetail = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [TOCData, setTOCData] = useState<TOCItem[]>([]);
  const [TOCOffset, setTOCOffset] = useState(-120);

  const [user] = useAuthState(auth);
  const router = useRouter();
  const username = router.asPath.split('/').slice(1, 2)[0];
  const { postId } = router.query;
  const postContentRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useDarkMode();

  const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
    ssr: false,
  });

  // 게시글 데이터
  useEffect(() => {
    if (postId) {
      loadPostDetails(postId as string);
    }
  }, [postId]);

  // 목차 데이터
  useEffect(() => {
    if (post) {
      generateTableOfContents(post.content).then((tocItems) => {
        setTOCData(tocItems);
      });
    }
  }, [post]);

  // Scroll
  useEffect(() => {
    const handleScroll = () => {
      const postContentTop =
        postContentRef.current?.getBoundingClientRect().top || 0;
      setTOCOffset(Math.max(0, -postContentTop + 300));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 게시글, 댓글
  const loadPostDetails = async (postId: string) => {
    try {
      const postData = await getPostDetails(username, postId);
      setPost(postData);

      const comments: Comment[] = Object.values(postData.comments || {});

      const formattedComments = comments
        .map((comment: Comment) => {
          if ("createdAt" in comment) {
            const createdAtDate = new Date(comment.createdAt);
            const formattedDate = new Intl.DateTimeFormat("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).format(createdAtDate);

            return {
              ...comment,
              createdAt: formattedDate,
            } as Comment;
          }
          return null;
        })
        .filter((comment): comment is Comment => comment !== null);

      setComments(formattedComments);
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
      await addComment(commentText, postId as string);
      setCommentText("");
      loadPostDetails(postId as string);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmDelete = confirm("정말로 댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const postData = await getPostDetails(username, postId as string);

        // 댓글이 해당 게시글에 존재하는지 확인
        const commentExists =
          postData.comments && commentId in postData.comments;
        if (!commentExists) {
          alert("해당 댓글이 존재하지 않습니다.");
          return;
        }

        await deleteComment(postId as string, commentId);
        loadPostDetails(postId as string); // 댓글 삭제 후 게시글 및 댓글 새로 고침
      } catch (error) {
        console.error("Failed to delete comment:", error);
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 게시글 수정, 삭제
  const handleUpdatePost = () => {
    router.push(`/${user?.displayName}/blog/edit/${postId}`);
  };

  const handleDeletePost = async () => {
    if (!confirm("정말로 게시글을 삭제하시겠습니까?")) return;

    try {
      await deletePost(postId as string);
      router.push(`/${user?.displayName}/blog`);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  // 목차 이동
  const generateTableOfContents = async (
    content: string
  ): Promise<TOCItem[]> => {
    const htmlContent = await remark().use(remarkHtml).process(content);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent.toString(), "text/html");
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    const ids: Record<string, number> = {};

    return headings.map((heading) => {
      const text = heading.textContent?.trim() || "";

      // 한국어 제목
      let id = text
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ-]/g, "")
        .toLowerCase();

      // 중복된 제목
      if (ids[id]) {
        id += `-${ids[id]}`;
        ids[id]++;
      } else {
        ids[id] = 1;
      }

      heading.id = id;

      return {
        id,
        text,
        level: heading.tagName,
      };
    });
  };

  const handleScrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto mt-8 p-4 md:p-6 rounded-lg shadow-md ${
        darkMode ? "bg-black text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {post && (
        <div className="grid gap-6 lg:grid-cols-[3fr,1fr] lg:gap-12">
          {/* 목차 for Mobile */}
          <aside
            className={`lg:hidden rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-100 border-gray-300"
            } p-4 mb-6`}
          >
            <h2 className="text-xl font-semibold">목차</h2>
            <ul className="space-y-1 mt-4">
              {TOCData.map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer text-sm ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } hover:underline pl-${
                    item.level === "H2" ? "4" : "8"
                  } overflow-hidden whitespace-nowrap text-ellipsis`}
                  onClick={() => handleScrollToSection(item.id)}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </aside>

          {/* 게시물 콘텐츠 */}
          <div className="flex-grow lg:ml-4 lg:mr-8">
            {user?.uid === post.authorId && (
              <div className="flex justify-end mb-2">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="focus:outline-none"
                  >
                    •••
                  </button>
                  {showDropdown && (
                    <div
                      className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg ring-1 ring-opacity-5 ${
                        darkMode
                          ? "bg-gray-800 ring-gray-600"
                          : "bg-white ring-gray-300"
                      }`}
                    >
                      <button
                        onClick={handleUpdatePost}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700"
                        }`}
                      >
                        수정
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                          darkMode
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-500"
                        }`}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* 드롭다운 및 게시글 내용 */}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-2 mb-6">
              {post.tags &&
                post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`text-sm font-bold px-2 py-1 rounded-full text-white dark:text-black ${
                      darkMode ? "bg-[#FDAD00]" : "bg-[#94B9F3]"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            <div
              className={`prose ${
                darkMode ? "prose-invert" : ""
              } max-w-none mb-10`}
              ref={postContentRef}
            >
              <MarkdownPreview
                source={post.content}
                rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
                className={`bg-transparent ${
                  darkMode ? "text-gray-400" : "text-gray-700"
                }`}
              />
            </div>
          </div>

          {/* 목차 for Desktop */}
          <aside
            className={`hidden lg:block lg:sticky top-24 p-4 border rounded-lg ${
              darkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-100 border-gray-300"
            }`}
            style={{
              top: `${TOCOffset}px`,
              height: "auto",
              maxHeight: `${Math.min(TOCData.length * 3, 55)}rem`,
              // 아이템 수에 따른 최대 높이 제한
              minHeight: "7rem",
              minWidth: "240px",
              overflowY: "hidden",
            }}
          >
            <h2 className="text-xl font-semibold">목차</h2>
            <ul className="space-y-1 mt-4">
              {TOCData.map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer text-sm ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  } hover:underline pl-${
                    item.level === "H2" ? "4" : "8"
                  } overflow-hidden whitespace-nowrap text-ellipsis`}
                  onClick={() => handleScrollToSection(item.id)}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      {/* 댓글 작성 및 댓글 목록 */}
      <div className="mt-8 space-y-4">
        {(
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
                <span className="font-semibold">{comment.authorName}</span>{" "}
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
  );
};

export default PostDetail;
