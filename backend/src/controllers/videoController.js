import { validateVideoUrl, PLATFORMS } from '../utils/platformDetector.js';
import { isRapidApiProvider } from '../utils/videoProvider.js';
import {
  fetchVideoInfo,
  streamVideoDownload,
  checkYtDlp,
  fetchThumbnailProxy,
} from '../services/videoService.js';

function resolveStatus(result) {
  if (result.statusCode) return result.statusCode;
  if (result.message?.includes('not configured')) return 503;
  if (result.message?.includes('rate limit')) return 429;
  return 400;
}

export async function getVideoInfo(req, res) {
  const { url, platform: clientPlatform } = req.body || {};

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a video URL.',
    });
  }

  const validation = validateVideoUrl(url);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message,
    });
  }

  if (clientPlatform) {
    const normalized = String(clientPlatform).toLowerCase();
    if (!PLATFORMS.includes(normalized)) {
      return res.status(400).json({
        success: false,
        message: 'FityVid supports YouTube, TikTok, Instagram, and Facebook links only.',
      });
    }
    if (normalized !== validation.platform) {
      return res.status(400).json({
        success: false,
        message: 'Platform does not match the video URL.',
      });
    }
  }

  const result = await fetchVideoInfo(url);

  if (!result.success) {
    return res.status(resolveStatus(result)).json(result);
  }

  return res.json(result);
}

export async function proxyThumbnail(req, res) {
  const source = req.query.source;
  const video = req.query.video;

  if (!source || !video) {
    return res.status(400).send('Bad request');
  }

  const validation = validateVideoUrl(String(video));
  if (!validation.valid || validation.platform !== 'instagram') {
    return res.status(400).send('Invalid request');
  }

  try {
    const { buffer, contentType } = await fetchThumbnailProxy(String(source), validation.url);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(buffer);
  } catch {
    return res.status(404).send('Thumbnail not available');
  }
}

export async function downloadVideo(req, res) {
  const videoUrl = req.query.url;
  const formatId = req.query.format;
  const title = req.query.title;
  const ext = req.query.ext || 'mp4';
  const platform = (req.query.platform || '').toLowerCase();
  const needsMerge = req.query.merge === '1' || String(formatId || '').includes('+');
  const directUrl = req.query.direct;

  if (!videoUrl && !directUrl) {
    return res.status(400).json({
      success: false,
      message: 'Unable to fetch video details. Please try another public video link.',
    });
  }

  if (directUrl) {
    try {
      await streamVideoDownload('', 'direct', String(title || 'video'), String(ext), res, {
        directUrl: String(directUrl),
      });
      return;
    } catch {
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Unable to download this video link. Please try another format.',
        });
      }
      return;
    }
  }

  if (!formatId) {
    return res.status(400).json({
      success: false,
      message: 'Unable to fetch video details. Please try another public video link.',
    });
  }

  const validation = validateVideoUrl(String(videoUrl));
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message,
    });
  }

  if (isRapidApiProvider() && String(formatId).startsWith('rapidapi-')) {
    return res.status(400).json({
      success: false,
      message: 'Use the direct download link returned by the video info API.',
    });
  }

  const available = await checkYtDlp();
  if (!available) {
    return res.status(503).json({
      success: false,
      message: 'Video extractor is not configured. Please install yt-dlp on the server.',
    });
  }

  const effectivePlatform = platform || validation.platform;

  try {
    await streamVideoDownload(
      validation.url,
      String(formatId),
      String(title || 'video'),
      String(ext),
      res,
      {
        platform: effectivePlatform,
        needsMerge,
      },
    );
  } catch {
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Unable to prepare video with audio. Please try again.',
      });
    }
  }
}
