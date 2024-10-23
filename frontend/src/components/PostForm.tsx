import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

interface PostFormInputs {
  title: string;
  tags: string;
}

const PostForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormInputs>();
  const [content, setContent] = useState<string>(""); // 마크업 내용
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

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
      const postDoc = {
        title: data.title,
        content: content,
        tags: data.tags.split(",").map((tag) => tag.trim()),
        createdAt: new Date(),
        userId: user.uid,
      };

      await addDoc(collection(db, "posts"), postDoc);
      setLoading(false);
      alert("게시글이 성공적으로 등록되었습니다!");
    } catch (error) {
      console.error("게시글 등록 오류:", error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <>
        <h1>게시글 작성</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title">게시글 제목</label>
            <input
              id="title"
              {...register("title", { required: "제목은 필수 입력 항목입니다." })}
              type="text"
              placeholder="제목을 입력하세요"
            />
            {errors.title && <span>{errors.title.message}</span>}
          </div>

          <div>
            <label htmlFor="tags">태그</label>
            <input
              id="tags"
              {...register("tags", { required: "태그는 필수 입력 항목입니다." })}
              type="text"
              placeholder="태그를 입력하세요 (최대 10개, 콤마로 구분)"
            />
            {errors.tags && <span>{errors.tags.message}</span>}
          </div>

          <div>
            <label>내용</label>
            <ReactQuill value={content} onChange={setContent} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "등록 중..." : "게시글 등록"}
          </button>
        </form>
      </>
    </div>
  );
};

export default PostForm;
