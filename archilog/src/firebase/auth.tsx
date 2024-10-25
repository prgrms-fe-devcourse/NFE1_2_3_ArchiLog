// firebase/auth.tsx
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from './firebase';

export const signUp = async (email: string, password: string, username: string) => {
  try {
    // 1. Firebase Authentication으로 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Realtime Database에 사용자 프로필 생성
    if (user) {
      const timestamp = Date.now();
      await set(ref(database, `users/${user.uid}`), {
        username,
        email,
        createdAt: timestamp,
        userId: user.uid,
        profile: {
          name: "",
          resume: "",
          createdAt: timestamp,
          userId: user.uid
        }
      });
    }

    return user;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }
  return user.uid;
};

export const checkAuth = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User is not authenticated');
  }
  return user;
};

export { auth };