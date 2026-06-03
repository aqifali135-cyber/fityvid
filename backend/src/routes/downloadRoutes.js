import { Router } from 'express';
import { validateUrlHandler } from '../controllers/downloadController.js';

const router = Router();

router.post('/validate', validateUrlHandler);

export default router;
