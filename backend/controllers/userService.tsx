import { Request, Response } from 'express';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  UserCredential 
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

export class UserController {
  // 회원가입
  async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // 입력값 검증
      if (!email || !password || !name) {
        return res.status(400).json({ 
          error: '필수 입력값이 누락되었습니다.' 
        });
      }

      // Firebase Authentication으로 사용자 생성
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Realtime Database에 사용자 정보 저장
      const userData = {
        userId: user.uid,
        name,
        email,
        createdAt: Date.now()
      };

      await set(ref(db, `users/${user.uid}/profile`), userData);

      // JWT 토큰 생성
      const token = await user.getIdToken();

      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        user: {
          id: user.uid,
          name,
          email,
          token
        }
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
        'auth/invalid-email': '유효하지 않은 이메일입니다.',
        'auth/operation-not-allowed': '이메일/비밀번호 회원가입이 비활성화되었습니다.',
        'auth/weak-password': '비밀번호가 너무 약합니다.'
      };

      res.status(400).json({
        error: errorMessages[error.code] || '회원가입 중 오류가 발생했습니다.'
      });
    }
  }

  // 로그인
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: '이메일과 비밀번호를 입력해주세요.'
        });
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const token = await user.getIdToken();

      // 사용자 정보 조회
      const userSnapshot = await get(ref(db, `users/${user.uid}/profile`));
      const userData = userSnapshot.val();

      if (!userData) {
        return res.status(404).json({
          error: '사용자 정보를 찾을 수 없습니다.'
        });
      }

      // 마지막 로그인 시간 업데이트
      await set(ref(db, `users/${user.uid}/profile/lastLogin`), Date.now());

      res.json({
        message: '로그인이 완료되었습니다.',
        user: {
          id: user.uid,
          name: userData.name,
          email: userData.email,
          token
        }
      });

    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'auth/invalid-email': '유효하지 않은 이메일입니다.',
        'auth/user-disabled': '비활성화된 계정입니다.',
        'auth/user-not-found': '존재하지 않는 계정입니다.',
        'auth/wrong-password': '잘못된 비밀번호입니다.'
      };

      res.status(400).json({
        error: errorMessages[error.code] || '로그인 중 오류가 발생했습니다.'
      });
    }
  }

  // 현재 사용자 정보 조회
  async getCurrentUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          error: '인증 토큰이 없습니다.'
        });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      const userSnapshot = await get(ref(db, `users/${decodedToken.uid}/profile`));
      
      if (!userSnapshot.exists()) {
        return res.status(404).json({
          error: '사용자 정보를 찾을 수 없습니다.'
        });
      }

      res.json(userSnapshot.val());

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(401).json({
        error: '인증에 실패했습니다.'
      });
    }
  }

  // 회원 정보 수정
  async updateProfile(req: Request, res: Response) {
    try {
      const { uid } = req.params;
      const updates = req.body;

      // 필수 필드 검증
      const allowedUpdates = ['name', 'photoURL'];
      const isValidOperation = Object.keys(updates).every(
        update => allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).json({
          error: '유효하지 않은 업데이트 필드입니다.'
        });
      }

      const userRef = ref(db, `users/${uid}/profile`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        return res.status(404).json({
          error: '사용자를 찾을 수 없습니다.'
        });
      }

      const userData = userSnapshot.val();
      const updatedData = { ...userData, ...updates };
      await set(userRef, updatedData);

      res.json({
        message: '프로필이 업데이트되었습니다.',
        user: updatedData
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        error: '프로필 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 회원 탈퇴
  async deleteAccount(req: Request, res: Response) {
    try {
      const { uid } = req.params;

      // Realtime Database에서 사용자 정보 삭제
      await set(ref(db, `users/${uid}`), null);
      
      // Authentication에서 사용자 삭제
      await auth.deleteUser(uid);

      res.json({
        message: '계정이 삭제되었습니다.'
      });

    } catch (error) {
      console.error('Delete account error:', error);
      res.status(400).json({
        error: '계정 삭제 중 오류가 발생했습니다.'
      });
    }
  }
}

export default new UserController();