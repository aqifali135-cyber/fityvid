const PLATFORM_HOSTS = {
  youtube: ['youtube.com', 'youtu.be', 'm.youtube.com'],
  facebook: ['facebook.com', 'fb.watch', 'm.facebook.com'],
  tiktok: ['tiktok.com', 'vm.tiktok.com', 'www.tiktok.com'],
  instagram: ['instagram.com', 'www.instagram.com'],
};

const PLATFORMS = ['youtube', 'facebook', 'tiktok', 'instagram'];

function normalizeHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function hostMatchesPlatform(host, platform) {
  const patterns = PLATFORM_HOSTS[platform];
  return patterns.some((pattern) => {
    const p = pattern.replace(/^www\./, '');
    return host === p || host.endsWith(`.${p}`) || host.endsWith(p);
  });
}

/**
 * @param {string} url
 * @returns {'youtube'|'facebook'|'tiktok'|'instagram'|null}
 */
export function detectPlatform(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return null;
  }

  let trimmed = url.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    if (trimmed.includes(' ') || !trimmed.includes('.')) {
      return null;
    }
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    const host = normalizeHost(parsed.hostname);

    for (const platform of PLATFORMS) {
      if (hostMatchesPlatform(host, platform)) {
        return platform;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export const PLATFORM_NAMES = {
  youtube: 'YouTube',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  instagram: 'Instagram',
};

export { PLATFORMS };
