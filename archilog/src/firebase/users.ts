import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import { database } from "./firebase";


// 마이페이지 불러오기 함수
export const getAbout = async (userId: string) => {
  const userRef = ref(database, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return {
        name: userData.name,
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

//마이페이지 수정 함수
export const editAbout = async (userId: string, resume: string) => {
  // const auth = getAuth();
  // const user = auth.currentUser; // 현재 인증된 사용자 확인

  // if (!user) {
  //   throw new Error("User is not authenticated");
  // }

  // if (user.uid !== userId) {
  //   throw new Error("Unauthorized access");
  // }

  const userRef = ref(database, `users/${userId}`);


  try {
    await update(userRef, {
      resume: resume,
    });

    console.log("User information updated successfully");
  } catch (error) {
    console.error("Error updating user information:", error);
    throw new Error("Failed to update user information");
  }
};