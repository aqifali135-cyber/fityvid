import { validateDownloadUrl } from '../utils/validation.js';
import { checkYtDlp, getYtDlpVersion } from '../utils/ytdlpRunner.js';

export function validateUrlHandler(req, res) {
  const { url } = req.body || {};
  const result = validateDownloadUrl(url);

  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }

  return res.json({
    success: true,
    platform: result.platform,
    url: result.url,
    message:
      'URL recognized. Please download only your own content or content you have permission to use. Only publicly accessible videos are supported.',
    notice:
      'FityVid does not support private videos and does not bypass platform restrictions.',
  });
}

export async function healthHandler(_req, res) {
  const ytDlpReady = await checkYtDlp();
  res.json({
    success: true,
    service: 'FityVid API',
    platforms: ['youtube', 'facebook', 'tiktok', 'instagram'],
    ytDlp: {
      ready: ytDlpReady,
      version: getYtDlpVersion() || null,
    },
  });
}
