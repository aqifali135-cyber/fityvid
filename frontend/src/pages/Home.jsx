import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import DownloaderForm from '../components/DownloaderForm';
import AdsterraBanner from '../components/AdsterraBanner';
import AdsterraSquareBanner from '../components/AdsterraSquareBanner';
import AdsterraFooterBanner from '../components/AdsterraFooterBanner';
import PlatformCardIcon from '../components/PlatformCardIcon';
import { HOME_PLATFORMS } from '../constants/platforms';
import { PAGE_SEO } from '../constants/seo';
import {
  websiteSchema,
  organizationSchema,
  webApplicationSchema,
} from '../constants/structuredData';
import '../components/SeoProse.css';
import './Home.css';

const FAQ_PREVIEW = [
  'Which platforms does FityVid support?',
  'Can I download videos in HD with file size shown?',
  'Does FityVid include a free hashtag generator?',
];

export default function Home() {
  const seo = PAGE_SEO.home;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <JsonLd data={[websiteSchema, organizationSchema, webApplicationSchema]} />

      <section className="hero section">
        <div className="hero-bg" aria-hidden="true">
          <span className="hero-bg__shape hero-bg__shape--tl" />
          <span className="hero-bg__shape hero-bg__shape--br" />
          <span className="hero-bg__shape hero-bg__shape--mid" />
          <span className="hero-bg__dots hero-bg__dots--tr" />
          <span className="hero-bg__dots hero-bg__dots--bl" />
          <svg className="hero-bg__curve" viewBox="0 0 420 120" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M10 95 C120 20, 280 110, 410 35"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>
        </div>

        <div className="container hero-inner">
          <div className="hero-top">
            <div className="hero-copy">
              <span className="hero-badge">Simple. Fast. Reliable.</span>
              <h1 className="hero-title">
                Download Videos
                <br />
                in <span className="hero-title__hd">HD</span> Quality
              </h1>
              <p className="hero-subtitle">
                Download videos from YouTube, TikTok, Instagram, and Facebook quickly and easily.
              </p>
            </div>
          </div>

          <DownloaderForm variant="hero" />
        </div>
      </section>

      <AdsterraBanner />

      <section className="section hashtag-promo">
        <div className="container hashtag-promo-inner card">
          <div className="hashtag-promo-text">
            <h2 className="section-title">Free Hashtag Generator</h2>
            <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
              Generate hashtags for YouTube, TikTok, Instagram, and Facebook in seconds.
            </p>
            <Link to="/hashtag-generator" className="btn btn-primary">
              Try Hashtag Generator
            </Link>
            <p className="hashtag-promo-links" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <Link to="/tiktok-hashtag-generator">TikTok hashtags</Link>
              {' · '}
              <Link to="/instagram-hashtag-generator">Instagram hashtags</Link>
              {' · '}
              <Link to="/youtube-hashtag-generator">YouTube hashtags</Link>
              {' · '}
              <Link to="/facebook-hashtag-generator">Facebook hashtags</Link>
            </p>
          </div>
          <div className="hashtag-promo-preview" aria-hidden="true">
            <span>#fitness</span>
            <span>#travel</span>
            <span>#cooking</span>
            <span>#gaming</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Supported Platforms</h2>
          <p className="section-subtitle">FityVid focuses on these four platforms only.</p>
          <div className="platform-grid home-platforms">
            {HOME_PLATFORMS.map((p) => (
              <article key={p.id} className="home-platform-card">
                <PlatformCardIcon src={p.icon} label={p.name} alt={p.alt} />
                <h3>{p.name}</h3>
                <p>Public videos only</p>
              </article>
            ))}
          </div>
          <p className="text-center">
            <Link to="/platforms" className="btn btn-outline">
              View Supported Platforms
            </Link>
          </p>
        </div>
      </section>

      <AdsterraSquareBanner />

      <section className="section seo-blocks-section">
        <div className="container seo-content">
          <div className="seo-block">
            <h2>Why use FityVid?</h2>
            <p>
              FityVid helps you download videos online from supported platforms with a clean,
              simple interface. Our free video downloader shows available quality options and
              file size details when possible, so you can choose the right format before saving.
            </p>
            <p>
              FityVid only supports publicly accessible content. Please download only your
              own content or content you have permission to use.
            </p>
          </div>

          <div className="seo-block">
            <h2>Supported video platforms</h2>
            <p>
              Use FityVid as a YouTube video downloader, TikTok video downloader, Instagram
              video downloader (including Reels), or Facebook video downloader. We do not
              support other platforms.
            </p>
            <p>
              <Link to="/platforms">See all supported platforms</Link> or read our{' '}
              <Link to="/download-guide">video download guide</Link>.
            </p>
          </div>

          <div className="seo-block">
            <h2>Free hashtag generator for creators</h2>
            <p>
              Plan posts faster with our free hashtag generator for YouTube, TikTok,
              Instagram, and Facebook. Create relevant tags for videos, shorts, reels, and
              social posts without spammy suggestions.
            </p>
            <p>
              <Link to="/hashtag-generator">Open the hashtag generator</Link> ·{' '}
              <Link to="/tiktok-hashtag-generator">TikTok</Link> ·{' '}
              <Link to="/instagram-hashtag-generator">Instagram</Link> ·{' '}
              <Link to="/youtube-hashtag-generator">YouTube</Link> ·{' '}
              <Link to="/facebook-hashtag-generator">Facebook</Link>
            </p>
          </div>

          <div className="seo-block">
            <h2>Safe and responsible downloading</h2>
            <p>
              FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google,
              ByteDance, or Meta. We do not support private videos or restricted content.
              Always follow copyright laws and platform terms.
            </p>
            <p>
              <Link to="/disclaimer">Read our disclaimer</Link> and{' '}
              <Link to="/dmca">DMCA policy</Link>.
            </p>
          </div>

          <div className="seo-block">
            <h2>Frequently asked questions</h2>
            <ul className="seo-faq-preview">
              {FAQ_PREVIEW.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <p>
              <Link to="/faq" className="btn btn-outline">
                View all FAQs
              </Link>
            </p>
          </div>
        </div>
      </section>

      <AdsterraFooterBanner />
    </>
  );
}
