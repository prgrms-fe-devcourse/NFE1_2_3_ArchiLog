import React, { useState } from "react";

interface CommentProps {
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

const Comment: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([
    { id: "1", content: "좋은 글입니다!", author: "John", createdAt: new Date() },
    { id: "2", content: "감사합니다!", author: "Jane", createdAt: new Date() },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newCommentData = {
      id: (comments.length + 1).toString(),
      content: newComment,
      author: "익명",
      createdAt: new Date(),
    };
    setComments([...comments, newCommentData]);
    setNewComment("");
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">댓글</h3>

      {/* 댓글 목록 */}
      <ul className="space-y-4 mb-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex justify-between">
            <div>
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500">
                {comment.author} - {comment.createdAt.toLocaleDateString()}
              </p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteComment(comment.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {/* 댓글 작성 */}
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="댓글을 입력하세요..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button
        className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleAddComment}
      >
        댓글 작성
      </button>
    </div>
  );
};

export default Comment;