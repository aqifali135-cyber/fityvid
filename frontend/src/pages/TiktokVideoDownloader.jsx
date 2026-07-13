import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import TiktokDownloaderPanel from '../components/TiktokDownloaderPanel';
import { PAGE_SEO } from '../constants/seo';
import { webApplicationSchema, faqPageSchema } from '../constants/structuredData';
import './TiktokVideoDownloader.css';

const FEATURES = [
  {
    id: 'fast',
    title: 'Fast processing',
    description: 'Get TikTok download options quickly without waiting on heavy software.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13 2 4 14h7l-1 8 10-14h-7l0-6z"
        />
      </svg>
    ),
  },
  {
    id: 'hd',
    title: 'HD quality',
    description: 'Choose available HD formats when the public source provides them.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm3 4v6h2v-2h1.2a2 2 0 0 0 0-4H7zm2 1.5h1.2a.5.5 0 0 1 0 1H9v-1zm5-.5v6h.9l2.6-6H19l-2.7 6.2c-.3.7-.8 1.3-1.7 1.3H14V9h2z"
        />
      </svg>
    ),
  },
  {
    id: 'no-install',
    title: 'No software installation',
    description: 'Works in your browser—no apps, plugins, or desktop installs required.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l2 3h-2.5l-2-3h-1l-2 3H7l2-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v7h16V6H4z"
        />
      </svg>
    ),
  },
  {
    id: 'mobile',
    title: 'Mobile friendly',
    description: 'Paste TikTok links and download from phone, tablet, or desktop.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v12h8V5H8zm4 14.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        />
      </svg>
    ),
  },
];

const HOW_TO_STEPS = [
  {
    step: 1,
    title: 'Copy TikTok video URL',
    description: 'Open a public TikTok video and copy the share link or browser URL.',
  },
  {
    step: 2,
    title: 'Paste URL into FityVid',
    description: 'Paste the link into the TikTok downloader input on this page.',
  },
  {
    step: 3,
    title: 'Click Download',
    description: 'Submit the form, then save MP4 (and MP3 when available) if you have permission.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Can I download TikTok videos without a watermark?',
    a: 'When the source provides a no-watermark option, FityVid shows it in the download results. Availability depends on the public link.',
  },
  {
    q: 'Does this TikTok downloader work on mobile?',
    a: 'Yes. Paste a public TikTok link in your mobile browser and follow the same download steps.',
  },
  {
    q: 'Are private TikTok videos supported?',
    a: 'No. FityVid only processes publicly accessible TikTok videos. Private or restricted posts are not supported.',
  },
  {
    q: 'Is FityVid affiliated with TikTok?',
    a: 'No. FityVid is an independent tool and is not affiliated with TikTok or ByteDance.',
  },
  {
    q: 'When does the Download MP3 button appear?',
    a: 'The MP3 option appears only when the backend response includes a downloadable audio format for that video.',
  },
];

const RELATED_TOOLS = [
  { to: '/youtube-video-downloader', label: 'YouTube Video Downloader' },
  { to: '/instagram-video-downloader', label: 'Instagram Video Downloader' },
  { to: '/facebook-video-downloader', label: 'Facebook Video Downloader' },
  { to: '/hashtag-generator', label: 'Hashtag Generator' },
  { to: '/stylish-text-generator', label: 'Stylish Text Generator' },
  { to: '/', label: 'Home Video Downloader' },
];

export default function TiktokVideoDownloader() {
  const seo = PAGE_SEO.tiktokVideoDownloader;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <JsonLd data={[webApplicationSchema, faqPageSchema(FAQ_ITEMS)]} />

      <div className="ttd-page">
        <nav className="ttd-subnav" aria-label="TikTok downloader tools">
          <div className="container ttd-subnav__inner">
            <Link to="/tiktok-story-downloader" className="ttd-subnav__link">
              Download TikTok Stories
            </Link>
            <Link to="/tiktok-mp3-downloader" className="ttd-subnav__link">
              Download TikTok MP3
            </Link>
          </div>
        </nav>

        <section className="ttd-hero" aria-labelledby="ttd-hero-title">
          <div className="ttd-hero__bg" aria-hidden="true">
            <span className="ttd-hero__orb ttd-hero__orb--left" />
            <span className="ttd-hero__orb ttd-hero__orb--right" />
            <span className="ttd-hero__orb ttd-hero__orb--bottom" />
          </div>

          <div className="container ttd-hero__inner">
            <p className="ttd-hero__badge">TikTok tool</p>
            <h1 id="ttd-hero-title" className="ttd-hero__title">
              TikTok Video Downloader{' '}
              <span className="ttd-hero__highlight">Without Watermark</span>
            </h1>
            <p className="ttd-hero__subtitle">
              Download publicly accessible TikTok videos quickly and easily.
            </p>

            <TiktokDownloaderPanel />
          </div>
        </section>

        <section className="ttd-section ttd-features" aria-labelledby="ttd-features-title">
          <div className="container">
            <h2 id="ttd-features-title" className="ttd-section__title">
              Why use FityVid for TikTok
            </h2>
            <p className="ttd-section__subtitle">
              A clean TikTok downloader built for public links you are allowed to save.
            </p>
            <div className="ttd-features__grid">
              {FEATURES.map((feature) => (
                <article key={feature.id} className="ttd-feature-card">
                  <span className="ttd-feature-card__icon">{feature.icon}</span>
                  <h3 className="ttd-feature-card__title">{feature.title}</h3>
                  <p className="ttd-feature-card__desc">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ttd-section ttd-howto" aria-labelledby="ttd-howto-title">
          <div className="container">
            <h2 id="ttd-howto-title" className="ttd-section__title">
              How to download
            </h2>
            <p className="ttd-section__subtitle">Three simple steps to save a public TikTok video.</p>
            <ol className="ttd-howto__grid">
              {HOW_TO_STEPS.map((item) => (
                <li key={item.step} className="ttd-howto-card">
                  <span className="ttd-howto-card__step" aria-hidden="true">
                    {item.step}
                  </span>
                  <h3 className="ttd-howto-card__title">{item.title}</h3>
                  <p className="ttd-howto-card__desc">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ttd-section ttd-faq" aria-labelledby="ttd-faq-title">
          <div className="container ttd-faq__inner">
            <h2 id="ttd-faq-title" className="ttd-section__title">
              Frequently asked questions
            </h2>
            <div className="ttd-faq__list">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="ttd-faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="ttd-section ttd-related" aria-labelledby="ttd-related-title">
          <div className="container">
            <h2 id="ttd-related-title" className="ttd-section__title">
              Related tools
            </h2>
            <ul className="ttd-related__list">
              {RELATED_TOOLS.map((tool) => (
                <li key={tool.to}>
                  <Link to={tool.to} className="ttd-related__link">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
