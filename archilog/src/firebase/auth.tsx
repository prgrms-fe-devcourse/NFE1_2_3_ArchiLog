import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  GithubAuthProvider, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, database } from './firebase';
import { useRouter } from 'next/router';

// 닉네임 중복 확인 
export const checkUsernameExists = async (username: string) => {
  const snapshot = await get(child(ref(database), 'users'));
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.values(users).some((user: any) => user.username === username);
  }
  return false;
};

// 회원가입 및 로그인
export const signUp = async (email: string, password: string, username: string, router: ReturnType<typeof useRouter>) => {
  const usernameExists = await checkUsernameExists(username);
  if (usernameExists) {
    throw new Error("이미 존재하는 닉네임입니다. 다른 닉네임을 사용해주세요.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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

    alert("회원가입이 완료되었습니다. 메인 페이지로 이동합니다.");
    router.push("/"); 
    return user;
  } catch (error: any) {
    console.error('회원가입 오류:', error);
    throw error;
  }
};

// 이메일과 비밀번호로 로그인
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('로그인 오류:', error);
    throw error;
  }
};

// 깃허브 팝업 로그인
export const signInWithGithubPopup = async () => {
  const provider = new GithubAuthProvider();
  provider.setCustomParameters({
    'prompt': 'select_account'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error('깃허브 로그인 오류:', error);
    throw error;
  }
};

// 구글 팝업 로그인
export const signInWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    'prompt': 'select_account'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error('구글 로그인 오류:', error);
    throw error;
  }
};

// 로그아웃
export const logOutAndRedirect = async (router: ReturnType<typeof useRouter>) => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error: any) {
    console.error("로그아웃 오류:", error);
    throw error;
  }
};

// 현재 사용자 정보 가져오기
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

export { auth };