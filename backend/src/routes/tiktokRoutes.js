import { Router } from 'express';
import { tiktokVideoDownload } from '../controllers/tiktokController.js';

const router = Router();

router.get('/ping', (_req, res) => {
  res.json({
    success: true,
    route: 'POST /api/tiktok/video-download',
  });
});

router.post('/video-download', tiktokVideoDownload);

export default router;
