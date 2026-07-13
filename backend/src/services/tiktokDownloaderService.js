/**
 * TikTok Video Downloader — dedicated third-party API client.
 * Credentials come from env only; never log secret values.
 */

const REQUEST_TIMEOUT_MS = 45000;

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
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function sanitizeHttpUrl(value) {
  if (!isHttpUrl(value)) return '';
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
  return Boolean(
    process.env.TIKTOK_DOWNLOADER_API_URL?.trim() &&
      process.env.TIKTOK_DOWNLOADER_API_KEY?.trim(),
  );
}

function getApiConfig() {
  const apiUrl = process.env.TIKTOK_DOWNLOADER_API_URL?.trim();
  const apiKey = process.env.TIKTOK_DOWNLOADER_API_KEY?.trim();

  if (!apiUrl || !apiKey) {
    return null;
  }

  let host = '';
  try {
    host = new URL(apiUrl).hostname;
  } catch {
    host = '';
  }

  return { apiUrl, apiKey, host };
}

function pickFirstString(...candidates) {
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function extractFromMedias(medias) {
  if (!Array.isArray(medias)) {
    return { videoUrl: '', audioUrl: '' };
  }

  let videoUrl = '';
  let audioUrl = '';

  for (const item of medias) {
    if (!item || typeof item !== 'object') continue;
    const url = sanitizeHttpUrl(item.url || item.download_url || item.link);
    if (!url) continue;

    const type = String(item.type || item.media_type || '').toLowerCase();
    const ext = String(item.extension || item.ext || item.format || '').toLowerCase();

    if (!audioUrl && (type === 'audio' || ['mp3', 'm4a', 'aac', 'opus'].includes(ext))) {
      audioUrl = url;
      continue;
    }

    if (
      !videoUrl &&
      (type === 'video' ||
        type === '' ||
        ['mp4', 'webm', 'mov'].includes(ext) ||
        item.quality ||
        item.height)
    ) {
      videoUrl = url;
    }
  }

  if (!videoUrl) {
    const first = medias.find((item) => isHttpUrl(item?.url));
    if (first) videoUrl = sanitizeHttpUrl(first.url);
  }

  return { videoUrl, audioUrl };
}

function unwrapPayload(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    return raw.data;
  }
  if (raw.result && typeof raw.result === 'object') {
    return raw.result;
  }
  if (Array.isArray(raw.data)) {
    return raw.data.find((item) => item && typeof item === 'object') || null;
  }
  return raw;
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
  ].some((hint) => m.includes(hint));
}

/**
 * Map third-party provider payloads into the FityVid TikTok response shape.
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
    const providerMessage = pickFirstString(raw.message, raw.error_message, raw.error);
    return {
      success: false,
      statusCode: 400,
      message: looksLikePrivateOrUnsupported(providerMessage)
        ? 'Unable to process this TikTok link. Private or unsupported videos are not available.'
        : sanitizeText(providerMessage, 220) ||
          'Unable to fetch this TikTok video. Please try another public link.',
    };
  }

  const payload = unwrapPayload(raw) || raw;
  const fromMedias = extractFromMedias(payload.medias || payload.media || raw.medias);

  const title = sanitizeText(
    pickFirstString(
      payload.title,
      payload.desc,
      payload.description,
      payload.caption,
      raw.title,
      'TikTok video',
    ),
    300,
  );

  const thumbnail = sanitizeHttpUrl(
    pickFirstString(
      payload.thumbnail,
      payload.cover,
      payload.coverUrl,
      payload.cover_url,
      payload.origin_cover,
      payload.dynamic_cover,
      raw.thumbnail,
    ),
  );

  const videoUrl = sanitizeHttpUrl(
    pickFirstString(
      payload.videoUrl,
      payload.video_url,
      payload.nwm_video_url,
      payload.play,
      payload.playAddr,
      payload.download_url,
      payload.downloadUrl,
      payload.hdplay,
      payload.video,
      fromMedias.videoUrl,
      raw.videoUrl,
      raw.video_url,
    ),
  );

  const audioUrl = sanitizeHttpUrl(
    pickFirstString(
      payload.audioUrl,
      payload.audio_url,
      payload.music,
      payload.music_url,
      payload.musicUrl,
      fromMedias.audioUrl,
      raw.audioUrl,
      raw.audio_url,
    ),
  );

  if (!videoUrl) {
    return {
      success: false,
      statusCode: 400,
      message:
        'Unable to process this TikTok link. Private or unsupported videos are not available.',
    };
  }

  return {
    success: true,
    data: {
      title: title || 'TikTok video',
      thumbnail,
      videoUrl,
      audioUrl,
    },
  };
}

function mapHttpError(status, parsed) {
  const providerMessage = pickFirstString(
    parsed?.message,
    parsed?.error_message,
    typeof parsed?.error === 'string' ? parsed.error : '',
  );

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
        'Unable to process this TikTok link. Private or unsupported videos are not available.',
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
 * Call the configured third-party TikTok downloader API.
 * Never logs API keys or raw authorization headers.
 */
export async function fetchTiktokVideoDownload(tiktokUrl) {
  const config = getApiConfig();
  if (!config) {
    console.error('[tiktok-downloader] missing TIKTOK_DOWNLOADER_API_URL or TIKTOK_DOWNLOADER_API_KEY');
    return {
      success: false,
      statusCode: 503,
      message:
        'TikTok downloader is not configured. Please set TIKTOK_DOWNLOADER_API_URL and TIKTOK_DOWNLOADER_API_KEY.',
    };
  }

  const { apiUrl, apiKey, host } = config;

  let response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-rapidapi-key': apiKey,
        ...(host ? { 'x-rapidapi-host': host } : {}),
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url: tiktokUrl }),
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
      // Never log secrets — message only, truncated.
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
      // Avoid dumping full provider payloads that might include tokens.
      keys: parsed && typeof parsed === 'object' ? Object.keys(parsed).slice(0, 12) : [],
    });
    return mapHttpError(response.status, parsed);
  }

  return normalizeTiktokDownloaderResponse(parsed);
}
