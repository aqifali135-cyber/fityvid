import SEO from '../components/SEO';
import { PAGE_SEO } from '../constants/seo';
import './HowItWorks.css';

const ICONS = {
  logo: '/icons/fityvid-logo.png',
  youtube: '/icons/youtube.png',
  tiktok: '/icons/tiktok.png?v=3',
  instagram: '/icons/instagram.png?v=3',
  facebook: '/icons/facebook.png?v=3',
  link: '/icons/link.png?v=3',
  copy: '/icons/copy.png?v=3',
  shield: '/icons/shield.png?v=3',
};

const STEPS = [
  {
    step: 1,
    title: 'Copy the video URL',
    description:
      'Open YouTube, TikTok, Instagram, or Facebook and copy a public video link you are allowed to use.',
    illustration: 'copy',
  },
  {
    step: 2,
    title: 'Paste on FityVid',
    description:
      'Paste the link into our free online video downloader on the home page. FityVid detects the platform automatically.',
    illustration: 'paste',
  },
  {
    step: 3,
    title: 'Choose quality and file size',
    description:
      'Review available formats, including HD options when offered. File size details help you pick the right download.',
    illustration: 'quality',
  },
  {
    step: 4,
    title: 'Download responsibly',
    description:
      'Save the video only if you own it or have permission. FityVid does not support private or restricted content.',
    illustration: 'shield',
  },
];

const FORMAT_ROWS = [
  { quality: '1080p', hd: true, format: 'MP4', size: '128.4 MB', selected: true },
  { quality: '720p', hd: true, format: 'MP4', size: '64.7 MB', selected: false },
  { quality: '480p', hd: false, format: 'MP4', size: '32.1 MB', selected: false },
  { quality: '360p', hd: false, format: 'MP4', size: '18.7 MB', selected: false },
];

const SOCIAL_ROW = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
];

function BrowserDots() {
  return (
    <span className="hiw-dots" aria-hidden="true">
      <span className="hiw-dots__dot hiw-dots__dot--red" />
      <span className="hiw-dots__dot hiw-dots__dot--yellow" />
      <span className="hiw-dots__dot hiw-dots__dot--green" />
    </span>
  );
}

function CardWatermark() {
  return (
    <img
      className="hiw-card__watermark"
      src={ICONS.logo}
      alt=""
      width={18}
      height={18}
      aria-hidden="true"
    />
  );
}

function StepIllustrationCopy() {
  return (
    <div className="hiw-illustration hiw-illustration--copy" aria-hidden="true">
      <div className="hiw-copy-scene">
        <div className="hiw-copy-card">
          <div className="hiw-copy-card__header">
            <div className="hiw-copy-card__brand">
              <img className="hiw-icon-img" src={ICONS.youtube} alt="" width={22} height={22} />
              <span>YouTube</span>
            </div>
            <span className="hiw-copy-card__close" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path
                  fill="currentColor"
                  d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"
                />
              </svg>
            </span>
          </div>

          <div className="hiw-copy-card__url">https://youtube.com/watch?v=...</div>

          <div className="hiw-copy-card__video">
            <span className="hiw-copy-card__play">
              <span className="hiw-copy-card__play-triangle" />
            </span>
          </div>

          <div className="hiw-copy-card__meta">
            <div className="hiw-copy-card__lines">
              <span className="hiw-copy-card__line hiw-copy-card__line--long" />
              <span className="hiw-copy-card__line hiw-copy-card__line--mid" />
            </div>
            <div className="hiw-copy-card__avatars">
              <span />
              <span />
            </div>
          </div>

          <div className="hiw-copy-card__socials">
            {SOCIAL_ROW.map(({ id, label }) => (
              <span key={id} className="hiw-copy-card__social hiw-icon-wrap">
                <img className="hiw-icon-img" src={ICONS[id]} alt="" width={28} height={28} />
                <span className="visually-hidden">{label}</span>
              </span>
            ))}
            <span className="hiw-copy-card__more" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>

        <span className="hiw-copy-float hiw-copy-float--link hiw-icon-wrap">
          <img className="hiw-icon-img" src={ICONS.link} alt="" width={38} height={38} />
        </span>
        <span className="hiw-copy-float hiw-copy-float--copy hiw-icon-wrap">
          <img className="hiw-icon-img" src={ICONS.copy} alt="" width={38} height={38} />
        </span>
      </div>
    </div>
  );
}

