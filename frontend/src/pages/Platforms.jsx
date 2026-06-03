import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import PlatformCardIcon from '../components/PlatformCardIcon';
import { PLATFORMS_PAGE, PLATFORM_DISCLAIMERS } from '../constants/platforms';
import './Platforms.css';

export default function Platforms() {
  return (
    <>
      <SEO
        title="Supported Platforms - YouTube, TikTok, Instagram & Facebook"
        description="FityVid supports video downloads from YouTube, TikTok, Instagram, and Facebook only."
      />
      <PageHero title="Supported Platforms" subtitle="FityVid supports exactly four platforms — no others." />
      <section className="section platforms-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="notice-box platforms-notice">
            Please download only your own content or content you have permission to use.
            Private videos are not supported. FityVid does not bypass restrictions.
          </div>
          <p className="platform-icons-note">Platform icons are used for recognition only.</p>
          <div className="platform-grid">
            {PLATFORMS_PAGE.map((p) => (
              <article key={p.id} className="platform-card">
                <PlatformCardIcon src={p.icon} label={p.shortName} />
                <h3>{p.name}</h3>
                <p className="platform-card-desc">{p.desc}</p>
                <ul>
                  {PLATFORM_DISCLAIMERS.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
