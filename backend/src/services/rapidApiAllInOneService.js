import { isSupportedPlatform, normalizePlatformSource } from '../utils/videoProvider.js';

const DEFAULT_BASE = 'https://social-download-all-in-one.p.rapidapi.com';
const DEFAULT_HOST = 'social-download-all-in-one.p.rapidapi.com';

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function formatDuration(raw) {
  if (raw === null || raw === undefined || raw === '') return '';
  let total = Number(raw);
  if (!Number.isFinite(total) || total <= 0) return '';

  if (total > 86400) {
    total = Math.floor(total / 1000);
  }

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);

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

function qualityLabel(raw) {
  if (!raw) return 'Available';
  const q = String(raw).toLowerCase().replace(/_/g, ' ');
  if (q.includes('hd') && q.includes('watermark')) return 'HD No Watermark';
  if (q.includes('no watermark') || q === 'no watermark') return 'No Watermark';
  if (q.includes('watermark') && !q.includes('no')) return 'Watermarked';
  if (q === 'hd' || q.includes('hd')) return 'HD';
  if (q === 'sd' || q.includes('sd')) return 'SD';
  if (q.includes('1080')) return '1080p';
  if (q.includes('720')) return '720p';
  if (q.includes('480')) return '480p';
  if (q.includes('360')) return '360p';
  if (q.includes('240')) return '240p';
  return q.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Available';
}

function inferFormat(ext, url) {
  if (ext) return String(ext).toLowerCase().replace(/^\./, '');
  const match = String(url || '').match(/\.([a-z0-9]{2,4})(?:\?|$)/i);
  return match ? match[1].toLowerCase() : 'mp4';
}

