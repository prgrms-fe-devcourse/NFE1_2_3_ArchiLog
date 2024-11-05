import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  GithubAuthProvider, 
  GoogleAuthProvider, 
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, database } from './firebase';
import { useRouter } from 'next/router';
import User from '@/types/User';
import { User as AuthUser } from 'firebase/auth';

// 이메일 중복 확인
export const checkEmailExists = async (email: string) => {
  try {
    const snapshot = await get(child(ref(database), 'users'));
    if (snapshot.exists()) {
      const users = snapshot.val();
      // return Object.values(users).some((user: User) => user.email === email);
      return Object.values(users as Record<string, User>).some((user) => user.email === email);
    }
    return false;
  } catch (error) {
    console.error("계정 존재 확인 오류:", error);
    throw new Error("계정을 확인하는 중 오류가 발생했습니다.");
  }
};

// 닉네임 중복 확인
export const checkUsernameExists = async (username: string) => {
  try {
    const snapshot = await get(child(ref(database), 'users'));
    if (snapshot.exists()) {
      const users = snapshot.val();
      // return Object.values(users).some((user: any) => user.username === username);
      return Object.values(users as Record<string, User>).some((user) => user.username === username);
    }
    return false;
  } catch (error) {
    console.error("유저네임 확인 오류:", error);
    throw new Error("유저네임을 확인하는 중 오류가 발생했습니다.");
  }
};

// 비밀번호 재설정
export const sendResetPasswordEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("비밀번호 재설정 이메일이 발송되었습니다.");
  } catch (error) {
    console.error("비밀번호 재설정 오류:", error);
    throw new Error("비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.");
  }
};

// 회원가입
export const signUp = async (
  email: string,
  password: string,
  username: string,
  router: ReturnType<typeof useRouter>
) => {
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error("이미 사용 중인 이메일입니다. 다른 이메일을 선택해주세요.");
  }

  const usernameExists = await checkUsernameExists(username);
  if (usernameExists) {
    throw new Error("이미 사용 중인 유저네임입니다. 다른 유저네임을 선택해주세요.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      const timestamp = Date.now();
      
      await set(ref(database, `users/${username}`), {
        username,
        email,
        createdAt: timestamp,
        userId: user.uid,
        resume: "",
        project: [],
        posts: [],
      });
    }
    
    await updateProfile (user, { displayName: username });

    alert("회원가입이 완료되었습니다. 메인 페이지로 이동합니다.");
    router.push(`/${user.displayName}`); 
    return user;
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
  }
};

// 로그인
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log("로그인 오류 발생");

    const firebaseError = error as { code: string };
    if (firebaseError.code === 'auth/user-not-found') {
      return "등록된 이메일을 찾을 수 없습니다. 회원가입을 진행해 주세요.";
    } else if (firebaseError.code === 'auth/wrong-password') {
      return "비밀번호가 올바르지 않습니다. 다시 시도해 주세요.";
    } else if (firebaseError.code === 'auth/too-many-requests') {
      return "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    } else {
      return "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.";
    }
  }
};

// 깃허브 로그인
export const signInWithGithubPopup = async () => {
  const provider = new GithubAuthProvider();
  provider.setCustomParameters({
    'prompt': 'select_account'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    if(!await checkUsernameExists(result.user.displayName || '')){
      createUserData(result.user);
    }
    return result.user;
  } catch (error) {
    console.error("깃허브 로그인 오류:", error);
    throw error;
  }
};

// 구글 로그인
export const signInWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    'prompt': 'select_account'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    if(!await checkUsernameExists(result.user.displayName || '')){
      await createUserData(result.user);
    }

    return result.user;
  } catch (error) {
    console.error("구글 로그인 오류:", error);
    throw error;
  }
};

const createUserData = async (user: AuthUser) => {
  console.log('실행')
  if (user) {
    const timestamp = Date.now();

    let name = '';
    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (korean.test(user.displayName || '')) {
      name = (user.email || '').split("@")[0];
    } else {
      name = user.displayName || '';
    }
 
    await set(ref(database, `users/${name}`), {
      username: name,
      email: user.email,
      createdAt: timestamp,
      userId: user.uid,
      resume: "",
      project: [],
      posts: [],
    });

    await updateProfile (user, { displayName: name });
  }
}

// 로그아웃
export const logOutAndRedirect = async (router: ReturnType<typeof useRouter>) => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("로그아웃 오류:", error);
    throw error;
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

// 현재 사용자 ID
export const getCurrentUserId = () => {
  return new Promise<string>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        return null;
      }
    });
  });
};

// 인증 확인
export const checkAuth = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("사용자가 인증되지 않았습니다.");
  }
  return user;
};

export { auth };
