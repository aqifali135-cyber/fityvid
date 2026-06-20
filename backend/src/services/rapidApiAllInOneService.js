import { isSupportedPlatform, normalizePlatformSource } from '../utils/videoProvider.js';

const DEFAULT_BASE = 'https://social-download-all-in-one.p.rapidapi.com';
const DEFAULT_HOST = 'social-download-all-in-one.p.rapidapi.com';

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

function formatDuration(raw) {
  if (raw === null || raw === undefined || raw === '') return '';
  let total = Number(raw);
  if (!Number.isFinite(total) || total <= 0) return '';

  // Values above 24h in seconds are likely milliseconds (e.g. TikTok).
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

function logMappingFailure(reason, details) {
  const extra =
    typeof details === 'string'
      ? details
      : JSON.stringify(details ?? null).slice(0, 2500);
  console.error('[rapidapi] mapping failed:', reason, extra);
}

function isFailureMessage(message) {
  if (!message || typeof message !== 'string') return false;
  const m = message.toLowerCase().trim();
  if (!m) return false;

  const failureHints = [
    'failed',
    'invalid url',
    'invalid link',
    'not found',
    'not available',
    'unable to',
    'unsupported',
    'denied',
    'forbidden',
    'private video',
    'rate limit',
    'quota exceeded',
  ];

  return failureHints.some((hint) => m.includes(hint));
}

function isProviderError(payload) {
  if (!payload || typeof payload !== 'object') return true;

  if (payload.error === true) return true;

  if (typeof payload.error === 'string' && payload.error.trim().length > 0) {
    return true;
  }

  if (payload.success === false) return true;

  if (isFailureMessage(payload.message) || isFailureMessage(payload.error_message)) {
    return true;
  }

  return false;
}

function unwrapPayload(raw) {
  if (Array.isArray(raw)) {
    return (
      raw.find((item) => item && typeof item === 'object' && (item.medias || item.source)) ||
      raw[0] ||
      null
    );
  }

  if (!raw || typeof raw !== 'object') return null;

  if (Array.isArray(raw.data)) {
    const nested =
      raw.data.find((item) => item && typeof item === 'object' && (item.medias || item.source)) ||
      raw.data[0];
    if (nested) return nested;
  }

  if (raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    return {
      ...raw.data,
      source: raw.data.source || raw.source || raw.platform,
    };
  }

  if (raw.result && typeof raw.result === 'object') {
    return unwrapPayload(raw.result);
  }

  return raw;
}

function inferMediaAudioStatus(item) {
  if (item?.no_audio === true || item?.video_only === true) return false;
  if (item?.has_audio === true || item?.audio === true) return true;
  if (item?.has_audio === false || item?.audio === false) return false;

  const type = String(item?.type || '').toLowerCase();
  if (type === 'video') {
    return true;
  }

  return null;
}

function mediaItemToFormat(item, index) {
  const url = typeof item?.url === 'string' ? item.url.trim() : '';
  if (!isHttpUrl(url)) return null;

  const sizeBytes = item.data_size ?? item.size ?? item.filesize ?? item.file_size;
  const extension = (item.extension || 'mp4').toLowerCase().replace(/^\./, '');
  const audioStatus = inferMediaAudioStatus(item);
  const hasAudio = audioStatus === true;
  const hasVideo = String(item?.type || 'video').toLowerCase() !== 'audio';

  return {
    quality: item.height ? `${item.height}p` : item.quality || 'Available',
    format: extension,
    extension,
    size: sizeBytes ? formatFileSize(sizeBytes) : 'Size may vary',
    filesize: sizeBytes || null,
    videoCodec: item.vcodec || null,
    audioCodec: item.acodec || null,
    hasVideo,
    hasAudio,
    isProgressive: hasVideo && hasAudio,
    needsMerge: false,
    audioMergeSupported: false,
    formatId: `rapidapi-${index}`,
    audioIncluded: audioStatus,
    downloadUrl: url,
  };
}

function extractFormatsFromMedias(payload) {
  const medias = payload.medias || payload.media;
  if (!Array.isArray(medias)) return [];

  const withUrl = medias.filter((item) => item && isHttpUrl(item.url));
  const videos = withUrl.filter((item) => String(item.type || '').toLowerCase() === 'video');
  const pool = videos.length > 0 ? videos : withUrl;

  return pool
    .map((item, index) => mediaItemToFormat(item, index))
    .filter(Boolean);
}

function mapHttpError(status, parsed) {
  const providerMessage = parsed?.message || parsed?.error_message || '';

  if (status === 429) {
    return {
      success: false,
      statusCode: 429,
      message: 'Video API rate limit exceeded. Please try again later.',
    };
  }

  if (status === 401 || status === 403) {
    return {
      success: false,
      statusCode: 503,
      message: 'Video API is not configured correctly on the server.',
    };
  }

  if (isFailureMessage(providerMessage)) {
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
    message: providerMessage || 'Unable to fetch video details. Please try another public video link.',
  };
}

export function normalizeRapidApiResponse(raw, validation) {
  const payload = unwrapPayload(raw);

  if (!payload) {
    logMappingFailure('empty payload after unwrap', raw);
    return {
      success: false,
      statusCode: 502,
      message: 'Video provider returned an invalid response.',
    };
  }

  if (isProviderError(payload)) {
    logMappingFailure('provider reported error', {
      error: payload.error,
      message: payload.message,
      success: payload.success,
    });
    return {
      success: false,
      statusCode: 400,
      message: 'Unable to fetch video details. Please try another public video link.',
    };
  }

  const source = normalizePlatformSource(
    payload.source || payload.platform || validation.platform,
  );

  if (!isSupportedPlatform(source)) {
    logMappingFailure('unsupported platform', {
      source: payload.source,
      platform: payload.platform,
      detected: validation.platform,
    });
    return {
      success: false,
      statusCode: 400,
      message: 'FityVid supports YouTube, TikTok, Instagram, and Facebook links only.',
    };
  }

  const formats = extractFormatsFromMedias(payload);

  if (formats.length === 0) {
    logMappingFailure('no downloadable media urls', {
      source,
      mediasCount: Array.isArray(payload.medias) ? payload.medias.length : 0,
      medias: payload.medias,
      type: payload.type,
    });
    return {
      success: false,
      statusCode: 400,
      message: 'No downloadable video link found. Please try another public video link.',
    };
  }

  const thumbnail = payload.thumbnail || payload.thumb || payload.cover || null;

  return {
    success: true,
    platform: source,
    title: payload.title || payload.caption || 'Video by FityVid',
    thumbnail,
    thumbnailDisplay: thumbnail,
    duration: formatDuration(payload.duration),
    author: payload.author || payload.unique_id || null,
    formats,
  };
}

export async function fetchVideoInfoFromRapidApi(validation) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    logMappingFailure('missing RAPIDAPI_KEY', null);
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
    logMappingFailure('fetch error', err.message);
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
  } catch (err) {
    logMappingFailure('invalid json', { status: response.status, body: bodyText.slice(0, 500) });
    return mapHttpError(response.status, null);
  }

  if (!response.ok) {
    logMappingFailure('http error', { status: response.status, body: parsed || bodyText.slice(0, 500) });
    return mapHttpError(response.status, parsed);
  }

  const result = normalizeRapidApiResponse(parsed, validation);

  if (!result.success) {
    logMappingFailure('normalize returned failure', {
      url: validation.url,
      platform: validation.platform,
      parsedKeys: parsed && typeof parsed === 'object' ? Object.keys(parsed) : [],
      result,
    });
  }

  return result;
}

export function isRapidApiConfigured() {
  return Boolean(process.env.RAPIDAPI_KEY);
}
