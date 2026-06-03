import { useState } from 'react';
import './HashtagChip.css';

export default function HashtagChip({ tag, onCopy }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(tag);
      setCopied(true);
      onCopy?.(tag);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <span className="hashtag-chip">
      <span className="hashtag-text">{tag}</span>
      <button
        type="button"
        className="hashtag-copy-btn"
        onClick={handleCopy}
        aria-label={`Copy ${tag}`}
        title={copied ? 'Copied!' : 'Copy'}
      >
        {copied ? '✓' : '📋'}
      </button>
    </span>
  );
}
