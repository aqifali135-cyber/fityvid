import { useState } from 'react';
import { fetchTiktokVideoDownload, triggerDownload } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CREDIT_COST, CREDIT_SPENT_MESSAGE } from '../constants/credits';
import CreditNotice from './CreditNotice';
import VideoThumbnail from './VideoThumbnail';
import { detectPlatform } from '../utils/detectPlatform';

const FETCH_ERROR = 'Unable to fetch video details. Please try another public TikTok video link.';
const INVALID_TIKTOK_MSG = 'Please enter a valid public TikTok video link.';

function PasteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="11" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 8V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L11 12.59V4a1 1 0 0 1 1-1z"
      />
      <path fill="currentColor" d="M5 18a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export default function TiktokDownloaderPanel() {
  const { isAuthenticated, user, spendCredits } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creditNotice, setCreditNotice] = useState(null);
  const [creditSuccess, setCreditSuccess] = useState('');
  const [result, setResult] = useState(null);

  function handleUrlChange(value) {
    setUrl(value);
    if (error) setError('');
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCreditNotice(null);
    setCreditSuccess('');
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a TikTok video URL.');
      return;
    }

    const detected = detectPlatform(trimmed);
    if (detected && detected !== 'tiktok') {
      setError(INVALID_TIKTOK_MSG);
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
      const { data } = await fetchTiktokVideoDownload(trimmed);

      if (!data?.success || !data?.data?.videoUrl) {
        setError(data?.message || FETCH_ERROR);
        return;
      }

      await spendCredits('video_downloader', 'TikTok video download');
      setCreditSuccess(CREDIT_SPENT_MESSAGE);
      setResult(data.data);
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
    setCreditNotice(null);
    setCreditSuccess('');
  }

  return (
    <div className="ttd-panel">
      <form className="ttd-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="tiktok-video-url">
          TikTok video URL
        </label>
        <div className="ttd-input-row">
          <input
            id="tiktok-video-url"
            type="url"
            className="ttd-input"
            placeholder="Paste TikTok video link here..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="button"
            className="ttd-paste-btn"
            onClick={handlePasteClick}
            disabled={loading}
          >
            <PasteIcon />
            Paste
          </button>
          <button type="submit" className="ttd-download-btn" disabled={loading}>
            {loading ? 'Please wait…' : 'Download'}
            {!loading && (
              <span className="ttd-download-btn__icon" aria-hidden="true">
                <DownloadIcon />
              </span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <p className="ttd-error" role="alert">
          {error}
        </p>
      )}
      <CreditNotice type={creditNotice} />
      <CreditNotice type={creditSuccess ? 'success' : null} message={creditSuccess} />
      {loading && (
        <p className="ttd-loading" role="status">
          Fetching TikTok video information…
        </p>
      )}

      <p className="ttd-permission" role="note">
        Please download only your own content or content you have permission to use. Private videos
        are not supported.
      </p>

      {result && !loading && (
        <section className="ttd-result" aria-live="polite">
          <div className="ttd-result__media">
            <VideoThumbnail thumbnail={result.thumbnail || ''} platform="TikTok" />
          </div>
          <div className="ttd-result__body">
            {result.title ? (
              <h2 className="ttd-result__title">{result.title}</h2>
            ) : (
              <h2 className="ttd-result__title">TikTok video</h2>
            )}
            <div className="ttd-result__actions">
              {result.videoUrl && (
                <button
                  type="button"
                  className="ttd-result__btn ttd-result__btn--mp4"
                  onClick={() => triggerDownload(result.videoUrl)}
                >
                  <DownloadIcon />
                  Download MP4
                </button>
              )}
              {result.audioUrl && (
                <button
                  type="button"
                  className="ttd-result__btn ttd-result__btn--mp3"
                  onClick={() => triggerDownload(result.audioUrl)}
                >
                  <DownloadIcon />
                  Download MP3
                </button>
              )}
            </div>
            <button type="button" className="ttd-result__reset" onClick={handleReset}>
              Check another video
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
