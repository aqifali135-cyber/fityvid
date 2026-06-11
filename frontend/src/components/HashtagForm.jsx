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
            onChange={(e) => setTopic(e.target.value)}
            maxLength={80}
          />
          <div className="example-keywords">
            <span className="example-keywords-label">Try:</span>
            {EXAMPLE_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                type="button"
                className="example-keyword-chip"
                onClick={() => handleExampleClick(keyword)}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="label">Platform</span>
          <div className="option-grid platform-options">
            {PLATFORMS.map((p) => (
              <label key={p.value} className={`option-card ${platform === p.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="platform"
                  value={p.value}
                  checked={platform === p.value}
                  onChange={() => setPlatform(p.value)}
                />
                <span>{p.label}</span>
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
