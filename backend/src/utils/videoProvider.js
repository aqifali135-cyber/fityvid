const SUPPORTED = ['youtube', 'tiktok', 'instagram', 'facebook'];

export function getVideoProvider() {
  const raw = (process.env.VIDEO_API_PROVIDER || 'yt-dlp').toLowerCase().trim();
  if (raw === 'rapidapi_all_in_one' || raw === 'rapidapi') {
    return 'rapidapi_all_in_one';
  }
  return 'yt-dlp';
}

export function isRapidApiProvider() {
  return getVideoProvider() === 'rapidapi_all_in_one';
}

export function isSupportedPlatform(source) {
  if (!source) return false;
  const normalized = String(source).toLowerCase();
  return SUPPORTED.includes(normalized);
}

export function normalizePlatformSource(source) {
  const normalized = String(source || '').toLowerCase();
  if (normalized === 'fb' || normalized === 'facebook') return 'facebook';
  if (normalized === 'ig' || normalized === 'instagram') return 'instagram';
  if (normalized === 'yt' || normalized === 'youtube') return 'youtube';
  return normalized;
}
