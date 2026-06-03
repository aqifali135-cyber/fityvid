import { Router } from 'express';
import { generateHashtagHandler } from '../controllers/hashtagController.js';

const router = Router();

router.post('/generate', generateHashtagHandler);

export default router;
