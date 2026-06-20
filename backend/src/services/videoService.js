import { validateVideoUrl } from '../utils/platformDetector.js';
import { getVideoProvider } from '../utils/videoProvider.js';
import { fetchVideoInfoFromRapidApi } from './rapidApiAllInOneService.js';
import {
  checkYtDlp,
  runYtDlpWithYoutubeFallback,
  spawnYtDlp,
  buildDownloadArgs,
  isYoutubeBotError,
} from '../utils/ytdlpRunner.js';
import {
  extractInstagramThumbnail,
  buildInstagramFormats,
  buildThumbnailProxyUrl,
  streamInstagramDownload,
} from './instagramService.js';
import {
  buildPublicFormat,
  pickBestAudioStream,
  pickBestFormatAtHeight,
  pickBestVideoOnlyStream,
  pickProgressiveStreams,
  formatFileSize,
} from '../utils/formatHelpers.js';
import { checkFfmpeg } from './ffmpegService.js';

const PREFERRED_HEIGHTS = [1080, 720, 480, 360];

export { checkYtDlp, getVideoProvider };

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '';
  const total = Math.floor(Number(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function buildDownloadPath({
  videoUrl,
  formatId,
  title,
  ext,
  platform = '',
  needsMerge = false,
}) {
  const params = new URLSearchParams({
    url: videoUrl,
    format: String(formatId),
    title: title || 'video',
    ext: ext || 'mp4',
  });
  if (platform) params.set('platform', platform);
  if (needsMerge) params.set('merge', '1');
  return `/api/download?${params.toString()}`;
}

function extractThumbnail(info, platform) {
  if (platform === 'instagram') {
    return extractInstagramThumbnail(info);
  }

  const sorted = [...(info.thumbnails || [])]
    .sort((a, b) => (b.width || 0) - (a.width || 0))
    .map((t) => t.url)
    .filter(isHttpUrl);

  const candidates = [info.thumbnail, ...sorted].filter(isHttpUrl);
  return candidates[0] || null;
}

function extractFormatList(info, sourceUrl, platform) {
  const raw = info.formats || [];
  const output = [];
  const usedKeys = new Set();

  const progressive = pickProgressiveStreams(raw);
  const videoOnly = pickBestVideoOnlyStream(raw);
  const bestAudio = pickBestAudioStream(raw);

  const addEntry = (entry) => {
    const key = `${entry.quality}:${entry.formatId}`;
    if (usedKeys.has(key)) return;
    usedKeys.add(key);
    output.push(entry);
  };

  for (const height of PREFERRED_HEIGHTS) {
    const progressiveMatch = pickBestFormatAtHeight(progressive, height);
    if (progressiveMatch) {
      addEntry(
        buildPublicFormat({
          quality: `${height}p`,
          videoFormat: progressiveMatch,
          formatId: progressiveMatch.format_id,
          sourceUrl,
          title: info.title,
          platform,
          buildDownloadPath,
        }),
      );
      continue;
    }

    const videoMatch = pickBestFormatAtHeight(videoOnly, height);
    if (videoMatch && bestAudio) {
      addEntry(
        buildPublicFormat({
          quality: `${height}p`,
          videoFormat: videoMatch,
          audioFormat: bestAudio,
          needsMerge: true,
          formatId: `${videoMatch.format_id}+${bestAudio.format_id}`,
          sourceUrl,
          title: info.title,
          platform,
          buildDownloadPath,
        }),
      );
      continue;
    }

    if (videoMatch) {
      addEntry(
        buildPublicFormat({
          quality: `${height}p`,
          videoFormat: videoMatch,
          formatId: videoMatch.format_id,
          sourceUrl,
          title: info.title,
          platform,
          buildDownloadPath,
        }),
      );
    }
  }

  if (output.length === 0) {
    const fallbackProgressive = progressive.sort((a, b) => (b.height || 0) - (a.height || 0))[0];
    const fallbackVideo = videoOnly[0];

    if (fallbackProgressive) {
      addEntry(
        buildPublicFormat({
          quality: fallbackProgressive.height ? `${fallbackProgressive.height}p` : 'Best',
          videoFormat: fallbackProgressive,
          formatId: fallbackProgressive.format_id,
          sourceUrl,
          title: info.title,
          platform,
          buildDownloadPath,
        }),
      );
    } else if (fallbackVideo && bestAudio) {
      addEntry(
        buildPublicFormat({
          quality: fallbackVideo.height ? `${fallbackVideo.height}p` : 'Best',
          videoFormat: fallbackVideo,
          audioFormat: bestAudio,
          needsMerge: true,
          formatId: `${fallbackVideo.format_id}+${bestAudio.format_id}`,
          sourceUrl,
          title: info.title,
          platform,
          buildDownloadPath,
        }),
      );
    } else if (fallbackVideo) {
      addEntry(
        buildPublicFormat({
          quality: fallbackVideo.height ? `${fallbackVideo.height}p` : 'Best',
          videoFormat: fallbackVideo,
          formatId: fallbackVideo.format_id,
          sourceUrl,
          title: info.title,
          platform,
          buildDownloadPath,
        }),
      );
    } else if (info.url) {
      addEntry({
        quality: 'Best',
        format: 'mp4',
        extension: 'mp4',
        size: formatFileSize(info.filesize || info.filesize_approx),
        filesize: info.filesize || info.filesize_approx || null,
        videoCodec: null,
        audioCodec: null,
        hasVideo: true,
        hasAudio: true,
        isProgressive: true,
        needsMerge: false,
        audioMergeSupported: false,
        formatId: 'best',
        audioIncluded: true,
        downloadUrl: buildDownloadPath({
          videoUrl: sourceUrl,
          formatId: 'best',
          title: info.title,
          ext: 'mp4',
          platform,
        }),
      });
    }
  }

  return output;
}

async function fetchVideoInfoYtDlp(url) {
  const validation = validateVideoUrl(url);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  const available = await checkYtDlp();
  if (!available) {
    return {
      success: false,
      statusCode: 503,
      message: 'Video extractor is not configured. Please install yt-dlp on the server.',
    };
  }

  try {
    const stdout = await runYtDlpWithYoutubeFallback(validation.url, validation.platform);
    const info = JSON.parse(stdout);

    if (info.is_live) {
      return {
        success: false,
        message: 'Unable to fetch video details. Please try another public video link.',
      };
    }

    const platform = validation.platform;
    const thumbnail = extractThumbnail(info, platform);
    const thumbnailDisplay =
      platform === 'instagram' && thumbnail
        ? buildThumbnailProxyUrl(thumbnail, validation.url)
        : thumbnail;

    const formats =
      platform === 'instagram'
        ? buildInstagramFormats(info, validation.url, buildDownloadPath)
        : extractFormatList(info, validation.url, platform);

    if (formats.length === 0) {
      return {
        success: false,
        message: 'No downloadable video link found. Please try another public video link.',
      };
    }

    return {
      success: true,
      platform,
      title: info.title || 'Untitled video',
      thumbnail: thumbnail || '',
      thumbnailDisplay: thumbnailDisplay || thumbnail || '',
      duration: formatDuration(info.duration),
      formats,
    };
  } catch (err) {
    const msg = (err.message || '').toLowerCase();
    if (
      msg.includes('private') ||
      msg.includes('sign in') ||
      msg.includes('login') ||
      msg.includes('unavailable') ||
      msg.includes('age-restricted') ||
      msg.includes('drm')
    ) {
      return {
        success: false,
        message: 'Unable to fetch video details. Please try another public video link.',
      };
    }

    if (validation.platform === 'youtube' && isYoutubeBotError(err.message)) {
      return {
        success: false,
        message:
          'YouTube could not be accessed from this server right now. Please try TikTok, Instagram, or Facebook, or try again later.',
      };
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error('[videoService]', err.message);
    }

    return {
      success: false,
      message: 'Unable to fetch video details. Please try another public video link.',
    };
  }
}

export async function fetchVideoInfo(url) {
  const validation = validateVideoUrl(url);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  if (getVideoProvider() === 'rapidapi_all_in_one') {
    const result = await fetchVideoInfoFromRapidApi(validation);
    if (!result.success) {
      console.error('[videoService] RapidAPI video info failed:', {
        url: validation.url,
        platform: validation.platform,
        message: result.message,
        statusCode: result.statusCode,
      });
    }
    return result;
  }

  return fetchVideoInfoYtDlp(url);
}

export function sanitizeFilename(name) {
  return (name || 'video')
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'video';
}

export async function streamDirectDownload(sourceUrl, title, ext, res) {
  const safeName = sanitizeFilename(title);
  const extension = ext || 'mp4';
  const contentType =
    extension === 'mp4'
      ? 'video/mp4'
      : extension === 'webm'
        ? 'video/webm'
        : 'application/octet-stream';

  const upstream = await fetch(sourceUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: '*/*',
    },
    signal: AbortSignal.timeout(120000),
  });

  if (!upstream.ok) {
    throw new Error(`Direct download failed: ${upstream.status}`);
  }

  res.setHeader('Content-Type', upstream.headers.get('content-type') || contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}.${extension}"`);

  const reader = upstream.body?.getReader?.();
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
    return;
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  res.send(buffer);
}

