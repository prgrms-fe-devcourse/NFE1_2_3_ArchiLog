import React from "react";
import { useRouter } from "next/router";
import PostDetail from "@/components/PostDetail";

const PostPage: React.FC = () => {
  const router = useRouter();
  const { postId } = router.query;

  if (postId === undefined || Array.isArray(postId)) {
    return <div>게시글을 찾을 수 없습니다.</div>; // postId가 undefined인 경우
  }


  return <PostDetail postId={postId} darkMode={false} />;
};

export default PostPage;
