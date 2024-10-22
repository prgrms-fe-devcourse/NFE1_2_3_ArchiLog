import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { auth } from '../firebase';

interface UserData {
  userId: string;
  name: string;
  email: string;
  createdAt: number;
}

interface AuthResponse {
  id: string;
  token: string;
  name: string;
}

const db = getDatabase();

// 회원가입 함수
export const signUp = async (
  email: string, 
  password: string, 
  name: string
): Promise<AuthResponse> => {
  try {
    // 1. Firebase Authentication으로 사용자 생성
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );

    const user = userCredential.user;
    
    // 2. 사용자 추가 정보를 Realtime Database에 저장
    const userData: UserData = {
      userId: user.uid,
      name: name,
      email: email,
      createdAt: Date.now()
    };

    // users 노드에 사용자 정보 저장
    await set(ref(db, `users/${user.uid}/profile`), userData);

    // 3. JWT 토큰 가져오기
    const token = await user.getIdToken();

    return {
      id: user.uid,
      token: token,
      name: name
    };

  } catch (error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('이미 사용 중인 이메일입니다.');
      case 'auth/invalid-email':
        throw new Error('유효하지 않은 이메일 형식입니다.');
      case 'auth/operation-not-allowed':
        throw new Error('이메일/비밀번호 회원가입이 비활성화되어있습니다.');
      case 'auth/weak-password':
        throw new Error('비밀번호는 최소 6자리 이상이어야 합니다.');
      default:
        throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  }
};

// 로그인 함수
export const signIn = async (
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    // 1. Firebase Authentication으로 로그인
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const user = userCredential.user;

    // 2. Realtime Database에서 사용자 정보 가져오기
    const userSnapshot = await get(ref(db, `users/${user.uid}/profile`));
    const userData = userSnapshot.val();

    if (!userData) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    // 3. JWT 토큰 가져오기
    const token = await user.getIdToken();

    return {
      id: user.uid,
      token: token,
      name: userData.name
    };

  } catch (error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('유효하지 않은 이메일입니다.');
      case 'auth/user-disabled':
        throw new Error('비활성화된 계정입니다.');
      case 'auth/user-not-found':
        throw new Error('존재하지 않는 계정입니다.');
      case 'auth/wrong-password':
        throw new Error('잘못된 비밀번호입니다.');
      default:
        throw new Error('로그인 중 오류가 발생했습니다.');
    }
  }
};

// 현재 로그인된 사용자 정보 가져오기
export const getCurrentUser = async (): Promise<UserData | null> => {
  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }

  const userSnapshot = await get(ref(db, `users/${user.uid}/profile`));
  return userSnapshot.val();
};

// 로그아웃
export const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    throw new Error('로그아웃 중 오류가 발생했습니다.');
  }
};

// 사용자 인증 상태 변경 감지
export const onAuthStateChanged = (callback: (user: UserData | null) => void) => {
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userSnapshot = await get(ref(db, `users/${user.uid}/profile`));
      callback(userSnapshot.val());
    } else {
      callback(null);
    }
  });
};

// 토큰 갱신
export const refreshToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  const token = await user.getIdToken(true); // true로 설정하여 강제로 토큰 갱신
  return token;
};


// 사용자 삭제
export const deleteUser = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('로그인된 사용자가 없습니다.');
  }

  try {
    // Realtime Database에서 사용자 정보 삭제
    await set(ref(db, `users/${user.uid}`), null);
    // Authentication에서 사용자 삭제
    await user.delete();
  } catch (error) {
    throw new Error('계정 삭제 중 오류가 발생했습니다.');
  }
};