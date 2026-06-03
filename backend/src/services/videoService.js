import { validateVideoUrl } from '../utils/platformDetector.js';
import { checkYtDlp, runYtDlp, spawnYtDlp } from '../utils/ytdlpRunner.js';
import {
  extractInstagramThumbnail,
  buildInstagramFormats,
  buildThumbnailProxyUrl,
  streamInstagramDownload,
} from './instagramService.js';

const PREFERRED_HEIGHTS = [1080, 720, 480, 360];

export { checkYtDlp };

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

function formatFileSize(bytes) {
  if (!bytes || Number(bytes) <= 0) return 'Size may vary';
  const mb = Number(bytes) / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.max(1, Math.round(mb))} MB`;
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

function formatHasAudio(format) {
  return format.acodec && format.acodec !== 'none';
}

function pickBestFormat(formats, height) {
  return formats
    .filter((f) => f.height === height)
    .sort((a, b) => (b.filesize || b.filesize_approx || 0) - (a.filesize || a.filesize_approx || 0))[0];
}

function extractFormatList(info, sourceUrl, platform) {
  const raw = info.formats || [];
  const output = [];
  const usedHeights = new Set();

  const progressive = raw.filter(
    (f) =>
      f.url &&
      f.vcodec &&
      f.vcodec !== 'none' &&
      formatHasAudio(f) &&
      (f.ext === 'mp4' || f.ext === 'webm') &&
      f.height,
  );

  const videoOnly = raw.filter(
    (f) =>
      f.url &&
      f.vcodec &&
      f.vcodec !== 'none' &&
      (!f.acodec || f.acodec === 'none') &&
      f.ext === 'mp4' &&
      f.height,
  );

  const bestAudio =
    raw
      .filter((f) => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none'))
      .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0] || null;

  const mapEntry = (chosen, qualityLabel) => {
    const hasAudio = formatHasAudio(chosen);
    const needsMerge =
      !hasAudio && chosen.format_id && bestAudio
        ? `${chosen.format_id}+${bestAudio.format_id}`
        : null;
    const formatId = needsMerge || String(chosen.format_id);

    return {
      quality: qualityLabel,
      format: chosen.ext === 'webm' ? 'webm' : 'mp4',
      size: formatFileSize(chosen.filesize || chosen.filesize_approx),
      formatId,
      audioIncluded: hasAudio || Boolean(needsMerge),
      needsMerge: Boolean(needsMerge),
      downloadUrl: buildDownloadPath({
        videoUrl: sourceUrl,
        formatId,
        title: info.title,
        ext: chosen.ext || 'mp4',
        platform,
        needsMerge: Boolean(needsMerge),
      }),
    };
  };

  for (const height of PREFERRED_HEIGHTS) {
    let chosen = pickBestFormat(progressive, height);

    if (!chosen) {
      const video = pickBestFormat(videoOnly, height);
      if (video && bestAudio) {
        chosen = { ...video, format_id: `${video.format_id}+${bestAudio.format_id}`, ext: 'mp4' };
      } else if (video) {
        chosen = video;
      }
    }

    if (chosen && !usedHeights.has(height)) {
      usedHeights.add(height);
      output.push(mapEntry(chosen, `${height}p`));
    }
  }

  if (output.length === 0) {
    const fallback =
      progressive.sort((a, b) => (b.height || 0) - (a.height || 0))[0] ||
      videoOnly.sort((a, b) => (b.height || 0) - (a.height || 0))[0];

    if (fallback) {
      const quality = fallback.height ? `${fallback.height}p` : 'Best';
      let formatId = String(fallback.format_id);
      const audioIncluded = formatHasAudio(fallback);
      if (!audioIncluded && bestAudio) {
        formatId = `${fallback.format_id}+${bestAudio.format_id}`;
      }
      output.push({
        quality,
        format: fallback.ext === 'webm' ? 'webm' : 'mp4',
        size: formatFileSize(fallback.filesize || fallback.filesize_approx),
        formatId,
        audioIncluded: audioIncluded || Boolean(bestAudio),
        needsMerge: !audioIncluded && Boolean(bestAudio),
        downloadUrl: buildDownloadPath({
          videoUrl: sourceUrl,
          formatId,
          title: info.title,
          ext: fallback.ext || 'mp4',
          platform,
          needsMerge: !audioIncluded && Boolean(bestAudio),
        }),
      });
    } else if (info.url) {
      output.push({
        quality: 'Best',
        format: 'mp4',
        size: formatFileSize(info.filesize || info.filesize_approx),
        formatId: 'best',
        audioIncluded: true,
        needsMerge: false,
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

  return output.map((f) => ({
    ...f,
    audioNote: f.audioIncluded ? undefined : 'Audio not available for this video.',
  }));
}

export async function fetchVideoInfo(url) {
  const validation = validateVideoUrl(url);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  const available = await checkYtDlp();
  if (!available) {
    return {
      success: false,
      message: 'Video extractor is not configured. Please install yt-dlp on the server.',
    };
  }

  try {
    const stdout = await runYtDlp(['-J', '--no-playlist', '--no-warnings', validation.url]);
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
        message: 'No downloadable format found for this video.',
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

    if (process.env.NODE_ENV !== 'production') {
      console.error('[videoService]', err.message);
    }

    return {
      success: false,
      message: 'Unable to fetch video details. Please try another public video link.',
    };
  }
}

export function sanitizeFilename(name) {
  return (name || 'video')
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'video';
}

export async function streamVideoDownload(videoUrl, formatId, title, ext, res, options = {}) {
  const { platform, needsMerge } = options;

  const useInstagramMerge =
    platform === 'instagram' &&
    (needsMerge ||
      String(formatId).includes('+') ||
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

  const mergeFormat =
    formatId.includes('+') ? formatId : formatId;

  const args = [
    '-f',
    mergeFormat,
    '--merge-output-format',
    'mp4',
    '--no-playlist',
    '--no-warnings',
    '-o',
    '-',
    videoUrl,
  ];

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
        message: 'Unable to fetch video details. Please try another public video link.',
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
          message: 'Unable to fetch video details. Please try another public video link.',
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
