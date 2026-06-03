import { useState, useMemo } from 'react';
import { fetchVideoInfo } from '../api/client';
import { detectPlatform, PLATFORM_NAMES } from '../utils/detectPlatform';
import VideoResult from './VideoResult';
import './DownloaderForm.css';

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', color: '#ff0000', bg: '#fff1f1' },
  { id: 'facebook', name: 'Facebook', color: '#1877f2', bg: '#eff6ff' },
  { id: 'tiktok', name: 'TikTok', color: '#111827', bg: '#f3f4f6' },
  { id: 'instagram', name: 'Instagram', color: '#e1306c', bg: '#fdf2f8' },
];

const FETCH_ERROR = 'Unable to fetch video details. Please try another public video link.';
const INVALID_LINK_MSG =
  'Please enter a valid YouTube, Facebook, TikTok, or Instagram link.';

export default function DownloaderForm() {
  const [url, setUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [manualPlatform, setManualPlatform] = useState(false);
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
    setSelectedPlatform(null);
    setManualPlatform(false);
  }

  return (
    <div className="downloader-form card">
      <div className="platform-badges" role="group" aria-label="Supported platforms">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`platform-badge platform-badge--${p.id} ${
              activePlatform === p.id ? 'platform-badge--active' : ''
            }`}
            style={{
              '--badge-color': p.color,
              '--badge-bg': p.bg,
            }}
            onClick={() => handlePlatformSelect(p.id)}
            aria-pressed={activePlatform === p.id}
          >
            {p.name}
          </button>
        ))}
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
