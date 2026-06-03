import { detectPlatformFromUrl, validateVideoUrl, PLATFORMS } from './platformDetector.js';

const HASHTAG_TYPES = ['trending', 'niche', 'viral', 'low_competition', 'mixed'];
const HASHTAG_COUNTS = [10, 20, 30, 50];

export function validateHashtagRequest(body) {
  const errors = [];
  const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';

  if (!topic) {
    errors.push({ field: 'topic', message: 'Topic is required' });
  }

  const platform = (body?.platform || '').toLowerCase();
  if (!PLATFORMS.includes(platform)) {
    errors.push({ field: 'platform', message: 'Platform must be youtube, tiktok, instagram, or facebook' });
  }

  const type = (body?.type || '').toLowerCase();
  if (!HASHTAG_TYPES.includes(type)) {
    errors.push({ field: 'type', message: 'Type must be trending, niche, viral, low_competition, or mixed' });
  }

  const count = Number(body?.count);
  if (!HASHTAG_COUNTS.includes(count)) {
    errors.push({ field: 'count', message: 'Count must be 10, 20, 30, or 50' });
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { topic, platform, type, count },
  };
}

export function validateDownloadUrl(url) {
  return validateVideoUrl(url);
}

export { detectPlatformFromUrl, validateVideoUrl, PLATFORMS, HASHTAG_TYPES, HASHTAG_COUNTS };
