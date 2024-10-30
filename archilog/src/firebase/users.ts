import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { database } from "./firebase";
import { getCurrentUserId } from "./auth";
import User from "@/types/User";

// 현재 사용자 정보
export const getCurrentUserInfo = (): Promise<User | null> => { 
  return new Promise(async (resolve, reject) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (user) {
        console.log(user);
        try {
          const userRef = ref(database, `users/${user.displayName}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            console.error("No user data found for authenticated user.");
            resolve(null);
          }
        } catch (error) {
          console.error("데이터를 불러오는 중 오류 발생:", error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

// 사용자 정보
export const getUserInfo = async (key: string): Promise<User> => {
  try{
      const userRef = ref(database, `users/${key}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No user data found");
    }
  } catch {
    throw new Error("No user found");
  }
  
};


// 마이페이지 불러오기 함수
export const getAbout = async (username: string) => {
  const userRef = ref(database, `users/${username}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log(userData);
      return {
        id: userData.userId,
        name: userData.username,
        resume: userData.resume,
      };
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// 마이페이지 수정 함수
export const editAbout = async (resume: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  // userId 체크 부분 제거함 (현재 로그인한 사용자의 정보만 수정 가능)
  const userRef = ref(database, `users/${user.displayName}`);

  try {
    await update(userRef, { resume });
    console.log("User information updated successfully");
  } catch (error) {
    console.error("Error updating user information:", error);
    throw new Error("Failed to update user information");
  }
};
