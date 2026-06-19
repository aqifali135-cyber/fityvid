import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

const FOOTER_SOCIAL_ICONS = {
  facebook: '/icons/facebook.png',
  instagram: '/icons/instagram.png',
  tiktok: '/icons/tiktok.png',
  youtube: '/icons/youtube.png',
};

const SITE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/instagram-reels-downloader', label: 'Instagram Reels Downloader' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About Us' },
];

const HASHTAG_LINKS = [
  { to: '/hashtag-generator', label: 'Hashtag Generator' },
  { to: '/tiktok-hashtag-generator', label: 'TikTok Hashtag Generator' },
  { to: '/instagram-hashtag-generator', label: 'Instagram Hashtag Generator' },
  { to: '/youtube-hashtag-generator', label: 'YouTube Hashtag Generator' },
  { to: '/facebook-hashtag-generator', label: 'Facebook Hashtag Generator' },
];

const LEGAL_LINKS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-and-conditions', label: 'Terms & Conditions' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/dmca', label: 'DMCA' },
];

const SOCIAL_BUTTONS = [
  { to: '/facebook-video-downloader', label: 'Facebook', icon: 'facebook' },
  { to: '/instagram-video-downloader', label: 'Instagram', icon: 'instagram' },
  { to: '/tiktok-video-downloader', label: 'TikTok', icon: 'tiktok' },
  { to: '/youtube-video-downloader', label: 'YouTube', icon: 'youtube' },
];

function HomeHeadingIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true">
      <path fill="currentColor" d="M12 3 3 10.5V20h6v-6h6v6h6v-9.5L12 3z" />
    </svg>
  );
}

function HashtagHeadingIcon() {
  return (
    <img
      src="/icons/hastage.png"
      alt=""
      width={28}
      height={28}
      className="footer-heading-icon-image"
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  );
}

function ShieldHeadingIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5v6c0 5.25 3.4 10.15 8 11 4.6-.85 8-5.75 8-11V5l-8-3z"
      />
    </svg>
  );
}

function ShieldSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5v6c0 5.25 3.4 10.15 8 11 4.6-.85 8-5.75 8-11V5l-8-3z"
      />
    </svg>
  );
}

function FooterNavColumn({ title, links, ariaLabel, headingIcon, headingTone, iconBoxClassName = '' }) {
  return (
    <nav className="footer-nav-col" aria-label={ariaLabel}>
      <h4 className="footer-nav-col__title">
        <span
          className={`footer-nav-col__icon footer-nav-col__icon--${headingTone}${iconBoxClassName ? ` ${iconBoxClassName}` : ''}`}
        >
          {headingIcon}
        </span>
        {title}
      </h4>
      <ul>
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className="footer-link-row">
              <span>{label}</span>
              <span className="footer-link-row__chev" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialButton({ to, label, icon }) {
  return (
    <Link to={to} className="footer-social-icon-link" aria-label={label}>
      <img
        src={FOOTER_SOCIAL_ICONS[icon]}
        alt={label}
        width={32}
        height={32}
        className="footer-social-icon-image"
        loading="lazy"
        decoding="async"
      />
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-card">
          <div className="footer-card__decor" aria-hidden="true">
            <span className="footer-card__blob footer-card__blob--bl" />
            <span className="footer-card__blob footer-card__blob--tr" />
            <span className="footer-card__spark footer-card__spark--one" />
            <span className="footer-card__spark footer-card__spark--two" />
          </div>

          <div className="footer-card__grid">
            <div className="footer-brand">
              <Logo size="footer" showText linkToHome />
              <p className="footer-brand__desc">
                Free HD video downloader and hashtag generator for YouTube, TikTok, Instagram,
                and Facebook.
              </p>
              <div className="footer-socials">
                {SOCIAL_BUTTONS.map((item) => (
                  <SocialButton key={item.to} {...item} />
                ))}
              </div>
            </div>

            <FooterNavColumn
              title="Site"
              links={SITE_LINKS}
              ariaLabel="Site navigation"
              headingIcon={<HomeHeadingIcon />}
              headingTone="blue"
            />
            <FooterNavColumn
              title="Hashtag Tools"
              links={HASHTAG_LINKS}
              ariaLabel="Hashtag tools"
              headingIcon={<HashtagHeadingIcon />}
              headingTone="purple"
              iconBoxClassName="footer-heading-icon-box"
            />
            <FooterNavColumn
              title="Legal"
              links={LEGAL_LINKS}
              ariaLabel="Legal policies"
              headingIcon={<ShieldHeadingIcon />}
              headingTone="pink"
            />
          </div>

          <div className="footer-card__divider" />

          <div className="footer-card__bottom">
            <p className="footer-card__copyright">
              <span className="footer-card__copyright-icon" aria-hidden="true">
                <ShieldSmallIcon />
              </span>
              © {new Date().getFullYear()} FityVid. All rights reserved.
            </p>
            <p className="footer-disclaimer">
              FityVid only supports publicly accessible content. Please download only your own
              content or content you have permission to use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
