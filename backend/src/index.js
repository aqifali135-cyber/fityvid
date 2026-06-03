import express from 'express';
import cors from 'cors';
import hashtagRoutes from './routes/hashtagRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import { healthHandler } from './controllers/downloadController.js';
import { downloadVideo } from './controllers/videoController.js';
import { videoInfoLimiter, downloadLimiter } from './middleware/rateLimit.js';
import { checkYtDlp, getYtDlpVersion } from './utils/ytdlpRunner.js';
import { getVideoProvider } from './utils/videoProvider.js';
import { isRapidApiConfigured } from './services/rapidApiAllInOneService.js';

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', healthHandler);
app.use('/api/hashtags', hashtagRoutes);
app.use('/api/video', videoInfoLimiter, videoRoutes);
app.get('/api/download', downloadLimiter, downloadVideo);

app.use((err, _req, res, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(500).json({
    success: false,
    message: 'Unable to fetch video details. Please try another public video link.',
  });
});

app.listen(PORT, async () => {
  const provider = getVideoProvider();
  console.log(`FityVid API running on http://localhost:${PORT}`);
  console.log(`Video provider: ${provider}`);

  if (provider === 'rapidapi_all_in_one') {
    console.log(`RapidAPI configured: ${isRapidApiConfigured() ? 'yes' : 'no (set RAPIDAPI_KEY)'}`);
  }

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
});
