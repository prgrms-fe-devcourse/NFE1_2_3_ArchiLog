import { Router } from 'express';
import UserController from './userService';
// import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
// router.get('/me', authMiddleware, UserController.getCurrentUser);
// router.patch('/profile/:uid', authMiddleware, UserController.updateProfile);
// router.delete('/:uid', authMiddleware, UserController.deleteAccount);

export default router;