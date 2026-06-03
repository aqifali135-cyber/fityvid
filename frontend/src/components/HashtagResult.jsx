import { useState } from 'react';
import HashtagChip from './HashtagChip';
import './HashtagResult.css';

const PLATFORM_LABELS = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
};

export default function HashtagResult({ data, onGenerateAgain }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const allText = data.hashtags.join(' ');
  const charCount = allText.length;

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(allText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="hashtag-result card" aria-live="polite">
      <div className="result-header">
        <h2>Generated Hashtags</h2>
        <div className="result-meta">
          <span className="meta-pill">Platform: {PLATFORM_LABELS[data.platform] || data.platform}</span>
          <span className="meta-pill">Type: {data.type?.replace('_', ' ')}</span>
          <span className="meta-pill">Characters: {charCount}</span>
        </div>
      </div>

      <div className="hashtag-chips">
        {data.hashtags.map((tag) => (
          <HashtagChip key={tag} tag={tag} />
        ))}
      </div>

      {data.captionIdea && (
        <div className="caption-idea">
          <h3>Suggested caption idea</h3>
          <p>{data.captionIdea}</p>
        </div>
      )}

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={copyAll}>
          Copy All Hashtags
        </button>
        {copySuccess && <span className="copy-success">Hashtags copied!</span>}
        <button type="button" className="btn btn-secondary" onClick={onGenerateAgain}>
          Generate Again
        </button>
      </div>

      <p className="hashtag-tip">
        Use relevant hashtags only. Avoid spammy or misleading hashtags.
      </p>
    </section>
  );
}