function StepIllustrationPaste() {
  return (
    <div className="hiw-illustration hiw-illustration--paste" aria-hidden="true">
      <div className="hiw-browser">
        <div className="hiw-browser__chrome">
          <BrowserDots />
          <div className="hiw-browser__address">
            <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 1a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm3 7H9V6a3 3 0 0 1 6 0v2z"
              />
            </svg>
            <span>fityvid.com</span>
          </div>
        </div>

        <div className="hiw-browser__body">
          <div className="hiw-browser__brand">
            <img src={ICONS.logo} alt="" width={24} height={24} />
            <span>FityVid</span>
          </div>

          <div className="hiw-browser__input">
            <img className="hiw-icon-img" src={ICONS.link} alt="" width={14} height={14} />
            <span>https://youtu.be/abcdef12345</span>
          </div>

          <span className="hiw-browser__paste-btn">Paste</span>
        </div>
      </div>
    </div>
  );
}

function StepIllustrationQuality() {
  return (
    <div className="hiw-illustration hiw-illustration--quality" aria-hidden="true">
      <div className="hiw-quality">
        <div className="hiw-quality__top">
          <span className="hiw-quality__hd">HD</span>
          <div className="hiw-quality__head">
            <span>Quality</span>
            <span>Format</span>
            <span>Size</span>
          </div>
        </div>

        {FORMAT_ROWS.map((row) => (
          <div
            key={row.quality}
            className={`hiw-quality__row ${row.selected ? 'hiw-quality__row--selected' : ''}`}
          >
            <span className="hiw-quality__radio" />
            <span className="hiw-quality__quality">
              {row.quality}
              {row.hd && <span className="hiw-quality__badge">(HD)</span>}
            </span>
            <span>{row.format}</span>
            <span>{row.size}</span>
          </div>
        ))}

        <span className="hiw-quality__download">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="currentColor" d="M12 16l-4-4h3V4h2v8h3l-4 4zm-8 4h16v2H4v-2z" />
          </svg>
          Download
        </span>
      </div>
    </div>
  );
}

function StepIllustrationShield() {
  return (
    <div className="hiw-illustration hiw-illustration--shield" aria-hidden="true">
      <span className="hiw-shield-star hiw-shield-star--1" aria-hidden="true" />
      <span className="hiw-shield-star hiw-shield-star--2" aria-hidden="true" />
      <span className="hiw-shield-dot hiw-shield-dot--1" aria-hidden="true" />
      <span className="hiw-shield-dot hiw-shield-dot--2" aria-hidden="true" />
      <span className="hiw-shield-glow" aria-hidden="true" />
      <div className="hiw-shield-wrap hiw-icon-wrap">
        <img
          className="hiw-icon-img hiw-shield-img"
          src={ICONS.shield}
          alt="Download responsibly"
        />
      </div>
    </div>
  );
}

const ILLUSTRATIONS = {
  copy: StepIllustrationCopy,
  paste: StepIllustrationPaste,
  quality: StepIllustrationQuality,
  shield: StepIllustrationShield,
};

export default function HowItWorks() {
  const seo = PAGE_SEO.howItWorks;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />

      <section className="hiw-section">
        <div className="hiw-section__bg" aria-hidden="true">
          <span className="hiw-section__wave hiw-section__wave--tl" />
          <span className="hiw-section__wave hiw-section__wave--br" />
          <span className="hiw-section__dots hiw-section__dots--tl" />
        </div>

        <div className="container hiw-section__inner">
          <header className="hiw-header">
            <div className="hiw-header__brand">
              <img src={ICONS.logo} alt="FityVid" width={44} height={44} />
              <span className="hiw-header__name">FityVid</span>
            </div>
            <h1 className="hiw-header__title">How FityVid Works</h1>
            <p className="hiw-header__subtitle">Download videos online in a few simple steps.</p>
          </header>

          <div className="hiw-grid">
            {STEPS.map(({ step, title, description, illustration }) => {
              const Illustration = ILLUSTRATIONS[illustration];
              return (
                <article key={step} className="hiw-card">
                  <span className="hiw-card__badge" aria-hidden="true">
                    {step}
                  </span>
                  <CardWatermark />
                  <div className="hiw-card__illustration">
                    <Illustration />
                  </div>
                  <h2 className="hiw-card__title">{title}</h2>
                  <p className="hiw-card__text">{description}</p>
                </article>
              );
            })}
          </div>

          <div className="hiw-notice">
            <img src={ICONS.logo} alt="" width={22} height={22} aria-hidden="true" />
            <p className="hiw-notice__text">
              FityVid only supports publicly accessible content. Please download only your own
              content or content you have permission to use.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
