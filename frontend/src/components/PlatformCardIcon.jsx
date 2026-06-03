import './PlatformCardIcon.css';

/**
 * Platform recognition icon — not affiliated with any platform.
 */
export default function PlatformCardIcon({ src, label, alt }) {
  const altText = alt || (label ? `${label} video downloader` : 'Platform icon');
  return (
    <div className="platform-card-icon-wrap">
      <img
        src={src}
        alt={altText}
        className="platform-card-icon"
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
        title={label ? `${label} (recognition only)` : undefined}
      />
    </div>
  );
}
