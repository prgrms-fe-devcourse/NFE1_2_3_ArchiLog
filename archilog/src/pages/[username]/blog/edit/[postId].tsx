// pages/posts/edit/[postId].tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../../../../firebase/firebase";
import { getPostDetails, updatePost } from "../../../../firebase/posts";
import "react-markdown-editor-lite/lib/index.css";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";

interface PostFormInputs {
  title: string;
  tags: string;
}

const PostEdit: React.FC = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [user] = useAuthState(auth);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const mdParser = new MarkdownIt();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormInputs>();

  useEffect(() => {
    // 게시글 데이터 가져오기
    const fetchPostData = async () => {
      if (postId && typeof postId === "string") {
        try {
          const username = user?.displayName || "";
          const post = await getPostDetails(username, postId);
          setValue("title", post.title);
          setValue("tags", post.tags.join(", "));
          setMarkdownContent(post.content);
        } catch (error) {
          console.error("Error fetching post data:", error);
          alert("게시글을 불러오는데 오류가 발생했습니다.");
        }
      }
    };
    fetchPostData();
  }, [postId, setValue, user]);

  const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (data.tags.split(",").length > 10) {
      alert("태그는 최대 10개까지 입력 가능합니다.");
      return;
    }

    try {
      setLoading(true);
      await updatePost(
        postId as string,
        data.title,
        data.tags.split(",").map((tag) => tag.trim()),
        markdownContent
      );
      setLoading(false);
      alert("게시글이 성공적으로 수정되었습니다!");
      window.history.go(-1);
    } catch (error) {
      console.error("게시글 수정 오류:", error);
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 md:p-8 mx-auto mt-16 rounded-lg shadow-lg bg-white text-gray-900"
      style={{ maxWidth: "1200px", width: "90%" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 게시글 제목 */}
        <div className="mb-6">
          <input
            id="title"
            {...register("title", { required: "제목은 필수 입력 항목입니다." })}
            type="text"
            className="w-full p-3 rounded-md focus:outline-none focus:ring-2 bg-gray-100 text-gray-900 focus:ring-blue-500"
            placeholder="제목을 입력하세요"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>

        {/* 태그 입력 */}
        <div className="mb-6">
          <input
            id="tags"
            {...register("tags", { required: "태그는 필수 입력 항목입니다." })}
            type="text"
            className="w-full p-3 rounded-md focus:outline-none focus:ring-2 bg-gray-100 text-gray-900 focus:ring-blue-500"
            placeholder="태그를 입력해주세요. (태그1, 태그2, ...)"
          />
          {errors.tags && (
            <span className="text-red-500 text-sm">{errors.tags.message}</span>
          )}
        </div>

        {/* 마크다운 에디터 */}
        <div className="mb-6">
          <MdEditor
            value={markdownContent}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={({ text }) => setMarkdownContent(text)} // 마크다운 업데이트
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-600"
          >
            {loading ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEdit;
