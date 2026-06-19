import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import DownloaderForm from '../components/DownloaderForm';
import Logo from '../components/Logo';
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
        <div className="container">
          <div className="hashtag-promo-card">
            <div className="hashtag-promo-card__decor" aria-hidden="true">
              <span className="hashtag-promo-card__blob hashtag-promo-card__blob--main" />
              <span className="hashtag-promo-card__dots" />
              <span className="hashtag-promo-card__spark hashtag-promo-card__spark--one" />
              <span className="hashtag-promo-card__spark hashtag-promo-card__spark--two" />
            </div>

            <div className="hashtag-promo-card__grid">
              <div className="hashtag-promo-card__copy">
                <div className="hashtag-promo-card__brand">
                  <Logo size="hero" showText linkToHome={false} />
                </div>
                <h2 className="hashtag-promo-card__title">
                  Free Hashtag
                  <br />
                  Generator
                </h2>
                <p className="hashtag-promo-card__desc">
                  Generate hashtags for YouTube, TikTok, Instagram, and Facebook in seconds.
                </p>
                <Link to="/hashtag-generator" className="hashtag-promo-cta">
                  Try Hashtag Generator
                  <span className="hashtag-promo-cta__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <p className="hashtag-promo-card__links">
                  <Link to="/tiktok-hashtag-generator">TikTok hashtags</Link>
                  <span className="hashtag-promo-card__links-sep" aria-hidden="true">
                    ·
                  </span>
                  <Link to="/instagram-hashtag-generator">Instagram hashtags</Link>
                  <span className="hashtag-promo-card__links-sep" aria-hidden="true">
                    ·
                  </span>
                  <Link to="/youtube-hashtag-generator">YouTube hashtags</Link>
                  <span className="hashtag-promo-card__links-sep" aria-hidden="true">
                    ·
                  </span>
                  <Link to="/facebook-hashtag-generator">Facebook hashtags</Link>
                </p>
              </div>

              <div className="hashtag-promo-card__visual" aria-hidden="true">
                <span className="hashtag-pill hashtag-pill--fitness">
                  <span className="hashtag-pill__icon hashtag-pill__icon--purple">
                    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M6.5 6a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm6 0a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zM4 11h2v7H4v-7zm14 0h2v7h-2v-7zM9 11h6v2H9v-2z"
                      />
                    </svg>
                  </span>
                  #fitness
                </span>
                <span className="hashtag-pill hashtag-pill--travel">
                  <span className="hashtag-pill__icon hashtag-pill__icon--blue">
                    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M2.5 19l1.5-5.5L12 3l8 10.5L21.5 19H2.5zm3.2-2h12.6l-1-3.7L12 6.5 6.2 13.3l-.5 3.7z"
                      />
                    </svg>
                  </span>
                  #travel
                </span>
                <span className="hashtag-pill hashtag-pill--cooking">
                  <span className="hashtag-pill__icon hashtag-pill__icon--pink">
                    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 3c-2.2 0-4 1.6-4 3.6 0 .9.3 1.7.8 2.4L4 22h16l-4.8-13c.5-.7.8-1.5.8-2.4C16 4.6 14.2 3 12 3z"
                      />
                    </svg>
                  </span>
                  #cooking
                </span>
                <span className="hashtag-pill hashtag-pill--gaming">
                  <span className="hashtag-pill__icon hashtag-pill__icon--lavender">
                    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M6 9H4V7h2v2zm0 4H4v-2h2v2zm4-7H8V4h2v2zm0 14h-2v-2h2v2zm4-14h-2V4h2v2zm6 7h-2V7h2v2zm-2 4h2v2h-2v-2zM8 11h8v2H8v-2z"
                      />
                    </svg>
                  </span>
                  #gaming
                </span>
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
