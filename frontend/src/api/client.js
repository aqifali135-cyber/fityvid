const PRODUCTION_API_BASE = 'https://api.fityvid.com';

function getApiBase() {
  const configured =
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    import.meta.env.VITE_API_URL?.trim() ||
    '';

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  // In Vite dev, use relative /api paths so the proxy hits the local backend.
  if (import.meta.env.DEV) {
    return '';
  }

  return PRODUCTION_API_BASE;
}

const API_BASE = getApiBase();

export function resolveApiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_BASE.replace(/\/$/, '');
  return `${base}${path}`;
}

export async function fetchVideoInfo(url, platform) {
  const res = await fetch(resolveApiUrl('/api/video/info'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, platform }),
  });
  const data = await res.json();

  if (import.meta.env.DEV) {
    console.debug('[FityVid] video/info', { ok: res.ok, platform: data.platform });
  }

  return { ok: res.ok, data };
}

export async function fetchTiktokVideoDownload(url) {
  const res = await fetch(resolveApiUrl('/api/tiktok/video-download'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();

  if (import.meta.env.DEV) {
    console.debug('[FityVid] tiktok/video-download', {
      ok: res.ok,
      success: data?.success,
      hasVideo: Boolean(data?.data?.videoUrl),
      hasAudio: Boolean(data?.data?.audioUrl),
    });
  }

  return { ok: res.ok, data };
}

export function triggerDownload(downloadUrl) {
  const href = resolveApiUrl(downloadUrl);
  if (import.meta.env.DEV) {
    console.debug('[FityVid] download', href);
  }
  const link = document.createElement('a');
  link.href = href;
  link.rel = 'noopener';
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function generateHashtags(payload) {
  const res = await fetch(resolveApiUrl('/api/hashtags/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }
  return data;
}
