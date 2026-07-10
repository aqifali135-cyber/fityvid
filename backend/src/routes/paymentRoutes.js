import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createCheckout } from '../controllers/paymentController.js';

const router = Router();

// Temporary debug endpoint to confirm payment routes are mounted.
router.get('/ping', (_req, res) => {
  console.log('[payments] ping hit');
  return res.json({
    success: true,
    message: 'Payment routes are registered.',
    routes: ['POST /api/payments/create-checkout', 'POST /api/payments/lemon-webhook'],
  });
});

router.post('/create-checkout', (req, res, next) => {
  console.log('[payments] create-checkout hit', {
    hasAuth: Boolean(req.headers.authorization),
    packageKey: req.body?.packageKey,
  });
  return next();
}, requireAuth, createCheckout);

export default router;
