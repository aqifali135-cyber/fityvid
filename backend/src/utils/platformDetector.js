const PLATFORM_HOSTS = {
  youtube: ['youtube.com', 'youtu.be', 'm.youtube.com'],
  facebook: ['facebook.com', 'fb.watch', 'm.facebook.com'],
  tiktok: ['tiktok.com', 'vm.tiktok.com'],
  instagram: ['instagram.com'],
};

const PLATFORMS = Object.keys(PLATFORM_HOSTS);

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

export function detectPlatformFromUrl(url) {
  if (!url || typeof url !== 'string') return null;

  try {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return null;

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

export function validateVideoUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: false, message: 'Please enter a video URL.' };
  }

  const trimmed = url.trim();

  try {
    new URL(trimmed);
  } catch {
    return { valid: false, message: 'Please enter a valid video URL.' };
  }

  const platform = detectPlatformFromUrl(trimmed);
  if (!platform) {
    return {
      valid: false,
      message: 'FityVid supports YouTube, TikTok, Instagram, and Facebook links only.',
    };
  }

  return { valid: true, platform, url: trimmed };
}

export { PLATFORMS, PLATFORM_HOSTS };