function isVideoEntry(type, extension, url) {
  const t = String(type || '').toLowerCase();
  const ext = inferFormat(extension, url);
  if (t === 'audio' || ext === 'mp3' || ext === 'm4a') return false;
  if (t === 'image' || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return false;
  return true;
}

function pushFormat(formats, seen, entry) {
  const url = entry.url;
  if (!isHttpUrl(url) || seen.has(url)) return;
  seen.add(url);

  formats.push({
    quality: entry.quality || 'Available',
    format: inferFormat(entry.extension, url),
    size: entry.size || 'Size may vary',
    formatId: `rapidapi-${formats.length}`,
    audioIncluded: entry.audioIncluded ?? null,
    downloadUrl: url,
  });
}

function collectFromMedias(payload, formats, seen) {
  const medias = payload.medias || payload.media;
  if (!Array.isArray(medias)) return;

  for (const item of medias) {
    if (!item || typeof item !== 'object') continue;
    const url = item.url || item.download_url || item.downloadUrl || item.link;
    if (!isVideoEntry(item.type, item.extension || item.ext, url)) continue;

    pushFormat(formats, seen, {
      url,
      quality: qualityLabel(item.quality || item.label || item.resolution),
      extension: item.extension || item.ext,
      size: formatFileSize(item.size || item.filesize || item.file_size),
      audioIncluded:
        item.audioIncluded ??
        (item.type === 'video' && item.acodec ? item.acodec !== 'none' : null),
    });
  }
}

function collectFromNamedFields(payload, formats, seen) {
  const pairs = [
    ['video_hd', 'HD'],
    ['hd', 'HD'],
    ['video', 'Available'],
    ['video_url', 'Available'],
    ['download', 'Available'],
    ['download_url', 'Available'],
    ['no_watermark', 'No Watermark'],
    ['video_no_watermark', 'No Watermark'],
    ['sd', 'SD'],
    ['watermark', 'Watermarked'],
  ];

  for (const [field, label] of pairs) {
    const value = payload[field];
    if (isHttpUrl(value)) {
      pushFormat(formats, seen, {
        url: value,
        quality: label,
        extension: inferFormat(null, value),
        size: 'Size may vary',
        audioIncluded: null,
      });
    }
  }

  const links = payload.links;
  if (links && typeof links === 'object' && !Array.isArray(links)) {
    for (const [key, value] of Object.entries(links)) {
      if (!isHttpUrl(value)) continue;
      pushFormat(formats, seen, {
        url: value,
        quality: qualityLabel(key),
        extension: inferFormat(null, value),
        size: 'Size may vary',
        audioIncluded: null,
      });
    }
  }
}

function unwrapPayload(raw) {
  if (Array.isArray(raw)) {
    return raw.find((item) => item && typeof item === 'object') || null;
  }
  if (!raw || typeof raw !== 'object') return null;
  if (raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    return { ...raw, ...raw.data, source: raw.source || raw.platform || raw.data.source };
  }
  return raw;
}

function extractFormats(payload) {
  const formats = [];
  const seen = new Set();
  collectFromMedias(payload, formats, seen);
  collectFromNamedFields(payload, formats, seen);

  if (isHttpUrl(payload.url) && formats.length === 0) {
    const looksLikeFile =
      /\.(mp4|webm|mov|m4v)(\?|$)/i.test(payload.url) ||
      String(payload.type || '').toLowerCase() === 'video';
    if (looksLikeFile) {
      pushFormat(formats, seen, {
        url: payload.url,
        quality: 'Available',
        extension: inferFormat(null, payload.url),
        size: 'Size may vary',
        audioIncluded: null,
      });
    }
  }

  return formats;
}

function mapApiError(status, bodyText, parsed) {
  const text = `${bodyText || ''} ${JSON.stringify(parsed || {})}`.toLowerCase();

  if (status === 429 || text.includes('rate limit') || text.includes('quota')) {
    return {
      success: false,
      statusCode: 429,
      message: 'Video API rate limit exceeded. Please try again later.',
    };
  }

  if (
    status === 401 ||
    status === 403 ||
    text.includes('invalid api key') ||
    text.includes('unauthorized')
  ) {
    return {
      success: false,
      statusCode: 503,
      message: 'Video API is not configured correctly on the server.',
    };
  }

  if (
    text.includes('private') ||
    text.includes('not found') ||
    text.includes('unavailable') ||
    text.includes('removed') ||
    text.includes('login') ||
    text.includes('403 forbidden')
  ) {
    return {
      success: false,
      statusCode: 400,
      message: 'Unable to fetch video details. Please try another public video link.',
    };
  }

  if (status >= 500) {
    return {
      success: false,
      statusCode: 502,
      message: 'Video provider is temporarily unavailable. Please try again later.',
    };
  }

  return {
    success: false,
    statusCode: 400,
    message: 'Unable to fetch video details. Please try another public video link.',
  };
}

export function normalizeRapidApiResponse(raw, validation) {
  const payload = unwrapPayload(raw);
  if (!payload) {
    return {
      success: false,
      statusCode: 502,
      message: 'Video provider returned an invalid response.',
    };
  }

  if (payload.error === true || payload.success === false) {
    return mapApiError(400, payload.message || payload.error_message || '', payload);
  }

  const source = normalizePlatformSource(payload.source || payload.platform);
  if (!isSupportedPlatform(source)) {
    return {
      success: false,
      statusCode: 400,
      message: 'FityVid supports YouTube, TikTok, Instagram, and Facebook links only.',
    };
  }

  if (validation.platform && source !== validation.platform) {
    return {
      success: false,
      statusCode: 400,
      message: 'Platform does not match the video URL.',
    };
  }

  const formats = extractFormats(payload);
  if (formats.length === 0) {
    return {
      success: false,
      statusCode: 400,
      message: 'No downloadable video link found. Please try another public video link.',
    };
  }

  const thumbnail =
    payload.thumbnail ||
    payload.thumb ||
    payload.cover ||
    payload.image ||
    '';

  return {
    success: true,
    platform: source,
    title: payload.title || payload.caption || 'Untitled video',
    thumbnail,
    thumbnailDisplay: thumbnail,
    duration: formatDuration(payload.duration),
    author: payload.author || payload.unique_id || payload.username || '',
    formats,
  };
}

export async function fetchVideoInfoFromRapidApi(validation) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return {
      success: false,
      statusCode: 503,
      message: 'Video API is not configured. Please set RAPIDAPI_KEY on the server.',
    };
  }

  const baseUrl = (process.env.RAPIDAPI_ALL_BASE_URL || DEFAULT_BASE).replace(/\/$/, '');
  const host = process.env.RAPIDAPI_ALL_HOST || DEFAULT_HOST;

  let response;
  try {
    response = await fetch(`${baseUrl}/v1/social/autolink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': host,
      },
      body: JSON.stringify({ url: validation.url }),
      signal: AbortSignal.timeout(60000),
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[rapidapi]', err.message);
    }
    return {
      success: false,
      statusCode: 502,
      message: 'Video provider is temporarily unavailable. Please try again later.',
    };
  }

  const bodyText = await response.text();
  let parsed;
  try {
    parsed = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    return mapApiError(response.status, bodyText, null);
  }

  if (!response.ok) {
    return mapApiError(response.status, bodyText, parsed);
  }

  return normalizeRapidApiResponse(parsed, validation);
}

export function isRapidApiConfigured() {
  return Boolean(process.env.RAPIDAPI_KEY);
}
