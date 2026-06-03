import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import PageHero from '../components/PageHero';
import HashtagForm from '../components/HashtagForm';
import HashtagFloatingBg from '../components/HashtagFloatingBg';
import { PAGE_SEO } from '../constants/seo';
import { webApplicationSchema } from '../constants/structuredData';
import '../components/SeoProse.css';
import './HashtagGenerator.css';

export default function HashtagGenerator() {
  const seo = PAGE_SEO.hashtagGenerator;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <JsonLd data={webApplicationSchema} />
      <div className="hashtag-section">
        <HashtagFloatingBg />
        <div className="hashtag-content">
          <PageHero
            title="Free Hashtag Generator"
            subtitle="Generate hashtags for YouTube, TikTok, Instagram, and Facebook posts, reels, shorts, and videos."
          />
          <section className="section">
            <div className="container">
              <HashtagForm />
            </div>
          </section>
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container seo-content card">
              <h2>Social media hashtag generator</h2>
              <p>
                Use FityVid as a YouTube hashtag generator, TikTok hashtag generator,
                Instagram hashtag generator, or Facebook hashtag generator. Enter your
                topic, pick a style, and get relevant tags for creators — not spammy
                keyword lists.
              </p>
              <p>
                <Link to="/">Try the video downloader</Link> ·{' '}
                <Link to="/faq">FAQ</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
