const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

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
