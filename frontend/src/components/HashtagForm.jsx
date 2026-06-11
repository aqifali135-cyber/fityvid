import { useState } from 'react';
import { generateHashtags } from '../api/client';
import HashtagResult from './HashtagResult';
import './HashtagForm.css';

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
];

function PlatformIcon({ platform }) {
  const svgProps = {
    width: 22,
    height: 22,
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
    default:
      return null;
  }
}

const CONTENT_TYPES = [
  { value: 'post', label: 'Post' },
  { value: 'reel_short', label: 'Reel / Short' },
  { value: 'video', label: 'Video' },
  { value: 'story', label: 'Story' },
  { value: 'caption', label: 'Caption' },
];

const HASHTAG_GOALS = [
  { value: 'more_reach', label: 'More Reach' },
  { value: 'niche_audience', label: 'Niche Audience' },
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'local_audience', label: 'Local Audience' },
  { value: 'trending_topic', label: 'Trending Topic' },
];

const TYPES = [
  { value: 'trending', label: 'Trending' },
  { value: 'niche', label: 'Niche' },
  { value: 'viral', label: 'Viral' },
  { value: 'low_competition', label: 'Low Competition' },
  { value: 'mixed', label: 'Mixed' },
];

const COUNTS = [10, 20, 30, 50];

const EXAMPLE_KEYWORDS = [
  'fitness reels',
  'food vlog',
  'gaming shorts',
  'travel video',
  'small business tips',
];

export default function HashtagForm() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('');
  const [contentType, setContentType] = useState('post');
  const [goal, setGoal] = useState('more_reach');
  const [type, setType] = useState('mixed');
  const [count, setCount] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    if (!platform) {
      setError('Please select a platform.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateHashtags({
        topic: topic.trim(),
        platform,
        contentType,
        goal,
        type,
        count,
      });
      if (!data.success) {
        setError('Unable to generate hashtags. Please try again.');
        return;
      }
      setResult(data);
      setTimeout(() => {
        document.getElementById('hashtag-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Unable to generate hashtags. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleGenerateAgain() {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleExampleClick(keyword) {
    setTopic(keyword);
    setError('');
  }

  function handleTopicChange(e) {
    setTopic(e.target.value);
    setError('');
  }

  const activeExample = EXAMPLE_KEYWORDS.find((keyword) => keyword === topic.trim()) ?? '';

  return (
    <div className="hashtag-form-wrapper">
      <form className="hashtag-form card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="topic">Topic / Keyword</label>
          <input
            id="topic"
            type="text"
            className="input"
            placeholder="Enter topic like fitness, cooking, travel, gaming, fashion..."
            value={topic}
            onChange={handleTopicChange}
            maxLength={80}
          />
          <div className="example-keywords">
            <span className="example-keywords-label">Try:</span>
            {EXAMPLE_KEYWORDS.map((keyword) => {
              const isSelected = activeExample === keyword;
              return (
                <button
                  key={keyword}
                  type="button"
                  className={`example-keyword-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleExampleClick(keyword)}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <span className="example-keyword-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                  {keyword}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <span className="label">Platform</span>
          <div className="platform-options">
            {PLATFORMS.map((p) => (
              <label
                key={p.value}
                className={`platform-btn platform-btn--${p.value} ${platform === p.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="platform"
                  value={p.value}
                  checked={platform === p.value}
                  onChange={() => setPlatform(p.value)}
                />
                <span className="platform-btn__face">
                  <span className="platform-btn__icon">
                    <PlatformIcon platform={p.value} />
                  </span>
                  <span className="platform-btn__label">{p.label}</span>
                  {platform === p.value && (
                    <span className="platform-btn__badge" aria-label="Selected">
                      ✓
                    </span>
                  )}
                  <span className="platform-btn__gloss" aria-hidden="true" />
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="label">Content Type</span>
          <div className="option-grid type-options">
            {CONTENT_TYPES.map((item) => (
              <label
                key={item.value}
                className={`option-chip ${contentType === item.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="contentType"
                  value={item.value}
                  checked={contentType === item.value}
                  onChange={() => setContentType(item.value)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="label">Hashtag Goal</span>
          <div className="option-grid goal-options">
            {HASHTAG_GOALS.map((item) => (
              <label key={item.value} className={`option-chip ${goal === item.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="goal"
                  value={item.value}
                  checked={goal === item.value}
                  onChange={() => setGoal(item.value)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="label">Hashtag Type</span>
          <div className="option-grid type-options">
            {TYPES.map((t) => (
              <label key={t.value} className={`option-chip ${type === t.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={type === t.value}
                  onChange={() => setType(t.value)}
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="label">Number of Hashtags</span>
          <div className="option-grid count-options">
            {COUNTS.map((n) => (
              <label key={n} className={`option-chip ${count === n ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="count"
                  value={n}
                  checked={count === n}
                  onChange={() => setCount(n)}
                />
                <span>{n}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Hashtags'}
        </button>

        <p className="hashtag-form-tip">
          Use relevant hashtags only. Avoid spammy or misleading hashtags.
        </p>
      </form>

      {result && (
        <div id="hashtag-results">
          <HashtagResult data={result} onGenerateAgain={handleGenerateAgain} />
        </div>
      )}
    </div>
  );
}
