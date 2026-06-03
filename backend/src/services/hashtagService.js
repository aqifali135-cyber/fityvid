/**
 * Local hashtag generation. Replace or extend with AI API later.
 */

const PLATFORM_SUFFIXES = {
  youtube: ['shorts', 'video', 'creator', 'vlog', 'subscribe', 'content', 'channel'],
  tiktok: ['fyp', 'foryou', 'foryoupage', 'viral', 'trend', 'tiktok', 'duet'],
  instagram: ['reels', 'insta', 'explore', 'igdaily', 'photooftheday', 'instagood'],
  facebook: ['fb', 'reels', 'share', 'community', 'page', 'post'],
};

const TYPE_MODIFIERS = {
  trending: ['trending', 'viral', 'popular', 'hot', 'now', '2026'],
  niche: ['community', 'tips', 'guide', 'lover', 'daily', 'life'],
  viral: ['viral', 'blowup', 'mustsee', 'share', 'wow', 'epic'],
  low_competition: ['tips', 'ideas', 'beginner', 'howto', 'learn', 'starter'],
  mixed: ['love', 'life', 'daily', 'inspo', 'goals', 'vibes'],
};

const GENERIC_SUFFIXES = [
  'motivation', 'inspiration', 'tips', 'hacks', 'ideas', 'life', 'daily',
  'lover', 'community', 'goals', 'vibes', 'world', 'time', 'style', 'hub',
  'zone', 'club', 'crew', 'squad', 'journey', 'story', 'content', 'creator',
];

const CAPTION_TEMPLATES = {
  youtube: [
    'New {topic} content is live — drop a comment if you want part 2.',
    'Sharing my best {topic} tips today. Save this for later.',
    'Everything you need to know about {topic} in one video.',
  ],
  tiktok: [
    'POV: you finally nailed {topic}. Follow for more.',
    'This {topic} hack changed everything for me.',
    'Save this {topic} tip before it disappears from your FYP.',
  ],
  instagram: [
    'Small {topic} wins add up. Which tip will you try first?',
    'Your daily dose of {topic} inspiration starts here.',
    'Tag someone who needs this {topic} reminder today.',
  ],
  facebook: [
    'Sharing something useful about {topic} with our community today.',
    'What is your biggest {topic} question? Let us know below.',
    'A quick {topic} update for everyone following along.',
  ],
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

function buildCandidates(topic, platform, type) {
  const base = normalizeTopic(topic);
  const words = topic.toLowerCase().split(/\s+/).filter(Boolean);
  const candidates = new Set();

  candidates.add(base);
  words.forEach((w) => candidates.add(w.replace(/[^a-z0-9]/g, '')));

  GENERIC_SUFFIXES.forEach((s) => {
    candidates.add(`${base}${s}`);
    words.forEach((w) => candidates.add(`${w}${s}`));
  });

  (PLATFORM_SUFFIXES[platform] || []).forEach((s) => {
    candidates.add(`${base}${s}`);
    candidates.add(`${s}${base}`);
  });

  (TYPE_MODIFIERS[type] || []).forEach((s) => {
    candidates.add(`${base}${s}`);
    candidates.add(`${s}${base}`);
    words.forEach((w) => candidates.add(`${w}${s}`));
  });

  if (type === 'mixed') {
    Object.values(TYPE_MODIFIERS)
      .flat()
      .forEach((s) => candidates.add(`${base}${s}`));
  }

  return [...candidates]
    .map(toHashtag)
    .filter(Boolean)
    .filter((tag) => tag.length > 2 && tag.length <= 30);
}

function pickCaption(topic, platform) {
  const templates = CAPTION_TEMPLATES[platform] || CAPTION_TEMPLATES.instagram;
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace(/\{topic\}/gi, topic);
}

/**
 * @param {{ topic: string, platform: string, type: string, count: number }} params
 */
export function generateHashtags({ topic, platform, type, count }) {
  const pool = buildCandidates(topic, platform, type);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const primary = toHashtag(normalizeTopic(topic));
  const hashtags = [];
  if (primary && !hashtags.includes(primary)) hashtags.push(primary);

  for (const tag of shuffled) {
    if (hashtags.length >= count) break;
    if (!hashtags.includes(tag)) hashtags.push(tag);
  }

  let i = 0;
  while (hashtags.length < count && i < 100) {
    const extra = toHashtag(`${normalizeTopic(topic)}${i}${TYPE_MODIFIERS.mixed[i % TYPE_MODIFIERS.mixed.length]}`);
    if (extra && !hashtags.includes(extra)) hashtags.push(extra);
    i += 1;
  }

  return {
    hashtags: hashtags.slice(0, count),
    captionIdea: pickCaption(topic, platform),
  };
}
