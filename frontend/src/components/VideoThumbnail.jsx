import { useState } from 'react';
import { resolveApiUrl } from '../api/client';
import './VideoThumbnail.css';

export default function VideoThumbnail({ thumbnail, thumbnailDisplay, platform }) {
  const [failed, setFailed] = useState(false);

  const src = thumbnailDisplay
    ? resolveApiUrl(thumbnailDisplay)
    : thumbnail || '';

  if (!src || failed) {
    return (
      <div className="video-thumbnail-fallback" aria-label="Thumbnail not available">
        <span className="fallback-icon" aria-hidden="true">
          ▶
        </span>
        <span className="fallback-text">Thumbnail not available</span>
        {platform && <span className="fallback-platform">{platform}</span>}
      </div>
    );
  }

  return (
    <img
      className="video-thumbnail"
      src={src}
      alt=""
      loading="lazy"
      width={320}
      height={180}
      onError={() => setFailed(true)}
    />
  );
}
