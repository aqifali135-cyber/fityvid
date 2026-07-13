import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import DownloaderForm from '../components/DownloaderForm';
import AdsterraBanner from '../components/AdsterraBanner';
import AdsterraSquareBanner from '../components/AdsterraSquareBanner';
import AdsterraFooterBanner from '../components/AdsterraFooterBanner';
import SupportedPlatformsSection from '../components/SupportedPlatformsSection';
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
          <span className="hero-bg__orb hero-bg__orb--one" />
          <span className="hero-bg__orb hero-bg__orb--two" />
        </div>

        <div className="container hero-inner">
          <div className="hero-top">
            <div className="hero-copy">
              <span className="hero-badge">
                <span className="hero-badge__bolt" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                    <path
                      d="M13 2 4 14h7l-1 8 10-14h-7l0-6z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Simple. Fast. Reliable.
              </span>
              <h1 className="hero-title">
                Download Videos
                <br />
                in <span className="hero-title__hd">HD</span> Quality
              </h1>
              <p className="hero-subtitle">
                Download videos from YouTube, TikTok, Instagram,
                <br className="hero-subtitle__break" />
                and Facebook quickly and easily.
              </p>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <span className="hero-visual__ring hero-visual__ring--outer" />
              <span className="hero-visual__ring hero-visual__ring--mid" />
              <span className="hero-visual__ring hero-visual__ring--inner" />
              <span className="hero-visual__dot hero-visual__dot--a" />
              <span className="hero-visual__dot hero-visual__dot--b" />
              <span className="hero-visual__dot hero-visual__dot--c" />
              <div className="hero-visual__card">
                <span className="hero-visual__circle">
                  <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
                    <path
                      d="M12 4v10m0 0 4-4m-4 4-4-4"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 18h14"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <span className="hero-visual__badge">
                <span className="hero-visual__badge-dot" />
                Fast Download
              </span>
            </div>
          </div>

          <DownloaderForm variant="hero" />
        </div>
      </section>

      <AdsterraBanner />

      <section className="section hashtag-promo">
        <div className="hashtag-promo__inner">
          <header className="hashtag-promo__header">
            <p className="hashtag-promo__badge">
              <span aria-hidden="true">✨</span> 100% Free • No Sign Up Required
            </p>
            <h2 className="hashtag-promo__title">
              Free <span className="hashtag-promo__gradient">Hashtag</span> Generator
            </h2>
            <p className="hashtag-promo__subtitle">
              Generate powerful, relevant hashtags for YouTube, TikTok, Instagram, Facebook posts,
              reels, Shorts, and videos in seconds.
            </p>
          </header>

          <div className="hashtag-promo__card">
            <div className="hashtag-promo__tabs" role="tablist" aria-label="Hashtag generator modes">
              <span className="hashtag-promo__tab hashtag-promo__tab--active" role="tab" aria-selected="true">
                <span className="hashtag-promo__tab-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                  </svg>
                </span>
                Generate by Keyword
              </span>
              <span className="hashtag-promo__tab" role="tab" aria-selected="false">
                <span className="hashtag-promo__tab-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="9" cy="11" r="2" />
                    <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L7 17" strokeLinecap="round" />
                  </svg>
                </span>
                Generate by Photo
              </span>
              <span className="hashtag-promo__tab" role="tab" aria-selected="false">
                <span className="hashtag-promo__tab-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 1 7 0" strokeLinecap="round" />
                    <path d="M14 10V7a2 2 0 1 1 4 0v3" strokeLinecap="round" />
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                  </svg>
                </span>
                Generate by Post URL
              </span>
            </div>

            <div className="hashtag-promo__field">
              <span className="hashtag-promo__field-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                className="hashtag-promo__input"
                placeholder="Example: fitness, workout, home gym, motivation..."
                readOnly
                tabIndex={-1}
                aria-label="Hashtag keyword example"
              />
            </div>

            <Link to="/hashtag-generator" className="hashtag-promo__cta">
              <span aria-hidden="true">✨</span>
              Generate Hashtags
              <span className="hashtag-promo__cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className="hashtag-promo__features" aria-label="Hashtag generator benefits">
            <div className="hashtag-promo__feature">
              <div className="hashtag-promo__feature-icon hashtag-promo__feature-icon--purple" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 9h16M4 15h10" strokeLinecap="round" />
                  <path d="M10 5v14" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="hashtag-promo__feature-title">Relevant Hashtags</h3>
                <p className="hashtag-promo__feature-text">Get highly relevant and trending hashtags.</p>
              </div>
            </div>
            <div className="hashtag-promo__feature">
              <span className="hashtag-promo__feature-divider" aria-hidden="true" />
              <div className="hashtag-promo__feature-icon hashtag-promo__feature-icon--blue" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 17l6-6 4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="hashtag-promo__feature-title">Boost Engagement</h3>
                <p className="hashtag-promo__feature-text">Increase reach, views, and engagement.</p>
              </div>
            </div>
            <div className="hashtag-promo__feature">
              <span className="hashtag-promo__feature-divider" aria-hidden="true" />
              <div className="hashtag-promo__feature-icon hashtag-promo__feature-icon--pink" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="hashtag-promo__feature-title">Save Time</h3>
                <p className="hashtag-promo__feature-text">Generate hashtags in seconds, not minutes.</p>
              </div>
            </div>
            <div className="hashtag-promo__feature">
              <span className="hashtag-promo__feature-divider" aria-hidden="true" />
              <div className="hashtag-promo__feature-icon hashtag-promo__feature-icon--green" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="hashtag-promo__feature-title">100% Free</h3>
                <p className="hashtag-promo__feature-text">No sign up required. Unlimited usage.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SupportedPlatformsSection />

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
