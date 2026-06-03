import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import DownloaderForm from '../components/DownloaderForm';
import HeroFloatingSocials from '../components/HeroFloatingSocials';
import PlatformCardIcon from '../components/PlatformCardIcon';
import { HOME_PLATFORMS } from '../constants/platforms';
import './Home.css';

export default function Home() {
  return (
    <>
      <SEO
        title="FityVid - Download YouTube, TikTok, Instagram & Facebook Videos"
        description="Download videos from YouTube, Facebook, TikTok, and Instagram. Free hashtag generator for social content."
      />
      <section className="hero section">
        <HeroFloatingSocials />
        <div className="container hero-content">
          <h1 className="hero-title">Download Videos from Your Favorite Platforms</h1>
          <p className="hero-subtitle">
            FityVid supports YouTube, Facebook, TikTok, and Instagram only.
            Fast, clean, and mobile-friendly.
          </p>
          <DownloaderForm />
        </div>
        <p className="hero-social-disclaimer">
          Social-style icons are used for recognition only.
        </p>
      </section>

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
                <PlatformCardIcon src={p.icon} label={p.name} />
                <h3>{p.name}</h3>
                <p>Public videos only</p>
              </article>
            ))}
          </div>
          <p className="text-center">
            <Link to="/platforms" className="btn btn-outline">View All Platforms</Link>
          </p>
        </div>
      </section>
    </>
  );
}
