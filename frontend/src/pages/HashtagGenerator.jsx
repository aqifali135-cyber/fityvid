import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import PageHero from '../components/PageHero';
import HashtagForm from '../components/HashtagForm';
import HashtagFloatingBg from '../components/HashtagFloatingBg';
import HashtagSeoSections from '../components/HashtagSeoSections';
import { PAGE_SEO } from '../constants/seo';
import { HASHTAG_GENERATOR_SEO } from '../constants/hashtagLandingContent';
import { webApplicationSchema, faqPageSchema } from '../constants/structuredData';
import '../components/SeoProse.css';
import '../components/HashtagLanding.css';
import './FAQ.css';
import './HashtagGenerator.css';

const PLATFORM_GUIDES = [
  { to: '/tiktok-hashtag-generator', label: 'TikTok hashtag generator guide' },
  { to: '/instagram-hashtag-generator', label: 'Instagram hashtag generator guide' },
  { to: '/youtube-hashtag-generator', label: 'YouTube hashtag generator guide' },
  { to: '/facebook-hashtag-generator', label: 'Facebook hashtag generator guide' },
];

export default function HashtagGenerator() {
  const seo = PAGE_SEO.hashtagGenerator;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <JsonLd data={[webApplicationSchema, faqPageSchema(HASHTAG_GENERATOR_SEO.faq)]} />
      <div className="hashtag-section">
        <HashtagFloatingBg />
        <div className="hashtag-content">
          <PageHero
            title="Free Hashtag Generator"
            subtitle="Generate hashtags for YouTube, TikTok, Instagram, and Facebook posts, reels, Shorts, and videos."
          />
          <section className="section">
            <div className="container">
              <HashtagForm />
            </div>
          </section>
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container seo-content card hashtag-landing-prose">
              <HashtagSeoSections {...HASHTAG_GENERATOR_SEO} showBottomCta={false} />
              <section className="hashtag-seo-block">
                <h2>Platform hashtag guides</h2>
                <ul className="hashtag-related-links">
                  {PLATFORM_GUIDES.map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
              <p>
                <Link to="/">Video downloader</Link> · <Link to="/faq">FAQ</Link> ·{' '}
                <Link to="/download-guide">Download guide</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
