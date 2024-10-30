import {
  getDatabase,
  ref,
  get,
  update,
  remove,
  push,
  serverTimestamp,
  DataSnapshot,
  DatabaseReference
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { getCurrentUserId } from './auth';

interface Post {
    id: string;
    title: string;
    content: string;
    tags: string[];
    authorId: string;
    createdAt: number;
    updatedAt: number;
  }

// 사용자 인증
export const checkAuthenticated = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
};

// 권한 확인하기
export const checkAuthorized = async (postRef: DatabaseReference, userId: string) => {
  const snapshot: DataSnapshot = await get(postRef);

  if (!snapshot.exists()) {
    throw new Error("Post not found");
  }

  const postData = snapshot.val();

  if (postData.authorId !== userId) {
    throw new Error("You do not have permission to perform this action");
  }

  return postData;
};

// 게시글 목록 불러오기
export const getPost = async () => {
  const db = getDatabase();
  const postsRef = ref(db, "posts/create");

  try {
    const snapshot = await get(postsRef);
    const posts: Post[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        posts.push({
          id: childSnapshot.key,
          ...post
        });
      });
    }

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

//게시글 목록 불러오기 수정
// export const getPost = async (authorId: string) => {
//   const db = getDatabase();
//   const postsRef = ref(db, `${authorId}/posts`);

//   try {
//     const snapshot = await get(postsRef);
//     const posts: any[] = [];

//     if (snapshot.exists()) {
//       snapshot.forEach((childSnapshot: DataSnapshot) => {
//         const postData = childSnapshot.val();
//         posts.push({
//           id: childSnapshot.key,
//           ...postData,
//         });
//       });
//     }

//     return posts;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     throw error;
//   }
// };

// 게시글 상세정보 불러오기
export const getPostDetails = async (postId: string) => {
  const db = getDatabase();
  const postRef = ref(db, `posts/create/${postId}`);

  try {
    const snapshot = await get(postRef);

    if (!snapshot.exists()) {
      throw new Error("Post not found");
    }

    const postData = snapshot.val();
 
    return {
      id: postId,
      ...postData
    };
  } catch (error) {
    console.error("Error fetching post details:", error);
    throw error;
  }
};

// 게시글에 댓글 추가하기
export const addComment = async (content: string, postId: string) => {
  const db = getDatabase();
  const user = checkAuthenticated();
  const commentsRef = ref(db, `posts/${postId}/comments`);

  try {
    await push(commentsRef, {
      content: content,
      authorId: user.uid,
      createdAt: serverTimestamp()
    });

    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

// 게시글에 댓글 추가하기 수정
// export const addComment = async (
//   content: string,
//   postId: string
// ) => {
//   const db = getDatabase();
//   const user = checkAuthenticated();
//   const userId = await getCurrentUserId();
//   const commentsRef = ref(db, `${userId}/posts/${postId}/comments`);

//   try {
//     await push(commentsRef, {
//       content: content,
//       authorId: user.uid,
//       createdAt: serverTimestamp()
//     });
//     console.log("Comment added successfully");
//   } catch (error) {
//     console.error("Error adding comment: ", error);
//     throw error;
//   }
// };

// 게시글 추가하기
export const addPost = async (title: string, content: string, tags: string[]) => {
  const db = getDatabase();
  const user = checkAuthenticated();
  const postsRef = ref(db, "posts/create");

  try {
    const newPostRef = await push(postsRef, {
      title: title,
      content: content,
      tags: tags,
      authorId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log(`Post added successfully with ID: ${newPostRef.key}`);
    return newPostRef.key;
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error;
  }
};

// // 게시글 추가하기 수정
// export const addPost = async (
//   title: string, 
//   content: string, 
//   tags: string[]
// ) => {
//   const db = getDatabase();
//   const user = await checkAuthenticated();
//   const userId = await getCurrentUserId();
//   const postsRef = ref(db, `users/${userId}/posts`);

//   try {
//     const newPostRef = await push(postsRef, {
//       title: title,
//       content: content,
//       tags: tags,
//       authorId: user.uid,
//       comments: [],
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//   console.log(`Post added successfully with ID: ${newPostRef.key}`);

//   return newPostRef.key;
//   } catch (error) {
//     console.error("Error adding post: ", error);
//     throw error;
//   }
// };

// 게시글 삭제하기
export const deletePost = async (postId: string) => {
  const db = getDatabase();
  const user = checkAuthenticated();
  const postRef = ref(db, `posts/${postId}`);

  try {
    await checkAuthorized(postRef, user.uid);
    await remove(postRef);

    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
};

// 게시글 수정하기 함수
export const updatePost = async (postId: string, title: string, tags: string[], content: string) => {
  const db = getDatabase();
  const user = checkAuthenticated();
  const postRef = ref(db, `posts/${postId}`);

  try {
    await checkAuthorized(postRef, user.uid);
    await update(postRef, {
      title: title,
      tags: tags,
      content: content,
      updatedAt: serverTimestamp()
    });

    console.log("Post updated successfully");
  } catch (error) {
    console.error("Error updating post: ", error);
    throw error;
  }
};
