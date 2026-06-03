import { Router } from 'express';
import { getVideoInfo, downloadVideo, proxyThumbnail } from '../controllers/videoController.js';

const router = Router();

router.post('/info', getVideoInfo);
router.get('/thumbnail', proxyThumbnail);
router.get('/download', downloadVideo);

export default router;
