import {
  validateTiktokDownloadUrl,
  fetchTiktokVideoDownload,
} from '../services/tiktokDownloaderService.js';

function resolveStatus(result) {
  if (result.statusCode) return result.statusCode;
  if (result.message?.includes('not configured')) return 503;
  if (result.message?.includes('rate limit')) return 429;
  if (result.message?.includes('timed out')) return 504;
  return 400;
}

/**
 * POST /api/tiktok/video-download
 * Body: { url: string }
 */
export async function tiktokVideoDownload(req, res) {
  const { url } = req.body || {};

  const validation = validateTiktokDownloadUrl(url);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message,
    });
  }

  try {
    const result = await fetchTiktokVideoDownload(validation.url);

    if (!result.success) {
      return res.status(resolveStatus(result)).json({
        success: false,
        message: result.message || 'Unable to fetch this TikTok video.',
      });
    }

    return res.json({
      success: true,
      data: {
        title: result.data.title || '',
        thumbnail: result.data.thumbnail || '',
        videoUrl: result.data.videoUrl || '',
        audioUrl: result.data.audioUrl || '',
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[tiktok] video-download error:', String(err?.message || err).slice(0, 200));
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while processing the TikTok video. Please try again.',
    });
  }
}
