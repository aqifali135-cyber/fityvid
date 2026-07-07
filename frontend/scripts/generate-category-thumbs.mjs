import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { HASHTAG_CATEGORIES } from '../src/constants/hashtagCategories.js';
import { CATEGORY_PHOTO_SOURCES, PROCEDURAL_PALETTES } from './category-photo-sources.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/hashtag-categories');
const WIDTH = 640;
const HEIGHT = 400;

/** Slugs where the main subject should stay centered and fully visible. */
const SUBJECT_CENTER_SLUGS = new Set([
  'dog',
  'puppy',
  'yoga',
  'eyes',
  'smile',
  'baby',
  'kid',
  'cat',
  'portrait',
  'selfie',
  'tatto',
]);

function getCoverPosition(slug) {
  if (SUBJECT_CENTER_SLUGS.has(slug)) return 'attention';
  if (slug === 'sunset' || slug === 'sky' || slug === 'rainbow' || slug === 'night') return 'centre';
  const seed = hashSlug(slug);
  return seed % 3 === 0 ? 'top' : seed % 3 === 1 ? 'centre' : 'bottom';
}

function getCollageCrops(slug, srcWidth, srcHeight) {
  const useCenter =
    SUBJECT_CENTER_SLUGS.has(slug)
    || ['flower', 'rainbow', 'sky', 'sunset', 'night', 'summer', 'architecture', 'festival', 'sushi', 'chocolate', 'jewelry', 'bag', 'dress', 'look', 'design', 'dancing', 'tatto', 'news', 'colour', 'blue', 'baby', 'kid', 'animal', 'fox-quotes', 'birthday', 'love', 'workout', 'jokeday', 'funny'].includes(slug);

  if (useCenter) {
    const focusWidth = Math.min(280, srcWidth);
    const focusHeight = Math.min(180, srcHeight);
    const focusLeft = Math.max(0, Math.floor((srcWidth - focusWidth) / 2));
    const focusTop = Math.max(0, Math.floor((srcHeight - focusHeight) / 2));

    const detailWidth = Math.min(240, srcWidth);
    const detailHeight = Math.min(160, srcHeight);
    const detailLeft = Math.max(0, Math.min(focusLeft + 40, srcWidth - detailWidth));
    const detailTop = Math.max(0, Math.min(focusTop + 30, srcHeight - detailHeight));

    return [
      { left: focusLeft, top: focusTop, width: focusWidth, height: focusHeight },
      { left: detailLeft, top: detailTop, width: detailWidth, height: detailHeight },
    ];
  }

  const seed = hashSlug(slug);
  const crop1Left = Math.min((seed % 4) * 35, Math.max(0, srcWidth - 280));
  const crop1Top = Math.min((seed % 3) * 25, Math.max(0, srcHeight - 180));
  const crop2Left = Math.min(100 + (seed % 5) * 28, Math.max(0, srcWidth - 240));
  const crop2Top = Math.min(50 + (seed % 4) * 22, Math.max(0, srcHeight - 160));

  return [
    {
      left: crop1Left,
      top: crop1Top,
      width: Math.min(280, srcWidth - crop1Left),
      height: Math.min(180, srcHeight - crop1Top),
    },
    {
      left: crop2Left,
      top: crop2Top,
      width: Math.min(240, srcWidth - crop2Left),
      height: Math.min(160, srcHeight - crop2Top),
    },
  ];
}

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function assertAllSlugsMapped() {
  const missing = HASHTAG_CATEGORIES
    .map((cat) => cat.slug)
    .filter((slug) => !CATEGORY_PHOTO_SOURCES[slug]);

  if (missing.length > 0) {
    throw new Error(`Missing photo source mapping for: ${missing.join(', ')}`);
  }
}

