import { useState } from 'react';
import { triggerDownload } from '../api/client';
import VideoThumbnail from './VideoThumbnail';
import './VideoResult.css';

const PLATFORM_LABELS = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
};

function getAudioStatus(fmt) {
  if (fmt.needsMerge && fmt.audioMergeSupported !== false) {
    return { label: 'Added during download', positive: true };
  }

  if (fmt.hasAudio === true || fmt.audioIncluded === true) {
    return { label: 'Included', positive: true };
  }

  if (fmt.hasAudio === false || fmt.audioIncluded === false) {
    return { label: fmt.audioNote || 'Not included', positive: false };
  }

  if (fmt.audioIncluded === null || fmt.hasAudio === null || fmt.hasAudio === undefined) {
    return { label: 'Unknown', positive: false };
  }

  return { label: fmt.audioNote || 'Not included', positive: false };
}

export default function VideoResult({ data, onReset }) {
  const [downloadWarning, setDownloadWarning] = useState('');
  const hasFormats = data.formats && data.formats.length > 0;

  function handleDownload(fmt) {
    const noAudio =
      (fmt.hasAudio === false || fmt.audioIncluded === false) && !fmt.needsMerge;
    if (noAudio) {
      setDownloadWarning('This video source does not provide audio.');
    } else {
      setDownloadWarning('');
    }
    triggerDownload(fmt.downloadUrl);
  }

  return (
    <section className="video-result card" aria-live="polite">
      <div className="video-result-header">
        <VideoThumbnail
          thumbnail={data.thumbnail}
          thumbnailDisplay={data.thumbnailDisplay}
          platform={PLATFORM_LABELS[data.platform] || data.platform}
        />
        <div className="video-meta">
          <h2 className="video-title">{data.title}</h2>
          <div className="video-meta-row">
            <span className="meta-badge">
              {PLATFORM_LABELS[data.platform] || data.platform}
            </span>
            {data.duration && <span className="meta-badge">Duration: {data.duration}</span>}
          </div>
        </div>
      </div>

      <h3 className="formats-heading">Available downloads</h3>

      {downloadWarning && (
        <p className="audio-warning" role="status">
          {downloadWarning}
        </p>
      )}

      {!hasFormats ? (
        <p className="no-formats">No downloadable format found for this video.</p>
      ) : (
        <ul className="format-list">
          {data.formats.map((fmt) => {
            const audioStatus = getAudioStatus(fmt);
            return (
            <li
              key={`${fmt.quality}-${fmt.format}-${fmt.formatId || ''}`}
              className="format-row card"
            >
              <div className="format-details">
                <span className="format-quality">Quality: {fmt.quality}</span>
                <span className="format-type">Format: {fmt.format?.toUpperCase()}</span>
                <span className="format-size">Size: {fmt.size || 'Size may vary'}</span>
                <span
                  className={`format-audio ${
                    audioStatus.positive ? 'format-audio--yes' : 'format-audio--no'
                  }`}
                >
                  Audio: {audioStatus.label}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary format-download-btn"
                onClick={() => handleDownload(fmt)}
              >
                Download
              </button>
            </li>
            );
          })}
        </ul>
      )}

      <p className="video-result-notice">
        Please download only your own content or content you have permission to use.
      </p>

      {onReset && (
        <button type="button" className="btn btn-secondary btn-block" onClick={onReset}>
          Check another video
        </button>
      )}
    </section>
  );
}
