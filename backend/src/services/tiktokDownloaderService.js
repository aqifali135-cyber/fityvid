/**
 * TikTok Video Downloader — RapidAPI client.
 * Credentials come from env only; never log or return secret values.
 *
 * RapidAPI:
 *   GET https://{RAPIDAPI_TIKTOK_HOST}/vid/index?url={tiktokUrl}
 *   Headers: X-RapidAPI-Key, X-RapidAPI-Host
 *
 * Short links (vt.tiktok.com / vm.tiktok.com) are resolved on the backend
 * before calling RapidAPI.
 */

const REQUEST_TIMEOUT_MS = 45000;
const REDIRECT_TIMEOUT_MS = 15000;
const MAX_REDIRECTS = 8;
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

const SHORT_LINK_HOSTS = ['vt.tiktok.com', 'vm.tiktok.com'];

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

function isShortTiktokLink(urlString) {
  try {
    const host = normalizeHost(new URL(urlString).hostname);
    return SHORT_LINK_HOSTS.includes(host);
  } catch {
    return false;
  }
}

/**
 * Validate that a URL is a public TikTok video / share link.
 * Accepts full links and vt/vm short links.
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
 * Prefer a clean canonical TikTok video URL from a redirected location.
 * Example: https://www.tiktok.com/@user/video/1234567890
 */
export function extractCanonicalTiktokVideoUrl(urlString) {
  if (!isHttpUrl(urlString)) return null;

  try {
    const parsed = new URL(urlString);
    if (!isTiktokHost(parsed.hostname)) return null;

    const fullMatch = parsed.pathname.match(/\/(@[^/]+\/video\/\d+)/i);
    if (fullMatch) {
      return `https://www.tiktok.com/${fullMatch[1]}`;
    }

    const videoOnly = parsed.pathname.match(/\/video\/(\d+)/i);
    if (videoOnly) {
      return `https://www.tiktok.com/video/${videoOnly[1]}`;
    }

    // Fallback: keep TikTok host + path without query/hash.
    const path = parsed.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || isShortTiktokLink(urlString)) {
      return null;
    }

    return `https://www.tiktok.com${path}`;
  } catch {
    return null;
  }
}

/**
 * Follow HTTP redirects for vt/vm short links and return a full TikTok URL.
 * Never logs secrets.
 */
