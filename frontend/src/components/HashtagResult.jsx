import { useState } from 'react';
import HashtagChip from './HashtagChip';
import { RESULT_PLATFORMS } from '../utils/platformHashtagGenerator';
import './HashtagResult.css';

const GOAL_LABELS = {
  more_reach: 'More Reach',
  niche_audience: 'Niche Audience',
  brand_awareness: 'Brand Awareness',
  local_audience: 'Local Audience',
  trending_topic: 'Trending Topic',
};

function PlatformResultIcon({ platform }) {
  const svgProps = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
  };

  switch (platform) {
    case 'youtube':
      return (
        <svg {...svgProps}>
          <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.948C18.254 5.667 12 5.667 12 5.667s-6.254 0-7.86.386A2.75 2.75 0 0 0 2.2 8.001 28.3 28.3 0 0 0 1.818 12a28.3 28.3 0 0 0 .382 3.999 2.75 2.75 0 0 0 1.94 1.948C5.746 18.333 12 18.333 12 18.333s6.254 0 7.86-.386a2.75 2.75 0 0 0 1.94-1.948A28.3 28.3 0 0 0 22.182 12a28.3 28.3 0 0 0-.382-3.999zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...svgProps}>
          <path d="M16.6 5.82c.81.96 2 1.57 3.33 1.63v3.05a5.48 5.48 0 0 1-3.33-.98v6.35a4.97 4.97 0 1 1-4.97-4.97c.26 0 .51.02.76.06v3.13a1.84 1.84 0 1 0 1.3 1.76V5.82h2.91z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...svgProps}>
          <path d="M13.5 22v-8h2.7l.4-3.2H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v2.5H7.5v3.2h2.1V22h3.9z" />
        </svg>
      );
    case 'snapchat':
      return (
        <svg {...svgProps}>
          <path d="M12 2c2.8 0 5 2.2 5 5.1 0 1.1-.4 2.1-1 2.9 2.2.6 4 2.6 4.5 5 0 .4-.3.7-.7.7-.5 0-.9-.3-1.1-.7-.4 1.2-1.6 2-3 2.1l.8 2.4c.1.3 0 .6-.3.8l-2.2 1.4c-.3.2-.7.1-.9-.2L12 20l-1.1 1.5c-.2.3-.6.4-.9.2l-2.2-1.4c-.3-.2-.4-.5-.3-.8l.8-2.4c-1.4-.1-2.6-.9-3-2.1-.2.4-.6.7-1.1.7-.4 0-.7-.3-.7-.7.5-2.4 2.3-4.4 4.5-5-.6-.8-1-1.8-1-2.9C7 4.2 9.2 2 12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function HashtagResult({ data, onGenerateAgain }) {
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [copySuccess, setCopySuccess] = useState('');

  const platformHashtags = data.platformHashtags || {
    instagram: data.hashtags || [],
  };

  const activeTags = platformHashtags[activePlatform] || [];
  const activeText = activeTags.join(' ');
  const charCount = activeText.length;
  const activeLabel = RESULT_PLATFORMS.find((p) => p.id === activePlatform)?.label || 'Platform';

  const allPlatformsText = RESULT_PLATFORMS.map((platform) => {
    const tags = platformHashtags[platform.id] || [];
    return `${platform.label} Hashtags\n${tags.join(' ')}`;
  }).join('\n\n');

  async function handleCopy(text, label) {
    const ok = await copyText(text);
    if (ok) {
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2500);
    }
  }

  return (
    <section className="hashtag-result card" aria-live="polite">
      <div className="result-header">
        <h2>Generated Hashtags</h2>
        <div className="result-meta">
          <span className="meta-pill">Platform: All Platforms</span>
          {data.goal && (
            <span className="meta-pill">Goal: {GOAL_LABELS[data.goal] || data.goal}</span>
          )}
          <span className="meta-pill">Type: {data.type?.replace(/_/g, ' ') || 'mixed'}</span>
          <span className="meta-pill">Characters: {charCount}</span>
        </div>
      </div>

      <div className="result-platform-tabs" role="tablist" aria-label="Platform hashtags">
        {RESULT_PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            role="tab"
            aria-selected={activePlatform === platform.id}
            className={`result-platform-tab${activePlatform === platform.id ? ' result-platform-tab--active' : ''}`}
            onClick={() => setActivePlatform(platform.id)}
          >
            <span className="result-platform-tab__icon">
              <PlatformResultIcon platform={platform.id} />
            </span>
            <span>{platform.label}</span>
          </button>
        ))}
      </div>

      <div className="result-actions result-actions-top">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleCopy(activeText, 'platform')}
        >
          Copy {activeLabel} Hashtags
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => handleCopy(allPlatformsText, 'all-platforms')}
        >
          Copy All Platforms
        </button>
        {copySuccess === 'platform' && (
          <span className="copy-success">{activeLabel} hashtags copied!</span>
        )}
        {copySuccess === 'all-platforms' && (
          <span className="copy-success">All platform hashtags copied!</span>
        )}
        <button type="button" className="btn btn-secondary" onClick={onGenerateAgain}>
          Generate Again
        </button>
      </div>

      <div className="hashtag-platform-panel">
        <div className="hashtag-platform-panel__header">
          <h3>{activeLabel} Hashtags</h3>
          <button
            type="button"
            className="btn btn-outline btn-sm group-copy-btn"
            onClick={() => handleCopy(activeText, 'platform')}
          >
            Copy
          </button>
        </div>
        <div className="hashtag-chips">
          {activeTags.map((tag) => (
            <HashtagChip key={`${activePlatform}-${tag}`} tag={tag} />
          ))}
        </div>
      </div>

      {data.captionIdea && (
        <div className="caption-idea">
          <h3>Suggested caption idea</h3>
          <p>{data.captionIdea}</p>
        </div>
      )}

      <p className="hashtag-tip">
        Use relevant hashtags only. Avoid spammy or misleading hashtags.
      </p>
    </section>
  );
}
