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

const CONTENT_TYPE_SUFFIXES = {
  post: ['post', 'update', 'feed', 'share'],
  reel_short: ['reels', 'shorts', 'short', 'clip', 'vertical'],
  video: ['video', 'vlog', 'watch', 'fullvideo'],
  story: ['story', 'stories', 'bts', 'behindthescenes'],
  caption: ['caption', 'quote', 'thoughts', 'mood'],
};

const GOAL_MODIFIERS = {
  more_reach: ['trending', 'viral', 'discover', 'explore', 'popular'],
  niche_audience: ['community', 'niche', 'lover', 'enthusiast', 'fans'],
  brand_awareness: ['brand', 'official', 'team', 'business', 'creator'],
  local_audience: ['local', 'nearme', 'community', 'shoplocal', 'city'],
  trending_topic: ['trending', 'hot', 'now', 'topic', '2026'],
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

const GROUP_META = [
  { key: 'trending', label: 'Trending', badge: 'High Reach' },
  { key: 'niche', label: 'Niche', badge: 'Niche' },
  { key: 'low_competition', label: 'Low Competition', badge: 'Low Competition' },
  { key: 'platform_specific', label: 'Platform Specific', badge: null },
];

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

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildCandidates(topic, platform, type, contentType = 'post', goal = 'more_reach') {
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

  (CONTENT_TYPE_SUFFIXES[contentType] || []).forEach((s) => {
    candidates.add(`${base}${s}`);
    words.forEach((w) => candidates.add(`${w}${s}`));
  });

  (GOAL_MODIFIERS[goal] || []).forEach((s) => {
    candidates.add(`${base}${s}`);
    candidates.add(`${s}${base}`);
    words.forEach((w) => candidates.add(`${w}${s}`));
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

function buildPlatformSpecific(topic, platform, contentType = 'post') {
  const base = normalizeTopic(topic);
  const words = topic.toLowerCase().split(/\s+/).filter(Boolean);
  const candidates = new Set();
  const platformWords = PLATFORM_SUFFIXES[platform] || [];
  const contentWords = CONTENT_TYPE_SUFFIXES[contentType] || [];

  platformWords.forEach((s) => {
    candidates.add(`${base}${s}`);
    candidates.add(`${s}${base}`);
    words.forEach((w) => {
      candidates.add(`${w}${s}`);
      candidates.add(`${s}${w}`);
    });
  });

  contentWords.forEach((s) => {
    platformWords.forEach((p) => {
      candidates.add(`${base}${p}${s}`);
      candidates.add(`${p}${base}`);
    });
  });

  return [...candidates]
    .map(toHashtag)
    .filter(Boolean)
    .filter((tag) => tag.length > 2 && tag.length <= 30);
}

function pickFromPool(pool, count, used) {
  const picked = [];
  for (const tag of shuffle(pool)) {
    if (picked.length >= count) break;
    if (!used.has(tag)) {
      used.add(tag);
      picked.push(tag);
    }
  }
  return picked;
}

function fillRemaining(topic, count, used) {
  const hashtags = [];
  const base = normalizeTopic(topic);
  let i = 0;

  while (hashtags.length < count && i < 120) {
    const suffix = TYPE_MODIFIERS.mixed[i % TYPE_MODIFIERS.mixed.length];
    const extra = toHashtag(`${base}${suffix}${i}`);
    if (extra && !used.has(extra)) {
      used.add(extra);
      hashtags.push(extra);
    }
    i += 1;
  }

  return hashtags;
}

function pickCaption(topic, platform) {
  const templates = CAPTION_TEMPLATES[platform] || CAPTION_TEMPLATES.instagram;
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace(/\{topic\}/gi, topic);
}

/**
 * @param {{ topic: string, platform: string, type: string, count: number, contentType?: string, goal?: string }} params
 */
export function generateHashtags({
  topic,
  platform,
  type,
  count,
  contentType = 'post',
  goal = 'more_reach',
}) {
  const used = new Set();
  const primary = toHashtag(normalizeTopic(topic));
  if (primary) used.add(primary);

  const perGroup = Math.max(2, Math.ceil(count / 4));

  const trendingPool = buildCandidates(topic, platform, 'trending', contentType, goal);
  const nichePool = buildCandidates(topic, platform, 'niche', contentType, goal);
  const lowCompPool = buildCandidates(topic, platform, 'low_competition', contentType, goal);
  const platformPool = buildPlatformSpecific(topic, platform, contentType);

  const groupTags = {
    trending: pickFromPool(trendingPool, perGroup, used),
    niche: pickFromPool(nichePool, perGroup, used),
    low_competition: pickFromPool(lowCompPool, perGroup, used),
    platform_specific: pickFromPool(platformPool, perGroup, used),
  };

  const hashtags = [];
  if (primary) hashtags.push(primary);

  GROUP_META.forEach(({ key }) => {
    groupTags[key].forEach((tag) => {
      if (!hashtags.includes(tag)) hashtags.push(tag);
    });
  });

  const extraNeeded = count - hashtags.length;
  if (extraNeeded > 0) {
    const mixedPool = buildCandidates(topic, platform, type, contentType, goal);
    pickFromPool(mixedPool, extraNeeded, used).forEach((tag) => {
      if (!hashtags.includes(tag)) hashtags.push(tag);
    });
  }

  if (hashtags.length < count) {
    fillRemaining(topic, count - hashtags.length, used).forEach((tag) => {
      if (!hashtags.includes(tag)) hashtags.push(tag);
    });
  }

  const finalHashtags = hashtags.slice(0, count);

  const groups = GROUP_META.map(({ key, label, badge }) => ({
    key,
    label,
    badge,
    hashtags: groupTags[key].length > 0 ? groupTags[key] : finalHashtags.slice(0, perGroup),
  })).filter((group) => group.hashtags.length > 0);

  return {
    hashtags: finalHashtags,
    groups,
    captionIdea: pickCaption(topic, platform),
  };
}
