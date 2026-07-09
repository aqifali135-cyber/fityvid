import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getBalance,
  getTransactions,
  refund,
  spend,
} from '../controllers/creditController.js';

const router = Router();

router.get('/balance', requireAuth, getBalance);
router.get('/transactions', requireAuth, getTransactions);
router.post('/spend', requireAuth, spend);
router.post('/refund', requireAuth, refund);

export default router;
