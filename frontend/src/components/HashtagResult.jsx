import { useState } from 'react';
import HashtagChip from './HashtagChip';
import './HashtagResult.css';

const PLATFORM_LABELS = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
};

const CONTENT_TYPE_LABELS = {
  post: 'Post',
  reel_short: 'Reel / Short',
  video: 'Video',
  story: 'Story',
  caption: 'Caption',
};

const GOAL_LABELS = {
  more_reach: 'More Reach',
  niche_audience: 'Niche Audience',
  brand_awareness: 'Brand Awareness',
  local_audience: 'Local Audience',
  trending_topic: 'Trending Topic',
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function HashtagResult({ data, onGenerateAgain }) {
  const [copySuccess, setCopySuccess] = useState('');
  const allText = data.hashtags.join(' ');
  const charCount = allText.length;
  const groups = data.groups?.length
    ? data.groups
    : [
        {
          key: 'all',
          label: 'Generated Hashtags',
          badge: null,
          hashtags: data.hashtags,
        },
      ];

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
          <span className="meta-pill">Platform: {PLATFORM_LABELS[data.platform] || data.platform}</span>
          {data.contentType && (
            <span className="meta-pill">
              Content: {CONTENT_TYPE_LABELS[data.contentType] || data.contentType}
            </span>
          )}
          {data.goal && (
            <span className="meta-pill">Goal: {GOAL_LABELS[data.goal] || data.goal}</span>
          )}
          <span className="meta-pill">Type: {data.type?.replace('_', ' ')}</span>
          <span className="meta-pill">Characters: {charCount}</span>
        </div>
      </div>

      <div className="result-actions result-actions-top">
        <button type="button" className="btn btn-primary" onClick={() => handleCopy(allText, 'all')}>
          Copy All Hashtags
        </button>
        {copySuccess === 'all' && <span className="copy-success">All hashtags copied!</span>}
        <button type="button" className="btn btn-secondary" onClick={onGenerateAgain}>
          Generate Again
        </button>
      </div>

      <div className="hashtag-groups">
        {groups.map((group) => {
          const groupText = group.hashtags.join(' ');
          return (
            <div key={group.key} className="hashtag-group card">
              <div className="hashtag-group-header">
                <div className="hashtag-group-title">
                  <h3>{group.label}</h3>
                  {group.badge && <span className="group-badge">{group.badge}</span>}
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm group-copy-btn"
                  onClick={() => handleCopy(groupText, group.key)}
                >
                  Copy
                </button>
              </div>
              {copySuccess === group.key && (
                <span className="copy-success group-copy-success">Group copied!</span>
              )}
              <div className="hashtag-chips">
                {group.hashtags.map((tag) => (
                  <HashtagChip key={`${group.key}-${tag}`} tag={tag} />
                ))}
              </div>
            </div>
          );
        })}
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
