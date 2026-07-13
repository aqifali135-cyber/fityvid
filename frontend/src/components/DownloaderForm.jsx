import { useState, useMemo } from 'react';
import { fetchVideoInfo } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CREDIT_COST, CREDIT_SPENT_MESSAGE } from '../constants/credits';
import CreditNotice from './CreditNotice';
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

const HERO_ICONS = {
  youtube: '/icons/youtube.png?v=4',
  tiktok: '/icons/tiktok.png?v=4',
  instagram: '/icons/instagram.png?v=4',
  facebook: '/icons/facebook.png?v=4',
};

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

export default function DownloaderForm({ defaultPlatform = null, variant = 'default' }) {
  const isHero = variant === 'hero';
  const { isAuthenticated, user, spendCredits } = useAuth();
  const [url, setUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(defaultPlatform);
  const [manualPlatform, setManualPlatform] = useState(Boolean(defaultPlatform));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creditNotice, setCreditNotice] = useState(null);
  const [creditSuccess, setCreditSuccess] = useState('');
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
    setCreditNotice(null);
    setCreditSuccess('');
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

    if (!isAuthenticated) {
      setCreditNotice('login');
      return;
    }

    if ((user?.creditBalance ?? 0) < CREDIT_COST) {
      setCreditNotice('insufficient');
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

      await spendCredits('video_downloader', 'Video download search');
      setCreditSuccess(CREDIT_SPENT_MESSAGE);
      setResult(data);
    } catch (err) {
      if (err.data?.code === 'INSUFFICIENT_CREDITS') {
        setCreditNotice('insufficient');
      } else {
        setError(FETCH_ERROR);
      }
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

  async function handlePasteClick() {
    try {
      const text = await navigator.clipboard.readText();
      if (text?.trim()) {
        handleUrlChange(text.trim());
      }
    } catch {
      /* clipboard unavailable */
    }
  }

  function renderPlatformOptions() {
    return PLATFORMS.map((p) => {
      const isSelected = activePlatform === p.id;

      if (isHero) {
        return (
          <button
            key={p.id}
            type="button"
            className={`hero-platform-btn ${isSelected ? 'hero-platform-btn--selected' : ''}`}
            onClick={() => handlePlatformSelect(p.id)}
            aria-pressed={isSelected}
          >
            <span className="platform-icon-circle">
              <img
                src={HERO_ICONS[p.id]}
                alt={p.name}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="hero-platform-btn__label">{p.name}</span>
          </button>
        );
      }

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
    });
  }

  const platformGroup = (
    <div
      className={isHero ? 'hero-platform-row' : 'home-platform-options'}
      role="group"
      aria-label="Supported platforms"
    >
      {renderPlatformOptions()}
    </div>
  );

  const formBlock = (
    <form className={isHero ? 'hero-downloader-form' : undefined} onSubmit={handleSubmit}>
      <div className="form-group">
        <label className={`label ${isHero ? 'visually-hidden' : ''}`} htmlFor="video-url">
          Video URL
        </label>
        {!isHero && (
          <p
            className={`platform-detect-hint platform-detect-hint--${urlHint.type}`}
            role="status"
            aria-live="polite"
          >
            {urlHint.text}
          </p>
        )}
        {isHero && urlHint.type !== 'idle' && (
          <p
            className={`platform-detect-hint platform-detect-hint--${urlHint.type} platform-detect-hint--hero`}
            role="status"
            aria-live="polite"
          >
            {urlHint.text}
          </p>
        )}
        <div className={isHero ? 'hero-input-row' : undefined}>
          {isHero && (
            <span className="hero-input-row__link-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M10 13a5 5 0 0 0 7.54.54l1.92-1.92a5 5 0 0 0-7.07-7.07L11 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 11a5 5 0 0 0-7.54-.54L4.54 12.4a5 5 0 0 0 7.07 7.07L13 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
          <input
            id="video-url"
            type="url"
            className="input"
            placeholder={
              isHero
                ? 'Paste video link here...'
                : 'Paste YouTube, Facebook, TikTok, or Instagram video link...'
            }
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={loading}
          />
          {isHero && (
            <>
              <button
                type="button"
                className="hero-paste-button"
                onClick={handlePasteClick}
                disabled={loading}
              >
                <span className="hero-paste-button__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <rect x="8" y="8" width="11" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M16 8V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Paste
              </button>
              <button type="submit" className="download-submit-button" disabled={loading}>
                {loading ? 'Please wait…' : 'Get Download Info'}
                {!loading && (
                  <span className="download-submit-button__arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
      <CreditNotice type={creditNotice} />
      <CreditNotice type={creditSuccess ? 'success' : null} message={creditSuccess} />
      {loading && (
        <p className="loading-text" role="status">
          Fetching video information…
        </p>
      )}
      {!isHero && (
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Please wait…' : 'Get Download Info'}
        </button>
      )}
    </form>
  );

  const noticeBlock = isHero ? (
    <p className="downloader-notice downloader-notice--hero">
      <span className="downloader-notice__check" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="currentColor"
            d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
          />
        </svg>
      </span>
      Please download only your own content or content you have permission to use.
    </p>
  ) : (
    <p className="downloader-notice">
      Please download only your own content or content you have permission to use.
      Only publicly accessible videos are supported. Private videos are not supported.
    </p>
  );

  if (isHero) {
    return (
      <div className="downloader-form downloader-form--hero">
        {platformGroup}
        <div className="hero-form-stack">
          {formBlock}
          {noticeBlock}
          {result && !loading && <VideoResult data={result} onReset={handleReset} />}
        </div>
      </div>
    );
  }

  return (
    <div className="downloader-form card">
      {platformGroup}
      {formBlock}
      {noticeBlock}
      {result && !loading && <VideoResult data={result} onReset={handleReset} />}
    </div>
  );
}
