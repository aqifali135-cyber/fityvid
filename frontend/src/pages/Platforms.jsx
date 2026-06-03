import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import PlatformCardIcon from '../components/PlatformCardIcon';
import { PLATFORMS_PAGE, PLATFORM_DISCLAIMERS, PLATFORM_ALT } from '../constants/platforms';
import { PAGE_SEO } from '../constants/seo';
import '../components/SeoProse.css';
import './Platforms.css';

export default function Platforms() {
  const seo = PAGE_SEO.platforms;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PageHero
        title="Supported Platforms"
        subtitle="YouTube, TikTok, Instagram, and Facebook — our social media video downloader supports these four only."
      />
      <section className="section platforms-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="notice-box platforms-notice">
            FityVid only supports publicly accessible content. Please download only your
            own content or content you have permission to use. Private videos are not
            supported.
          </div>
          <p className="platform-icons-note">Platform icons are used for recognition only.</p>
          <div className="platform-grid">
            {PLATFORMS_PAGE.map((p) => (
              <article key={p.id} className="platform-card">
                <PlatformCardIcon
                  src={p.icon}
                  label={p.shortName}
                  alt={PLATFORM_ALT[p.id]}
                />
                <h2 className="platform-card-heading">{p.name}</h2>
                <p className="platform-card-desc">{p.desc}</p>
                <ul>
                  {PLATFORM_DISCLAIMERS.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="seo-content" style={{ marginTop: '2rem' }}>
            <p>
              FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google,
              ByteDance, or Meta.
            </p>
            <p>
              <Link to="/download-guide" className="btn btn-primary">
                Video Download Guide
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
