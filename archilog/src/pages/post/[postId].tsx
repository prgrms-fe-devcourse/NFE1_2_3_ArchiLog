import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import { getPostDetails, addComment, deletePost } from "@/firebase/posts";

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

  useEffect(() => {
    if (postId) {
      fetchPostDetails(postId as string);
    }
  }, [postId]);

  const fetchPostDetails = async (postId: string) => {
    try {
      const postData = await getPostDetails(postId);
      setPost(postData);
      setComments(postData.comments || []);
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
        router.push("/blog"); // 게시글 목록 페이지로 이동
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleUpdatePost = () => {
    router.push(`/posts/edit/${postId}`); // 수정 페이지로 이동
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmDelete = confirm("정말로 댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        // 댓글 삭제 로직 필요 (Firebase 백엔드에서 구현된 경우)
        // await deleteComment(postId, commentId);

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
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-md">
      {/* 게시글 제목 */}
      {post && (
        <div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center mt-2">
            {post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="text-sm bg-gray-200 rounded-full px-2 py-1 mr-2"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-4 mb-8">
            {/* 게시글 내용 */}
            <div
              ref={postContentRef}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* 목차 */}
          <aside className="mb-8">
            <h2 className="text-xl font-semibold">목차</h2>
            <ul>
              {generateTableOfContents().map((item) => (
                <li
                  key={item.id}
                  className={`pl-${
                    item.level === "H2" ? "4" : "8"
                  } cursor-pointer text-blue-500`}
                  onClick={() => handleScrollToSection(item.id)}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </aside>

          {/* 댓글 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">댓글</h2>
            {user ? (
              <div className="mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="댓글을 입력하세요."
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    댓글 작성
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">로그인 후 댓글 작성이 가능합니다.</p>
            )}
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} className="border-t pt-4 mt-4">
                  <p className="text-gray-800">{comment.content}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{comment.createdAt}</span>
                    {user?.uid === comment.authorId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 수정 및 삭제 버튼 */}
          {user?.uid === post.authorId && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpdatePost}
                className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-md"
              >
                수정
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetail;
