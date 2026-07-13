import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import hashtagRoutes from './routes/hashtagRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import tiktokRoutes from './routes/tiktokRoutes.js';
import authRoutes from './routes/authRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { lemonWebhook } from './controllers/paymentController.js';
import { healthHandler } from './controllers/downloadController.js';
import { downloadVideo } from './controllers/videoController.js';
import { tiktokVideoDownload } from './controllers/tiktokController.js';
import { videoInfoLimiter, downloadLimiter } from './middleware/rateLimit.js';
import { checkYtDlp, getYtDlpVersion } from './utils/ytdlpRunner.js';
import { checkFfmpeg, getFfmpegVersionShort } from './services/ffmpegService.js';
import { getVideoProvider } from './utils/videoProvider.js';
import { isRapidApiConfigured } from './services/rapidApiAllInOneService.js';
import { isTiktokDownloaderConfigured } from './services/tiktokDownloaderService.js';
import { initDatabase } from './services/db.js';

const app = express();
const PORT = process.env.PORT || 8787;

// Required for Namecheap/cPanel proxy.
// Must be before express-rate-limit middleware.
app.set('trust proxy', 1);

app.use(cors());

// Lemon Squeezy webhooks need the raw body for signature verification.
// Must be registered before express.json() and only for this exact path.
app.post(
  '/api/payments/lemon-webhook',
  express.raw({ type: '*/*' }),
  (req, res, next) => {
    console.log('[payments] lemon-webhook hit');
    return lemonWebhook(req, res, next);
  },
);

app.use(express.json({ limit: '32kb' }));

app.get('/api/health', healthHandler);

// Auth / credits / payments before video routes
app.use('/api/auth', authRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/api/hashtags', hashtagRoutes);
app.use('/api/video', videoInfoLimiter, videoRoutes);

// TikTok Video Downloader — exact live route used by the frontend
app.post('/api/tiktok/video-download', videoInfoLimiter, tiktokVideoDownload);
app.use('/api/tiktok', videoInfoLimiter, tiktokRoutes);

app.get('/api/download', downloadLimiter, downloadVideo);

app.use((err, req, res, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[api error]', req.method, req.originalUrl, err.message || err);
  }

  if (res.headersSent) return;

  // Body-parser / JSON parse failures
  if (err?.type === 'entity.parse.failed' || err?.status === 400) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON body.',
    });
  }

  const isVideoRoute =
    req.originalUrl?.startsWith('/api/video') ||
    req.originalUrl?.startsWith('/api/download') ||
    req.originalUrl?.startsWith('/api/tiktok');

  if (isVideoRoute) {
    return res.status(err.status || 500).json({
      success: false,
      message: 'Unable to fetch video details. Please try another public video link.',
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong. Please try again.',
  });
});

app.listen(PORT, async () => {
  const provider = getVideoProvider();
  console.log(`FityVid API running on http://localhost:${PORT}`);
  console.log(`Video provider: ${provider}`);
  console.log('Payment routes: POST /api/payments/create-checkout, POST /api/payments/lemon-webhook');
  console.log('TikTok route: POST /api/tiktok/video-download');

  await initDatabase();

  if (provider === 'rapidapi_all_in_one') {
    console.log(`RapidAPI configured: ${isRapidApiConfigured() ? 'yes' : 'no (set RAPIDAPI_KEY)'}`);
  }

  console.log(
    `TikTok downloader configured: ${isTiktokDownloaderConfigured() ? 'yes' : 'no (set RAPIDAPI_TIKTOK_KEY)'}`,
  );

  const ready = await checkYtDlp();
  if (provider === 'yt-dlp') {
    if (ready) {
      console.log(`yt-dlp version: ${getYtDlpVersion() || 'unknown'}`);
    } else {
      console.warn('WARNING: yt-dlp is not available. Install yt-dlp for local video downloads.');
    }
  } else if (ready) {
    console.log(`yt-dlp fallback available: ${getYtDlpVersion() || 'yes'}`);
  }

  const ffmpegReady = await checkFfmpeg();
  if (ffmpegReady) {
    const version = getFfmpegVersionShort();
    console.log(version ? `FFmpeg: available (${version})` : 'FFmpeg: available');
  } else {
    console.log('FFmpeg: not available');
  }
});
