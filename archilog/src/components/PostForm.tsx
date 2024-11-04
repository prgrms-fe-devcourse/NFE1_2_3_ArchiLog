import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { addPost } from "../firebase/posts";
import { auth } from "../firebase/firebase";

import "react-markdown-editor-lite/lib/index.css"; // 마크다운 에디터 스타일
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import { pasteImage, pasteImageUrl } from "@/utils/uploadImage";

interface PostFormInputs {
  title: string;
  tags: string;
}

interface PostFormProps {
  darkMode: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ darkMode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormInputs>();
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const mdParser = new MarkdownIt();
  const editorRef = useRef<HTMLDivElement | null>(null);

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
      await addPost(
        data.title,
        markdownContent,
        data.tags.split(",").map((tag) => tag.trim())
      );

      setLoading(false);
      alert("게시글이 성공적으로 등록되었습니다!");
      window.history.go(-1);
    } catch (error) {
      console.error("게시글 등록 오류:", error);
      setLoading(false);
    }
  };

  const handlePaste = useCallback(async (event: React.ClipboardEvent) => {
    event.preventDefault();
    const files: File[] = Array.from(event.clipboardData.files);
    await pasteImage(files);
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const files: File[] = Array.from(event.dataTransfer.files);
    await pasteImage(files);
  }, []);

  function onImageUpload(file: File) {
    return new Promise(async (resolve) => {
      const imgUrl = await pasteImageUrl([file]);
      resolve(imgUrl[0]);
    });
  }

  useEffect(() => {
    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener(
        "paste",
        handlePaste as unknown as EventListener
      );
      editorElement.addEventListener(
        "drop",
        handleDrop as unknown as EventListener
      );
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener(
          "paste",
          handlePaste as unknown as EventListener
        );
        editorElement.removeEventListener(
          "drop",
          handleDrop as unknown as EventListener
        );
      }
    };
  }, []);

  return (
    <div
      className={`p-4 md:p-8 mx-auto mt-16 rounded-lg shadow-lg ${
        darkMode ? "bg-[#222121] text-gray-200" : "bg-white text-gray-900"
      }`}
      style={{ maxWidth: "1200px", width: "90%" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 게시글 제목 */}
        <div className="mb-6">
          <input
            id="title"
            {...register("title", { required: "제목은 필수 입력 항목입니다." })}
            type="text"
            className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-[#D9D9D9] text-gray-900 focus:ring-yellow-500"
                : "bg-gray-100 text-gray-900 focus:ring-blue-500"
            }`}
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
            className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-[#151B23] text-[#ffffff] focus:ring-yellow-500"
                : "bg-gray-100 text-gray-900 focus:ring-blue-500"
            }`}
            placeholder="태그를 입력해주세요. (태그1, 태그2, ...)"
          />
          {errors.tags && (
            <span className="text-red-500 text-sm">{errors.tags.message}</span>
          )}
        </div>

        <div className="mb-6">
          <MdEditor
            value={markdownContent}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={({ text }) => setMarkdownContent(text)}
            onImageUpload={onImageUpload}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-[#010409] text-white border-[#656c76] hover:bg-[#101418] focus:ring-[#656c76]"
                : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-600"
            }`}
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