async function fetchPicsumBuffer(photoId) {
  const url = `https://picsum.photos/id/${photoId}/${WIDTH}/${HEIGHT}`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Failed to fetch Picsum photo ${photoId}: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function fetchUnsplashBuffer(photoId) {
  const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${WIDTH}&h=${HEIGHT}&q=80`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Failed to fetch Unsplash photo ${photoId}: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function proceduralSvg(slug, title) {
  const palette = PROCEDURAL_PALETTES[slug] || {
    c1: '#1f2937',
    c2: '#6b7280',
    c3: '#374151',
  };
  const seed = hashSlug(slug);
  const x1 = 80 + (seed % 120);
  const y1 = 60 + (seed % 80);
  const x2 = 420 + (seed % 140);
  const y2 = 220 + (seed % 90);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.c1}"/>
      <stop offset="55%" stop-color="${palette.c2}"/>
      <stop offset="100%" stop-color="${palette.c3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="22%" r="58%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <ellipse cx="${x1}" cy="${y1}" rx="110" ry="78" fill="rgba(255,255,255,0.1)"/>
  <ellipse cx="${x2}" cy="${y2}" rx="95" ry="68" fill="rgba(0,0,0,0.12)"/>
  <rect x="0" y="${HEIGHT - 72}" width="${WIDTH}" height="72" fill="rgba(0,0,0,0.28)"/>
  <text x="20" y="${HEIGHT - 28}" fill="rgba(255,255,255,0.94)" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">${title}</text>
</svg>`;
}

async function loadSourceBuffer(slug, title) {
  const source = CATEGORY_PHOTO_SOURCES[slug];
  if (!source) {
    throw new Error(`No photo source for slug: ${slug}`);
  }

  const candidates = source.split('|').map((entry) => entry.trim()).filter(Boolean);
  const errors = [];

  for (const candidate of candidates) {
    try {
      let buffer;
      if (candidate.startsWith('unsplash:')) {
        buffer = await fetchUnsplashBuffer(candidate.replace('unsplash:', ''));
      } else if (candidate.startsWith('picsum:')) {
        buffer = await fetchPicsumBuffer(candidate.replace('picsum:', ''));
      } else if (candidate.startsWith('procedural:')) {
        const key = candidate.replace('procedural:', '');
        const svg = proceduralSvg(key, title);
        buffer = await sharp(Buffer.from(svg)).png().toBuffer();
      } else {
        throw new Error(`Unsupported source type: ${candidate}`);
      }
      return buffer;
    } catch (err) {
      errors.push(`${candidate}: ${err.message}`);
    }
  }

  throw new Error(`All photo sources failed for ${slug}\n${errors.join('\n')}`);
}

async function writeCollages(source, slug, outBase) {
  const meta = await sharp(source).metadata();
  const srcWidth = meta.width || WIDTH;
  const srcHeight = meta.height || HEIGHT;
  const coverPosition = getCoverPosition(slug);

  const main = await sharp(source)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: coverPosition })
    .webp({ quality: 76 })
    .toBuffer();

  const [crop1, crop2] = getCollageCrops(slug, srcWidth, srcHeight);

  const collage1 = await sharp(source)
    .extract(crop1)
    .resize(200, 130, { fit: 'cover', position: coverPosition })
    .webp({ quality: 72 })
    .toBuffer();

  const collage2 = await sharp(source)
    .extract(crop2)
    .resize(180, 120, { fit: 'cover', position: coverPosition })
    .webp({ quality: 72 })
    .toBuffer();

  await sharp(main).toFile(path.join(outBase, `${slug}.webp`));
  await sharp(collage1).toFile(path.join(outBase, `${slug}-1.webp`));
  await sharp(collage2).toFile(path.join(outBase, `${slug}-2.webp`));
}

async function main() {
  assertAllSlugsMapped();
  fs.mkdirSync(outDir, { recursive: true });

  const targetSlugs = process.env.CATEGORY_SLUGS
    ? process.env.CATEGORY_SLUGS.split(',').map((s) => s.trim()).filter(Boolean)
    : null;

  const categories = targetSlugs
    ? HASHTAG_CATEGORIES.filter((cat) => targetSlugs.includes(cat.slug))
    : HASHTAG_CATEGORIES;

  for (const cat of categories) {
    const source = await loadSourceBuffer(cat.slug, cat.title);
    await writeCollages(source, cat.slug, outDir);
  }

  console.log(`Generated ${categories.length} category photo sets in ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
