import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { generateAllPlatformHashtags } from '../utils/platformHashtagGenerator';
import HashtagResult from './HashtagResult';
import './HashtagForm.css';

const MODES = [
  { id: 'keyword', label: 'Generate by Keyword' },
  { id: 'photo', label: 'Generate by Photo' },
  { id: 'url', label: 'Generate by Post URL' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'it', label: 'Italian' },
  { value: 'ru', label: 'Russian' },
  { value: 'fr', label: 'French' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ur', label: 'Urdu' },
  { value: 'ar', label: 'Arabic' },
  { value: 'tr', label: 'Turkish' },
];

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
];

const DEFAULT_PLATFORM = 'instagram';
const DEFAULT_CONTENT_TYPE = 'post';
const DEFAULT_GOAL = 'more_reach';
const DEFAULT_TYPE = 'mixed';
const DEFAULT_COUNT = 30;
const DEFAULT_LANGUAGE = 'en';

function ModeIcon({ mode }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, 'aria-hidden': true };

  if (mode === 'keyword') {
    return (
      <svg {...props}>
        <path d="M4 7h16M4 12h10M4 17h14" strokeLinecap="round" />
      </svg>
    );
  }
  if (mode === 'photo') {
    return (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L7 17" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M10 13a5 5 0 0 1 7 0" strokeLinecap="round" />
      <path d="M14 10V7a2 2 0 1 1 4 0v3" strokeLinecap="round" />
      <rect x="3" y="11" width="18" height="10" rx="2" />
    </svg>
  );
}

const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function detectPlatformFromUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    if (host.includes('instagram.com')) return 'instagram';
    if (host.includes('tiktok.com')) return 'tiktok';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
    if (host.includes('facebook.com') || host.includes('fb.watch')) return 'facebook';
    return null;
  } catch {
    return null;
  }
}

