import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

const SITE_LINKS = [
  { to: '/', label: 'Home' },
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

function FooterNavColumn({ title, links, ariaLabel }) {
  return (
    <nav className="footer-nav-col" aria-label={ariaLabel}>
      <h4>{title}</h4>
      <ul>
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo size="footer" showText linkToHome />
          <p>
            Free HD video downloader and hashtag generator for YouTube, TikTok, Instagram,
            and Facebook.
          </p>
        </div>
        <FooterNavColumn title="Site" links={SITE_LINKS} ariaLabel="Site navigation" />
        <FooterNavColumn
          title="Hashtag Tools"
          links={HASHTAG_LINKS}
          ariaLabel="Hashtag tools"
        />
        <FooterNavColumn title="Legal" links={LEGAL_LINKS} ariaLabel="Legal policies" />
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} FityVid. All rights reserved.</p>
        <p className="footer-disclaimer">
          FityVid only supports publicly accessible content. Please download only your own
          content or content you have permission to use.
        </p>
      </div>
    </footer>
  );
}
