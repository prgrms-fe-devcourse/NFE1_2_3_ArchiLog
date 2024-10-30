import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { database } from "./firebase";

// 현재 사용자 정보
export const getCurrentUserInfo = (): Promise<any | null> => {
  return new Promise((resolve) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (user) {
        try {
          const userRef = ref(database, `users/${user.uid}`);
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

// 마이페이지 불러오기 함수
export const getAbout = async (userId: string) => {
  const userRef = ref(database, `users/${userId}`);

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

  const userRef = ref(database, `users/${user.uid}`);

  try {
    await update(userRef, { resume });
    console.log("User information updated successfully");
  } catch (error) {
    console.error("Error updating user information:", error);
    throw new Error("Failed to update user information");
  }
};
