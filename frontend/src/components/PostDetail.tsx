import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comment from "./Comment";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const PostDetail: React.FC = ({ darkMode }) => {
  const { postId } = useParams(); // React Router에서 postId를 가져옴
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase나 API에서 postId로 게시글 데이터를 가져오는 함수
    const fetchPost = async () => {
      setLoading(true);
      try {
        // Firebase 또는 API로부터 게시글을 가져오는 로직 추가 예정
        // 예시 데이터를 사용한 초기 구현
        const fetchedPost = {
          id: postId!,
          title: "자바란 무엇인가?",
          content: `<h2>개요</h2><p>자바는 ...</p><h2>자바의 뜻</h2><p>...</p><h2>자바 코드</h2><p>코드 설명</p>`,
          tags: ["Java", "프로그래밍", "마크업"],
        };
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  const handleDelete = () => {
    // 게시글 삭제 로직 (Firebase 연동 후 추가)
    alert("게시글이 삭제되었습니다.");
    navigate("/"); // 삭제 후 메인 페이지로 이동
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row p-5 ">
      {/* 게시글 내용 */}
      <div className="w-full md:w-3/4">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* 수정/삭제 버튼 */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => navigate(`/edit/${post.id}`)}
          >
            수정
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>

        {/* 댓글 */}
        <div className="mt-8">
          <Comment postId={post.id} />
        </div>
      </div>

      {/* 소제목 목록 (오른쪽) */}
      <div className="w-full md:w-1/4 pl-4">
        <h2 className="text-2xl font-bold mb-4">목차</h2>
        <ul className="space-y-2">
          {["개요", "자바의 뜻", "자바 코드"].map((heading, index) => (
            <li key={index}>
              <a href={`#${heading}`} className="text-blue-500 hover:text-blue-700">
                {heading}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostDetail;
