import './PlatformCardIcon.css';

/**
 * Platform recognition icon — not affiliated with any platform.
 */
export default function PlatformCardIcon({ src, label, alt, iconBox = false }) {
  const altText = alt || (label ? `${label} video downloader` : 'Platform icon');

  const img = (
    <img
      src={src}
      alt={altText}
      className="platform-card-icon"
      width={iconBox ? 58 : 48}
      height={iconBox ? 58 : 48}
      loading="lazy"
      decoding="async"
      title={label ? `${label} (recognition only)` : undefined}
    />
  );

  if (iconBox) {
    return <div className="platform-icon-box">{img}</div>;
  }

  return <div className="platform-card-icon-wrap">{img}</div>;
}
