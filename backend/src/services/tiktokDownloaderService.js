/**
 * TikTok Video Downloader — RapidAPI client.
 * Credentials come from env only; never log or return secret values.
 *
 * RapidAPI:
 *   GET https://{RAPIDAPI_TIKTOK_HOST}/vid/index?url={tiktokUrl}
 *   Headers: X-RapidAPI-Key, X-RapidAPI-Host
 */

const REQUEST_TIMEOUT_MS = 45000;
const DEFAULT_HOST =
  'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com';
const API_PATH = '/vid/index';

const TIKTOK_HOSTS = [
  'tiktok.com',
  'www.tiktok.com',
  'm.tiktok.com',
  'vm.tiktok.com',
  'vt.tiktok.com',
];

function isHttpUrl(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function sanitizeText(value, maxLength = 500) {
  if (typeof value !== 'string') return null;
  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
  return cleaned || null;
}

function sanitizeHttpUrl(value) {
  if (!isHttpUrl(value)) return null;
  return value.trim();
}

function normalizeHost(hostname) {
  return String(hostname || '')
    .toLowerCase()
    .replace(/^www\./, '');
}

function isTiktokHost(hostname) {
  const host = normalizeHost(hostname);
  return TIKTOK_HOSTS.some((pattern) => {
    const p = pattern.replace(/^www\./, '');
    return host === p || host.endsWith(`.${p}`);
  });
}

/**
 * Validate that a URL is a public TikTok video / share link.
 */
export function validateTiktokDownloadUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: false, message: 'URL is required.' };
  }

  const trimmed = url.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid TikTok URL.' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, message: 'Please enter a valid TikTok URL.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, message: 'Please enter a valid TikTok URL.' };
  }

  if (!isTiktokHost(parsed.hostname)) {
    return {
      valid: false,
      message: 'Only public TikTok video URLs are supported on this endpoint.',
    };
  }

  return { valid: true, url: trimmed };
}

export function isTiktokDownloaderConfigured() {
  return Boolean(process.env.RAPIDAPI_TIKTOK_KEY?.trim());
}

function getApiConfig() {
  const apiKey = process.env.RAPIDAPI_TIKTOK_KEY?.trim();
  if (!apiKey) return null;

  const host = (
    process.env.RAPIDAPI_TIKTOK_HOST?.trim() || DEFAULT_HOST
  ).replace(/^https?:\/\//i, '');

  return { apiKey, host };
}

/**
 * RapidAPI often returns fields as arrays (e.g. video[0], description[0]).
 */
function firstValue(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string' && item.trim()) return item.trim();
      if (item && typeof item === 'object') {
        const nested = firstValue(
          item.url || item.play || item.download || item.src || item.link,
        );
        if (nested) return nested;
      }
    }
    return null;
  }

  if (typeof value === 'string' && value.trim()) return value.trim();
  return null;
}

function looksLikePrivateOrUnsupported(message) {
  if (!message || typeof message !== 'string') return false;
  const m = message.toLowerCase();
  return [
    'private',
    'not found',
    'unavailable',
    'unsupported',
    'restricted',
    'login',
    'forbidden',
    'deleted',
    'does not exist',
    'invalid url',
    'invalid link',
    'no media',
    'could not',
  ].some((hint) => m.includes(hint));
}

/**
 * Map RapidAPI /vid/index payload into FityVid response shape.
 * Missing values become null.
 *
 * Common RapidAPI fields:
 * - title  <- description[0] | title | desc
 * - thumbnail <- cover[0] | origin_cover[0] | thumbnail
 * - videoUrl <- video[0] | play[0] | download_url
 * - audioUrl <- music[0] | music_url | audio
 */
export function normalizeTiktokDownloaderResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      success: false,
      statusCode: 502,
      message: 'TikTok provider returned an invalid response.',
    };
  }

  if (raw.success === false || raw.status === 'error' || raw.error === true) {
    const providerMessage = firstValue(raw.message) || firstValue(raw.error_message) || firstValue(raw.error);
    return {
      success: false,
      statusCode: 400,
      message: looksLikePrivateOrUnsupported(providerMessage)
        ? 'Unable to process this TikTok link. Private, deleted, or unsupported videos are not available.'
        : sanitizeText(providerMessage, 220) ||
          'Unable to fetch this TikTok video. Please try another public link.',
    };
  }

  const title = sanitizeText(
    firstValue(raw.description) ||
      firstValue(raw.title) ||
      firstValue(raw.desc) ||
      firstValue(raw.caption),
    300,
  );

  const thumbnail = sanitizeHttpUrl(
    firstValue(raw.cover) ||
      firstValue(raw.origin_cover) ||
      firstValue(raw.dynamic_cover) ||
      firstValue(raw.thumbnail) ||
      firstValue(raw.coverUrl),
  );

  const videoUrl = sanitizeHttpUrl(
    firstValue(raw.video) ||
      firstValue(raw.play) ||
      firstValue(raw.nwm_video_url) ||
      firstValue(raw.download_url) ||
      firstValue(raw.videoUrl) ||
      firstValue(raw.hdplay),
  );

  const audioUrl = sanitizeHttpUrl(
    firstValue(raw.music) ||
      firstValue(raw.music_url) ||
      firstValue(raw.audio) ||
      firstValue(raw.audioUrl) ||
      firstValue(raw.musicUrl),
  );

  if (!videoUrl) {
    return {
      success: false,
      statusCode: 400,
      message:
        'Unable to process this TikTok link. Private, deleted, or unsupported videos are not available.',
    };
  }

  return {
    success: true,
    data: {
      title,
      thumbnail,
      videoUrl,
      audioUrl,
    },
  };
}

function mapHttpError(status, parsed) {
  const providerMessage =
    firstValue(parsed?.message) ||
    firstValue(parsed?.error_message) ||
    (typeof parsed?.error === 'string' ? parsed.error : null);

  if (status === 429) {
    return {
      success: false,
      statusCode: 429,
      message: 'TikTok download rate limit exceeded. Please try again later.',
    };
  }

  if (status === 401 || status === 403) {
    return {
      success: false,
      statusCode: 503,
      message: 'TikTok downloader API is not configured correctly on the server.',
    };
  }

  if (status >= 500) {
    return {
      success: false,
      statusCode: 502,
      message: 'TikTok provider is temporarily unavailable. Please try again later.',
    };
  }

  if (looksLikePrivateOrUnsupported(providerMessage)) {
    return {
      success: false,
      statusCode: 400,
      message:
        'Unable to process this TikTok link. Private, deleted, or unsupported videos are not available.',
    };
  }

  return {
    success: false,
    statusCode: 400,
    message:
      sanitizeText(providerMessage, 220) ||
      'Unable to fetch this TikTok video. Please try another public link.',
  };
}

/**
 * Call RapidAPI TikTok downloader.
 * Never logs API keys or authorization headers.
 */
export async function fetchTiktokVideoDownload(tiktokUrl) {
  const config = getApiConfig();
  if (!config) {
    console.error('[tiktok-downloader] missing RAPIDAPI_TIKTOK_KEY');
    return {
      success: false,
      statusCode: 503,
      message:
        'TikTok downloader is not configured. Please set RAPIDAPI_TIKTOK_KEY on the server.',
    };
  }

  const { apiKey, host } = config;
  const endpoint = new URL(`https://${host}${API_PATH}`);
  endpoint.searchParams.set('url', tiktokUrl);

  let response;
  try {
    response = await fetch(endpoint.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    const timedOut =
      err?.name === 'TimeoutError' ||
      err?.name === 'AbortError' ||
      /aborted|timeout/i.test(String(err?.message || ''));

    console.error(
      '[tiktok-downloader] fetch error:',
      timedOut ? 'timeout' : 'network',
      String(err?.message || 'unknown').slice(0, 200),
    );

    return {
      success: false,
      statusCode: timedOut ? 504 : 502,
      message: timedOut
        ? 'TikTok download request timed out. Please try again.'
        : 'TikTok provider is temporarily unavailable. Please try again later.',
    };
  }

  const bodyText = await response.text();
  let parsed = null;

  try {
    parsed = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    console.error('[tiktok-downloader] invalid JSON', {
      status: response.status,
      bodyPreview: bodyText.slice(0, 300),
    });
    return mapHttpError(response.status, null);
  }

  if (!response.ok) {
    console.error('[tiktok-downloader] http error', {
      status: response.status,
      keys: parsed && typeof parsed === 'object' ? Object.keys(parsed).slice(0, 12) : [],
    });
    return mapHttpError(response.status, parsed);
  }

  return normalizeTiktokDownloaderResponse(parsed);
}