function buildTopicFromUrl(url) {
  try {
    const parsed = new URL(url);
    const platform = detectPlatformFromUrl(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const slug = parts[parts.length - 1] || '';
    const cleanSlug = slug.replace(/[-_]/g, ' ').replace(/[^\w\s]/g, '').trim();

    if (cleanSlug.length > 2) {
      return platform ? `${platform} ${cleanSlug}` : cleanSlug;
    }
    return platform ? `${platform} post` : 'social media post';
  } catch {
    return '';
  }
}

function cleanFileName(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const HashtagForm = forwardRef(function HashtagForm({ onTopicChange }, ref) {
  const [mode, setMode] = useState('keyword');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [topic, setTopic] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  useImperativeHandle(ref, () => ({
    setTopicAndFocus(value) {
      setMode('keyword');
      setTopic(value);
      setError('');
      onTopicChange?.(value);
      requestAnimationFrame(() => {
        document.getElementById('topic')?.focus({ preventScroll: true });
      });
    },
    getTopic() {
      return topic;
    },
  }));

  async function runGeneration(generationTopic) {
    setError('');
    setResult(null);

    if (!generationTopic.trim()) {
      setError('Please enter a topic or description.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateAllPlatformHashtags({
        topic: generationTopic.trim(),
        contentType: DEFAULT_CONTENT_TYPE,
        goal: DEFAULT_GOAL,
        type: DEFAULT_TYPE,
        count: DEFAULT_COUNT,
        language,
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

  function handleSubmit(e) {
    e.preventDefault();

    if (mode === 'keyword') {
      runGeneration(topic);
      return;
    }

    if (mode === 'photo') {
      if (!photoFile) {
        setError('Please upload a photo (JPG, PNG, or WebP).');
        return;
      }
      const photoTopic = photoDescription.trim() || cleanFileName(photoFile.name);
      if (!photoTopic) {
        setError('Add a short description for better hashtag results.');
        return;
      }
      runGeneration(photoTopic);
      return;
    }

    if (!postUrl.trim()) {
      setError('Please enter a post URL.');
      return;
    }
    if (!isValidHttpUrl(postUrl.trim())) {
      setError('Please enter a valid URL (Instagram, TikTok, YouTube, or Facebook).');
      return;
    }
    const urlTopic = buildTopicFromUrl(postUrl.trim());
    runGeneration(urlTopic);
  }

  function handleGenerateAgain() {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleTopicChange(e) {
    const value = e.target.value;
    setTopic(value);
    setError('');
    onTopicChange?.(value);
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setError('Please upload JPG, PNG, or WebP images only.');
      return;
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  }

  function handleUrlChange(e) {
    const value = e.target.value;
    setPostUrl(value);
    setError('');
    const detected = detectPlatformFromUrl(value.trim());
    if (detected) setPlatform(detected);
  }

  const detectedUrlPlatform = postUrl.trim() ? detectPlatformFromUrl(postUrl.trim()) : null;

  return (
    <div className="hashtag-form-wrapper" id="hashtag-generator-form">
      <div className="hashtag-generator-panel card hashtag-form--premium">
        <div className="hashtag-mode-tabs" role="tablist" aria-label="Hashtag generator mode">
          {MODES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              className={`hashtag-mode-tab${mode === tab.id ? ' hashtag-mode-tab--active' : ''}`}
              onClick={() => {
                setMode(tab.id);
                setError('');
              }}
            >
              <span className="hashtag-mode-tab__icon">
                <ModeIcon mode={tab.id} />
              </span>
              <span className="hashtag-mode-tab__label">{tab.label}</span>
            </button>
          ))}
        </div>

        <form className="hashtag-form" onSubmit={handleSubmit}>
          <div className="hashtag-form-bar">
            {mode === 'keyword' && (
              <input
                id="topic"
                type="text"
                className="input hashtag-form-bar__input"
                placeholder="Example: Paris, France, Girl in Paris, Travelling with Dog"
                value={topic}
                onChange={handleTopicChange}
                maxLength={80}
              />
            )}

            {mode === 'photo' && (
              <div className="hashtag-photo-bar">
                <label className="hashtag-photo-upload">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hashtag-photo-upload__input"
                    onChange={handlePhotoChange}
                  />
                  <span className="hashtag-photo-upload__btn">Upload Photo</span>
                </label>
                <input
                  type="text"
                  className="input hashtag-form-bar__input"
                  placeholder="Describe your photo, e.g. beach sunset, gym workout, food plate"
                  value={photoDescription}
                  onChange={(e) => {
                    setPhotoDescription(e.target.value);
                    setError('');
                  }}
                  maxLength={120}
                />
              </div>
            )}

            {mode === 'url' && (
              <>
                <input
                  id="post-url"
                  type="url"
                  className="input hashtag-form-bar__input"
                  placeholder="https://www.instagram.com/p/example/"
                  value={postUrl}
                  onChange={handleUrlChange}
                  inputMode="url"
                />
                <label className="hashtag-language-field">
                  <span className="sr-only">Language</span>
                  <select
                    className="input hashtag-language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <button type="submit" className="hashtag-generate-btn" disabled={loading}>
              <span>{loading ? 'Generating...' : 'Generate Hashtags'}</span>
              <span className="hashtag-generate-btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          {mode === 'photo' && (
            <div className="hashtag-photo-meta">
              {photoPreview ? (
                <img
                  className="hashtag-photo-preview"
                  src={photoPreview}
                  alt="Selected upload preview"
                  width={120}
                  height={90}
                />
              ) : (
                <p className="hashtag-photo-hint">Accepted formats: JPG, PNG, WebP</p>
              )}
              <p className="hashtag-photo-helper">
                Add a short description for better hashtag results. Hashtags are generated from your
                description, not image analysis.
              </p>
            </div>
          )}

          {mode === 'url' && detectedUrlPlatform && (
            <p className="hashtag-url-detected">
              Detected platform: <strong>{PLATFORMS.find((p) => p.value === detectedUrlPlatform)?.label}</strong>
            </p>
          )}

          {error && <p className="error-text">{error}</p>}
        </form>
      </div>

      {result && (
        <div id="hashtag-results">
          <HashtagResult data={result} onGenerateAgain={handleGenerateAgain} />
        </div>
      )}
    </div>
  );
});

export default HashtagForm;