export async function streamVideoDownload(videoUrl, formatId, title, ext, res, options = {}) {
  const { platform, needsMerge, directUrl } = options;
  const requiresMerge = needsMerge || String(formatId || '').includes('+');

  if (directUrl && isHttpUrl(directUrl)) {
    try {
      await streamDirectDownload(directUrl, title, ext, res);
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

  const useInstagramMerge =
    platform === 'instagram' &&
    (requiresMerge ||
      String(formatId).includes('best'));

  if (useInstagramMerge) {
    try {
      await streamInstagramDownload(videoUrl, formatId, title, res);
      return;
    } catch (err) {
      if (res.headersSent) {
        res.end();
        return;
      }
      return res.status(500).json({
        success: false,
        message: err.message?.includes('audio')
          ? 'Unable to prepare video with audio. Please try again.'
          : 'Unable to fetch video details. Please try another public video link.',
      });
    }
  }

  if (requiresMerge) {
    const ffmpegOk = await checkFfmpeg();
    if (!ffmpegOk) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[videoService] FFmpeg unavailable for audio merge', {
          platform,
          formatId,
        });
      }
      if (!res.headersSent) {
        return res.status(503).json({
          success: false,
          message:
            'Audio merging is unavailable on the server. Please choose a lower quality format that includes audio.',
        });
      }
      return;
    }
  }

  const safeName = sanitizeFilename(title);
  const extension = ext || 'mp4';
  const contentType =
    extension === 'mp4'
      ? 'video/mp4'
      : extension === 'webm'
        ? 'video/webm'
        : extension === 'm4a'
          ? 'audio/mp4'
          : 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}.${extension}"`);

  const mergeFormat = String(formatId).includes('+')
    ? formatId
    : requiresMerge
      ? formatId
      : formatId;
  const args = buildDownloadArgs(mergeFormat, videoUrl, platform || '');
  const proc = spawnYtDlp(args);
  proc.stdout.pipe(res);

  proc.stderr.on('data', (chunk) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[yt-dlp stream]', chunk.toString().slice(0, 200));
    }
  });

  proc.on('error', () => {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: requiresMerge
          ? 'Unable to merge video and audio. Please try a format that includes audio.'
          : 'Unable to fetch video details. Please try another public video link.',
      });
    } else {
      res.end();
    }
  });

  proc.on('close', (code) => {
    if (code !== 0 && !res.writableEnded) {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: requiresMerge
            ? 'Unable to merge video and audio. Please try a format that includes audio.'
            : 'Unable to fetch video details. Please try another public video link.',
        });
      } else {
        res.end();
      }
    }
  });

  res.on('close', () => {
    if (!proc.killed) proc.kill();
  });
}

export async function fetchThumbnailProxy(sourceUrl, videoUrl) {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: 'https://www.instagram.com/',
      Accept: 'image/*,*/*',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Thumbnail fetch failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'image/jpeg';

  if (process.env.NODE_ENV !== 'production') {
    console.log('[thumbnail] proxied', videoUrl.slice(0, 60), contentType);
  }

  return { buffer, contentType };
}
