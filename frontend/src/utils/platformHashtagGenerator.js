import { generateHashtags } from '../api/client';

const API_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'facebook'];

const SNAPCHAT_SUFFIXES = [
  'snap',
  'snapchat',
  'story',
  'daily',
  'moments',
  'snapchatstory',
  'snapstory',
  'lifestyle',
  'vibes',
  'creator',
];

const TYPE_MODIFIERS = {
  trending: ['trending', 'viral', 'popular', 'hot'],
  niche: ['community', 'tips', 'daily', 'life'],
  viral: ['viral', 'share', 'wow', 'epic'],
  low_competition: ['tips', 'ideas', 'beginner', 'howto'],
  mixed: ['love', 'life', 'daily', 'inspo', 'goals', 'vibes'],
};

function normalizeTopic(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '');
}

function toHashtag(word) {
  const clean = word.replace(/[^a-z0-9]/gi, '');
  if (!clean) return null;
  return `#${clean}`;
}

function buildSnapchatHashtags(topic, count, type = 'mixed') {
  const base = normalizeTopic(topic);
  const words = topic.toLowerCase().split(/\s+/).filter(Boolean);
  const candidates = new Set();

  if (base) candidates.add(base);
  words.forEach((w) => candidates.add(w.replace(/[^a-z0-9]/g, '')));

  SNAPCHAT_SUFFIXES.forEach((suffix) => {
    if (base) {
      candidates.add(`${base}${suffix}`);
      candidates.add(`${suffix}${base}`);
    }
    words.forEach((w) => {
      candidates.add(`${w}${suffix}`);
      candidates.add(`${suffix}${w}`);
    });
    candidates.add(suffix);
  });

  (TYPE_MODIFIERS[type] || TYPE_MODIFIERS.mixed).forEach((suffix) => {
    if (base) candidates.add(`${base}${suffix}`);
  });

  const tags = [...candidates]
    .map(toHashtag)
    .filter(Boolean)
    .filter((tag, index, list) => list.indexOf(tag) === index);

  const primary = toHashtag(base);
  const ordered = primary && tags.includes(primary)
    ? [primary, ...tags.filter((tag) => tag !== primary)]
    : tags;

  return ordered.slice(0, count);
}

/**
 * Generate hashtags for all supported platforms.
 * @returns {Promise<{ success: boolean, platformHashtags: Record<string, string[]>, topic: string, type: string, contentType: string, goal: string, count: number, hashtags: string[], captionIdea?: string }>}
 */
export async function generateAllPlatformHashtags({
  topic,
  contentType,
  goal,
  type,
  count,
  language,
}) {
  const trimmedTopic = topic.trim();
  const responses = await Promise.all(
    API_PLATFORMS.map((platform) =>
      generateHashtags({
        topic: trimmedTopic,
        platform,
        contentType,
        goal,
        type,
        count,
        language,
      }).then((data) => ({ platform, data })),
    ),
  );

  const platformHashtags = {
    snapchat: buildSnapchatHashtags(trimmedTopic, count, type),
  };

  let captionIdea = '';

  for (const { platform, data } of responses) {
    if (data?.success && Array.isArray(data.hashtags)) {
      platformHashtags[platform] = data.hashtags;
      if (!captionIdea && data.captionIdea) {
        captionIdea = data.captionIdea;
      }
    } else {
      platformHashtags[platform] = [];
    }
  }

  const allSucceeded = API_PLATFORMS.every((platform) => platformHashtags[platform]?.length > 0);

  return {
    success: allSucceeded,
    topic: trimmedTopic,
    platform: 'all',
    type,
    contentType,
    goal,
    count,
    platformHashtags,
    hashtags: platformHashtags.instagram,
    captionIdea,
  };
}

export const RESULT_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'snapchat', label: 'Snapchat' },
];
