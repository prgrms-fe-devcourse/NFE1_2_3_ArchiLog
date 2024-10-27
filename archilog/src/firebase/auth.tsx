import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  GithubAuthProvider, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from './firebase';

// 회원가입
export const signUp = async (email: string, password: string, username: string) => {
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

    return user;
  } catch (error: any) {
    console.error('회원가입 오류:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.");
    }
    throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
  }
};

// 로그인
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('로그인 오류:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error("사용자를 찾을 수 없습니다. 회원가입을 해주세요.");
    } else if (error.code === 'auth/wrong-password') {
      throw new Error("잘못된 비밀번호입니다. 다시 시도해주세요.");
    }
    throw new Error("로그인에 실패했습니다. 다시 시도해주세요.");
  }
};

// 깃허브 로그인
export const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.setCustomParameters({
    'allow_signup': 'false'
  });

  try {
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    console.error('깃허브 로그인 오류:', error);
    throw new Error("깃허브 로그인에 실패했습니다. 다시 시도해주세요.");
  }
};

// 구글 로그인
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    'login_hint': 'user@example.com'
  });

  try {
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    console.error('구글 로그인 오류:', error);
    throw new Error("구글 로그인에 실패했습니다. 다시 시도해주세요.");
  }
};

// 깃허브 리디렉션 처리
export const handleGithubRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;

      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        username: user.displayName,
        createdAt: Date.now(),
        userId: user.uid,
        profile: {
          name: "",
          resume: "",
          createdAt: Date.now(),
          userId: user.uid
        }
      });

      return user;
    }
  } catch (error: any) {
    console.error('깃허브 리디렉션 결과 처리 오류:', error);
    throw new Error("깃허브 리디렉션 결과 처리에 실패했습니다.");
  }
};

// 구글 리디렉션 처리
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;

      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        username: user.displayName,
        createdAt: Date.now(),
        userId: user.uid,
        profile: {
          name: "",
          resume: "",
          createdAt: Date.now(),
          userId: user.uid
        }
      });

      return user;
    }
  } catch (error: any) {
    console.error('구글 리디렉션 결과 처리 오류:', error);
    throw new Error("구글 리디렉션 결과 처리에 실패했습니다.");
  }
};

// 로그아웃
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('로그아웃 오류:', error);
    throw new Error("로그아웃에 실패했습니다.");
  }
};

// 현재 사용자 정보
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

// 현재 사용자 아이디
export const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('로그인된 사용자가 없습니다.');
  }
  return user.uid;
};

// 인증 확인하기
export const checkAuth = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('사용자가 인증되지 않았습니다.');
  }
  return user;
};

export { auth };
