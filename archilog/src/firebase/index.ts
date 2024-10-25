
import { onRequest , HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Types
interface UserData {
  userId: string;
  name: string;
  passwd: string;
  resume?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Firebase Admin 초기화
admin.initializeApp();

const db = admin.firestore();

// Error Handler
const handleApiError = (error: any): ApiResponse<null> => {
  console.error("API Error:", error);
  return {
    success: false,
    error: error instanceof Error ? error.message : "An unknown error occurred"
  };
};

// 회원가입 API
export const registerUser = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new HttpsError("invalid-argument", "Method Not Allowed");
    }

    const { userId, name, passwd } = req.body as Partial<UserData>;

    if (!userId || !name || !passwd) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const userRef = db.collection("users").doc(userId);
    const userData: UserData = { userId, name, passwd };
    
    await userRef.set(userData);
    const token = "dummy-token"; // JWT 토큰 로직 구현 필요

    res.status(201).json({
      success: true,
      data: { id: userId, token }
    });
  } catch (error) {
    const response = handleApiError(error);
    res.status(500).json(response);
  }
});

// 로그인 API
export const loginUser = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new HttpsError("invalid-argument", "Method Not Allowed");
    }

    const { userId, passwd } = req.body as Partial<UserData>;

    if (!userId || !passwd) {
      throw new HttpsError("invalid-argument", "Missing credentials");
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data() as UserData;
    if (userData.passwd !== passwd) {
      throw new HttpsError("unauthenticated", "Invalid password");
    }

    const token = "dummy-token"; // JWT 토큰 로직 구현 필요

    res.status(200).json({
      success: true,
      data: { id: userId, token }
    });
  } catch (error) {
    const response = handleApiError(error);
    res.status(error instanceof HttpsError ? 401 : 500).json(response);
  }
});

// 회원 정보 불러오기 API
export const getUserInfo = onRequest(async (req, res) => {
  try {
    if (req.method !== "GET") {
      throw new HttpsError("invalid-argument", "Method Not Allowed");
    }

    const id = req.query.id as string;
    if (!id) {
      throw new HttpsError("invalid-argument", "User ID is required");
    }

    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data() as UserData;
    
    res.status(200).json({
      success: true,
      data: { 
        name: userData.name, 
        resume: userData.resume 
      }
    });
  } catch (error) {
    const response = handleApiError(error);
    res.status(error instanceof HttpsError ? 404 : 500).json(response);
  }
});

// 게시글 목록 불러오기 API
export const getPostsByAuthor = onRequest(async (req, res) => {
  try {
    if (req.method !== "GET") {
      throw new HttpsError("invalid-argument", "Method Not Allowed");
    }

    const id = req.query.id as string;
    if (!id) {
      throw new HttpsError("invalid-argument", "Author ID is required");
    }

    const postsSnapshot = await db.collection("posts")
      .where("author", "==", id)
      .get();
      
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    const response = handleApiError(error);
    res.status(500).json(response);
  }
});
