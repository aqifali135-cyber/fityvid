import { useState, useMemo } from 'react';
import { fetchVideoInfo } from '../api/client';
import { PLATFORM_ICONS } from '../constants/platforms';
import { detectPlatform, PLATFORM_NAMES } from '../utils/detectPlatform';
import VideoResult from './VideoResult';
import './DownloaderForm.css';

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
];

const FETCH_ERROR = 'Unable to fetch video details. Please try another public video link.';
const INVALID_LINK_MSG =
  'Please enter a valid YouTube, Facebook, TikTok, or Instagram link.';

function PlatformIcon({ platform }) {
  const svgProps = {
    width: 24,
    height: 24,
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

export default function DownloaderForm({ defaultPlatform = null }) {
  const [url, setUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(defaultPlatform);
  const [manualPlatform, setManualPlatform] = useState(Boolean(defaultPlatform));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const detectedFromUrl = useMemo(() => detectPlatform(url), [url]);

  const activePlatform = manualPlatform ? selectedPlatform : detectedFromUrl ?? selectedPlatform;

  const urlHint = useMemo(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      return { type: 'idle', text: 'Paste a supported video link to continue.' };
    }
    if (activePlatform) {
      return {
        type: 'detected',
        text: `Detected platform: ${PLATFORM_NAMES[activePlatform]}`,
      };
    }
    return { type: 'invalid', text: INVALID_LINK_MSG };
  }, [url, activePlatform]);

  function handleUrlChange(value) {
    setUrl(value);
    setManualPlatform(false);
    const detected = detectPlatform(value);
    setSelectedPlatform(detected);
    if (error && error !== FETCH_ERROR) {
      setError('');
    }
  }

  function handlePlatformSelect(platformId) {
    setSelectedPlatform(platformId);
    setManualPlatform(true);
    if (error === INVALID_LINK_MSG) {
      setError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a video URL.');
      return;
    }

    const platform = detectPlatform(url) || selectedPlatform;
    if (!platform) {
      setError(INVALID_LINK_MSG);
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await fetchVideoInfo(url, platform);

      if (!data?.success) {
        setError(data?.message || FETCH_ERROR);
        return;
      }

      if (!data.formats?.length) {
        setError('No downloadable format found for this video.');
        return;
      }

      setResult(data);
    } catch {
      setError(FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError('');
    setUrl('');
    setSelectedPlatform(defaultPlatform);
    setManualPlatform(Boolean(defaultPlatform));
  }

  return (
    <div className="downloader-form card">
      <div className="home-platform-options" role="group" aria-label="Supported platforms">
        {PLATFORMS.map((p) => {
          const isSelected = activePlatform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`home-platform-btn home-platform-btn--${p.id} ${isSelected ? 'selected' : ''}`}
              onClick={() => handlePlatformSelect(p.id)}
              aria-pressed={isSelected}
            >
              <span className="home-platform-btn__face">
                <span className="home-platform-btn__icon">
                  {isSelected ? (
                    <PlatformIcon platform={p.id} />
                  ) : (
                    <img
                      src={PLATFORM_ICONS[p.id]}
                      alt=""
                      className="home-platform-btn__icon-img"
                      width={24}
                      height={24}
                      loading="lazy"
                    />
                  )}
                </span>
                <span className="home-platform-btn__label">{p.name}</span>
                {isSelected && (
                  <span className="home-platform-btn__badge" aria-label="Selected">
                    ✓
                  </span>
                )}
                <span className="home-platform-btn__gloss" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="video-url">Video URL</label>
          <p
            className={`platform-detect-hint platform-detect-hint--${urlHint.type}`}
            role="status"
            aria-live="polite"
          >
            {urlHint.text}
          </p>
          <input
            id="video-url"
            type="url"
            className="input"
            placeholder="Paste YouTube, Facebook, TikTok, or Instagram video link..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={loading}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        {loading && (
          <p className="loading-text" role="status">
            Fetching video information…
          </p>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Please wait…' : 'Get Download Info'}
        </button>
      </form>
      <p className="downloader-notice">
        Please download only your own content or content you have permission to use.
        Only publicly accessible videos are supported. Private videos are not supported.
      </p>
      {result && !loading && <VideoResult data={result} onReset={handleReset} />}
    </div>
  );
}
