import { Router } from 'express';
import {
  login,
  logout,
  me,
  requireAuth,
  signup,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.post('/logout', logout);

export default router;