export async function resolveTiktokShortUrl(shortUrl) {
  let current = shortUrl;

  for (let hop = 0; hop < MAX_REDIRECTS; hop += 1) {
    let response;
    try {
      response = await fetch(current, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(REDIRECT_TIMEOUT_MS),
      });
    } catch (err) {
      const timedOut =
        err?.name === 'TimeoutError' ||
        err?.name === 'AbortError' ||
        /aborted|timeout/i.test(String(err?.message || ''));

      console.error('[tiktok-downloader] URL redirect resolution failed', {
        reason: timedOut ? 'timeout' : 'network',
        hop,
        shortHost: (() => {
          try {
            return new URL(shortUrl).hostname;
          } catch {
            return 'invalid';
          }
        })(),
        message: String(err?.message || 'unknown').slice(0, 200),
      });

      return {
        ok: false,
        message: timedOut
          ? 'TikTok short link resolution timed out. Please try again or use the full video URL.'
          : 'Unable to resolve this TikTok short link. Please try the full video URL.',
      };
    }

    const status = response.status;

    if ([301, 302, 303, 307, 308].includes(status)) {
      const location = response.headers.get('location');
      if (!location) {
        console.error('[tiktok-downloader] URL redirect resolution failed', {
          reason: 'missing_location',
          status,
          hop,
        });
        return {
          ok: false,
          message: 'Unable to resolve this TikTok short link. Please try the full video URL.',
        };
      }

      let nextUrl;
      try {
        nextUrl = new URL(location, current).toString();
      } catch {
        console.error('[tiktok-downloader] URL redirect resolution failed', {
          reason: 'invalid_location',
          status,
          hop,
        });
        return {
          ok: false,
          message: 'Unable to resolve this TikTok short link. Please try the full video URL.',
        };
      }

      let nextHost;
      try {
        nextHost = new URL(nextUrl).hostname;
      } catch {
        nextHost = '';
      }

      if (!isTiktokHost(nextHost)) {
        console.error('[tiktok-downloader] URL redirect resolution failed', {
          reason: 'non_tiktok_redirect_host',
          status,
          hop,
          nextHost: nextHost || 'unknown',
        });
        return {
          ok: false,
          message: 'Unable to resolve this TikTok short link. Please try the full video URL.',
        };
      }

      current = nextUrl;
      continue;
    }

    // Non-redirect response — use the current URL (after any previous hops).
    const canonical = extractCanonicalTiktokVideoUrl(current);
    if (!canonical) {
      console.error('[tiktok-downloader] URL redirect resolution failed', {
        reason: 'no_canonical_video_url',
        status,
        hop,
        pathPreview: (() => {
          try {
            return new URL(current).pathname.slice(0, 80);
          } catch {
            return 'invalid';
          }
        })(),
      });
      return {
        ok: false,
        message: 'Unable to resolve this TikTok short link. Please try the full video URL.',
      };
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[tiktok-downloader] short link resolved', {
        fromHost: (() => {
          try {
            return new URL(shortUrl).hostname;
          } catch {
            return 'invalid';
          }
        })(),
        hops: hop,
        resolvedPath: (() => {
          try {
            return new URL(canonical).pathname;
          } catch {
            return 'invalid';
          }
        })(),
      });
    }

    return { ok: true, url: canonical };
  }

  console.error('[tiktok-downloader] URL redirect resolution failed', {
    reason: 'max_redirects',
    maxRedirects: MAX_REDIRECTS,
  });

  return {
    ok: false,
    message: 'Unable to resolve this TikTok short link. Please try the full video URL.',
  };
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
 * Required mapping:
 *   video[0] -> videoUrl
 *   music[0] -> audioUrl
 *   cover[0] -> thumbnail
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
    const providerMessage =
      firstValue(raw.message) || firstValue(raw.error_message) || firstValue(raw.error);

    console.error('[tiktok-downloader] RapidAPI payload error', {
      message: sanitizeText(providerMessage, 220),
      keys: Object.keys(raw).slice(0, 12),
    });

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

  // Prefer exact RapidAPI array fields first.
  const thumbnail = sanitizeHttpUrl(firstValue(raw.cover));
  const videoUrl = sanitizeHttpUrl(firstValue(raw.video));
  const audioUrl = sanitizeHttpUrl(firstValue(raw.music));

  if (!videoUrl) {
    console.error('[tiktok-downloader] RapidAPI missing video[0]', {
      keys: Object.keys(raw).slice(0, 12),
      hasCover: Boolean(firstValue(raw.cover)),
      hasMusic: Boolean(firstValue(raw.music)),
    });

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

  console.error('[tiktok-downloader] RapidAPI HTTP error', {
    status,
    message: sanitizeText(providerMessage, 220),
    keys: parsed && typeof parsed === 'object' ? Object.keys(parsed).slice(0, 12) : [],
  });

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
 * Resolves vt/vm short links first. Never logs API keys.
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

  let resolvedUrl = tiktokUrl;

  if (isShortTiktokLink(tiktokUrl)) {
    const resolved = await resolveTiktokShortUrl(tiktokUrl);
    if (!resolved.ok) {
      return {
        success: false,
        statusCode: 400,
        message: resolved.message,
      };
    }
    resolvedUrl = resolved.url;
  }

  const { apiKey, host } = config;
  const endpoint = new URL(`https://${host}${API_PATH}`);
  endpoint.searchParams.set('url', resolvedUrl);

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

    console.error('[tiktok-downloader] RapidAPI fetch error', {
      reason: timedOut ? 'timeout' : 'network',
      message: String(err?.message || 'unknown').slice(0, 200),
      usedShortLink: isShortTiktokLink(tiktokUrl),
    });

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
    console.error('[tiktok-downloader] RapidAPI invalid JSON', {
      status: response.status,
      bodyPreview: bodyText.slice(0, 300),
      usedShortLink: isShortTiktokLink(tiktokUrl),
    });
    return mapHttpError(response.status, null);
  }

  if (!response.ok) {
    const providerMessage =
      firstValue(parsed?.message) ||
      firstValue(parsed?.error_message) ||
      (typeof parsed?.error === 'string' ? parsed.error : null);

    console.error('[tiktok-downloader] RapidAPI HTTP status', {
      status: response.status,
      message: sanitizeText(providerMessage, 220),
      usedShortLink: isShortTiktokLink(tiktokUrl),
      keys: parsed && typeof parsed === 'object' ? Object.keys(parsed).slice(0, 12) : [],
    });

    return mapHttpError(response.status, parsed);
  }

  return normalizeTiktokDownloaderResponse(parsed);
}
