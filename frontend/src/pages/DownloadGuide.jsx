import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import { PAGE_SEO } from '../constants/seo';
import './DownloadGuide.css';

const AFFILIATION_TEXT =
  'FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google, ByteDance, or Meta.';

const SUPPORTED_LINKS = [
  'YouTube — watch URLs, youtu.be links, and Shorts when publicly accessible',
  'TikTok — tiktok.com and vm.tiktok.com links',
  'Instagram — public posts and Reels',
  'Facebook — facebook.com and fb.watch links',
];

const RESTRICTIONS = [
  'We do not bypass platform restrictions or DRM',
  'We do not support private or login-only content',
  'We do not encourage copyright infringement',
];

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5v6c0 5.25 3.4 10.15 8 11 4.6-.85 8-5.75 8-11V5l-8-3zm-1 14-3-3 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z"
      />
    </svg>
  );
}

function DevicesIcon() {
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10H4V6zm10 12H6v2h8v-2zm3-14a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2z"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10.59 13.41a1 1 0 0 0 0 1.42l2.83 2.83a3 3 0 0 0 4.24-4.24l-1.41-1.41a1 1 0 1 0-1.42 1.42l1.41 1.41a1 1 0 0 1-1.41 1.41l-2.83-2.83a1 1 0 0 0-1.42 0z"
      />
      <path
        fill="currentColor"
        d="M13.41 10.59a1 1 0 0 0 0-1.42L10.58 6.34a3 3 0 1 0-4.24 4.24l1.41 1.41a1 1 0 0 0 1.42-1.42L7.76 9.17a1 1 0 1 1 1.41-1.41l2.83 2.83a1 1 0 0 0 1.41 0z"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 1 21h22L12 2zm0 4.5 7.5 13h-15L12 6.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" width={18} height={18} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 2a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 10.59V3a1 1 0 0 1 1-1z"
      />
      <path
        fill="currentColor"
        d="M4 16a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1z"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 7zm-1 4h2v7h-2v-7z"
      />
    </svg>
  );
}

export default function DownloadGuide() {
  const seo = PAGE_SEO.downloadGuide;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />

      <section className="dg-page section" aria-labelledby="dg-page-title">
        <div className="dg-page__bg" aria-hidden="true">
          <span className="dg-page__orb dg-page__orb--left" />
          <span className="dg-page__orb dg-page__orb--right" />
        </div>

        <div className="container dg-page__shell">
          <header className="dg-header">
            <div className="dg-header__logo">
              <Logo size="hero" showText linkToHome={false} />
            </div>
            <h1 id="dg-page-title" className="dg-header__title">
              Video Download Guide
            </h1>
            <p className="dg-header__subtitle">
              Step-by-step tips to download videos from YouTube, TikTok, Instagram, and Facebook.
            </p>
          </header>

          <div className="dg-container">
            <div className="dg-container-inner">
              <article className="dg-block">
                <span className="dg-icon dg-icon--pink" aria-hidden="true">
                  <ShieldIcon />
                </span>
                <div className="dg-block__content">
                  <h2 className="dg-block__title">Before you download</h2>
                  <p className="dg-block__text">
                    FityVid is a free HD video downloader for publicly accessible links. Please
                    download only your own content or content you have permission to use. Private
                    or restricted videos are not supported.
                  </p>
                </div>
              </article>

              <article className="dg-block">
                <span className="dg-icon dg-icon--blue" aria-hidden="true">
                  <DevicesIcon />
                </span>
                <div className="dg-block__content">
                  <h2 className="dg-block__title">Desktop, tablet, and mobile</h2>
                  <p className="dg-block__text">
                    Copy the video URL from your browser or app, open FityVid, paste the link, and
                    choose a quality option. When available, you can download video with file size
                    shown before saving.
                  </p>
                </div>
              </article>

              <article className="dg-block">
                <span className="dg-icon dg-icon--green" aria-hidden="true">
                  <LinkIcon />
                </span>
                <div className="dg-block__content">
                  <h2 className="dg-block__title">Supported link types</h2>
                  <ul className="dg-list dg-list--green">
                    {SUPPORTED_LINKS.map((item) => (
                      <li key={item}>
                        <span className="dg-list__bullet" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="dg-block">
                <span className="dg-icon dg-icon--orange" aria-hidden="true">
                  <WarningIcon />
                </span>
                <div className="dg-block__content">
                  <h2 className="dg-block__title">What FityVid does not do</h2>
                  <ul className="dg-list dg-list--orange">
                    {RESTRICTIONS.map((item) => (
                      <li key={item}>
                        <span className="dg-list__bullet" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <div className="dg-notice" role="note">
                <span className="dg-notice__icon" aria-hidden="true">
                  <InfoIcon />
                </span>
                <p>{AFFILIATION_TEXT}</p>
              </div>

              <div className="dg-footer-row">
                <p className="dg-footer-links">
                  <Link to="/how-it-works">How FityVid works</Link>
                  <span className="dg-footer-links__sep" aria-hidden="true">
                    ·
                  </span>
                  <Link to="/platforms">Supported platforms</Link>
                </p>
                <Link to="/" className="dg-cta">
                  Start Download
                  <DownloadIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
