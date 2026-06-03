import { Link } from 'react-router-dom';
import logoMark from '../assets/fityvid-logo.png';
import './Logo.css';

const SIZES = {
  nav: { height: 44, maxWidth: 52 },
  footer: { height: 40, maxWidth: 48 },
  hero: { height: 48, maxWidth: 56 },
  icon: { height: 44, maxWidth: 52 },
};

/**
 * @param {'nav' | 'footer' | 'hero' | 'icon'} size
 * @param {boolean} showText - show "FityVid" beside icon (logo has no wordmark)
 */
export default function Logo({
  size = 'nav',
  showText = false,
  linkToHome = true,
  className = '',
  onClick,
}) {
  const dims = SIZES[size] ?? SIZES.nav;

  const img = (
    <span className="logo-mark-wrap">
      <img
        src={logoMark}
        alt=""
        role="presentation"
        className={`fityvid-logo fityvid-logo--${size} ${className}`.trim()}
        height={dims.height}
        decoding="async"
      />
    </span>
  );

  const content = showText ? (
    <span className="logo-brand">
      {img}
      <span className="logo-text">FityVid</span>
    </span>
  ) : (
    img
  );

  if (!linkToHome) {
    return <span className="logo-wrap">{content}</span>;
  }

  return (
    <Link to="/" className="logo-link" aria-label="FityVid home" onClick={onClick}>
      {content}
    </Link>
  );
}
