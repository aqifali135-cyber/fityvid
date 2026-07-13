import { Router } from 'express';
import { tiktokVideoDownload } from '../controllers/tiktokController.js';

const router = Router();

router.post('/video-download', tiktokVideoDownload);

export default router;
