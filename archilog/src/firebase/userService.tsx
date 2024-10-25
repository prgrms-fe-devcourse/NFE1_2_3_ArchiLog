// firebase/users.ts
import { getDatabase, ref, set, get, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import firebaseApp from './firebase';  // default export로 변경

const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

// 타입 정의 개선
interface Profile {
  name: string;
  resume: string;
  createdAt: number;
  userId: string;
  updatedAt?: number;
}

interface Post {
  content: string;
  createdAt: string;
  title: string;
}

interface Project {
  createdAt: string;
  description: string;
  title: string;
  url: string;
}

interface UserProfile {
  username: string;
  email: string;
  createdAt: number;
  userId: string;
  profile: Profile;
  posts?: Record<string, Post>;
  projects?: Record<string, Project>;
}

// 인증 확인 헬퍼 함수
const checkUserAuth = (userId: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User is not authenticated");
  }
  if (currentUser.uid !== userId) {
    throw new Error("Unauthorized access");
  }
  return currentUser;
};

export const createUserProfile = async (userId: string, userData: { email: string, username: string }) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const timestamp = Date.now();
    
    const userProfile: UserProfile = {
      username: userData.username,
      email: userData.email,
      createdAt: timestamp,
      userId: userId,
      profile: {
        name: "",
        resume: "",
        createdAt: timestamp,
        userId: userId
      }
    };

    await set(userRef, userProfile);
    return userProfile;
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    throw new Error(error.message);
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val() as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    checkUserAuth(userId);  // 인증 확인
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, updates);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(error.message);
  }
};

export const updateProfileInfo = async (userId: string, profileData: Partial<Profile>) => {
  try {
    checkUserAuth(userId);  // 인증 확인
    const profileRef = ref(db, `users/${userId}/profile`);
    await update(profileRef, {
      ...profileData,
      updatedAt: Date.now()
    });
  } catch (error: any) {
    console.error('Error updating profile info:', error);
    throw new Error(error.message);
  }
};

export const deleteUserProfile = async (userId: string) => {
  try {
    checkUserAuth(userId);  // 인증 확인
    const userRef = ref(db, `users/${userId}`);
    await remove(userRef);
  } catch (error: any) {
    console.error('Error deleting user profile:', error);
    throw new Error(error.message);
  }
};

export const addUserPost = async (userId: string, postData: Omit<Post, 'createdAt'>) => {
  try {
    checkUserAuth(userId);  // 인증 확인
    const newPostRef = ref(db, `users/${userId}/posts/${Date.now()}`);
    
    await set(newPostRef, {
      ...postData,
      createdAt: new Date().toString()
    });
  } catch (error: any) {
    console.error('Error adding post:', error);
    throw new Error(error.message);
  }
};

export const addUserProject = async (userId: string, projectData: Omit<Project, 'createdAt'>) => {
  try {
    checkUserAuth(userId);  // 인증 확인
    const projectsRef = ref(db, `users/${userId}/projects/${Date.now()}`);
    
    await set(projectsRef, {
      ...projectData,
      createdAt: new Date().toString()
    });
  } catch (error: any) {
    console.error('Error adding project:', error);
    throw new Error(error.message);
  }
};

// 게시물 가져오기 함수 추가
export const getUserPosts = async (userId: string) => {
  try {
    const postsRef = ref(db, `users/${userId}/posts`);
    const snapshot = await get(postsRef);
    if (snapshot.exists()) {
      return snapshot.val() as Record<string, Post>;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting user posts:', error);
    throw new Error(error.message);
  }
};

// 프로젝트 가져오기 함수 추가
export const getUserProjects = async (userId: string) => {
  try {
    const projectsRef = ref(db, `users/${userId}/projects`);
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
      return snapshot.val() as Record<string, Project>;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting user projects:', error);
    throw new Error(error.message);
  }
};