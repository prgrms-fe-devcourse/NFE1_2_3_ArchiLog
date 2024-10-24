import { Request, Response } from 'express';
import { adminAuth, adminDb } from '../config/firebaseadmin';

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ 
          error: '필수 입력값이 누락되었습니다.' 
        });
      }

      // Admin SDK를 사용하여 사용자 생성
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: name
      });

      // Realtime Database에 사용자 정보 저장
      const userData = {
        userId: userRecord.uid,
        name,
        email,
        createdAt: Date.now()
      };

      await adminDb.ref(`users/${userRecord.uid}/profile`).set(userData);

      // 커스텀 토큰 생성
      const token = await adminAuth.createCustomToken(userRecord.uid);

      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        user: {
          id: userRecord.uid,
          name,
          email,
          token
        }
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'auth/email-already-exists': '이미 사용 중인 이메일입니다.',
        'auth/invalid-email': '유효하지 않은 이메일입니다.',
        'auth/operation-not-allowed': '이메일/비밀번호 회원가입이 비활성화되었습니다.',
        'auth/weak-password': '비밀번호가 너무 약합니다.'
      };

      res.status(400).json({
        error: errorMessages[error.code] || '회원가입 중 오류가 발생했습니다.'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: '이메일과 비밀번호를 입력해주세요.'
        });
      }

      // 사용자 찾기
      const userRecord = await adminAuth.getUserByEmail(email);
      
      // Realtime Database에서 사용자 정보 가져오기
      const userSnapshot = await adminDb.ref(`users/${userRecord.uid}/profile`).get();
      const userData = userSnapshot.val();

      if (!userData) {
        return res.status(404).json({
          error: '사용자 정보를 찾을 수 없습니다.'
        });
      }

      // 커스텀 토큰 생성
      const token = await adminAuth.createCustomToken(userRecord.uid);

      // 마지막 로그인 시간 업데이트
      await adminDb.ref(`users/${userRecord.uid}/profile/lastLogin`).set(Date.now());

      res.json({
        message: '로그인이 완료되었습니다.',
        user: {
          id: userRecord.uid,
          name: userData.name,
          email: userData.email,
          token
        }
      });

    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'auth/user-not-found': '존재하지 않는 계정입니다.',
        'auth/wrong-password': '잘못된 비밀번호입니다.'
      };

      res.status(400).json({
        error: errorMessages[error.code] || '로그인 중 오류가 발생했습니다.'
      });
    }
  }
}

export default new UserController();