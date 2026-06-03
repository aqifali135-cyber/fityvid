import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import HashtagForm from '../components/HashtagForm';
import HashtagFloatingBg from '../components/HashtagFloatingBg';
import './HashtagGenerator.css';

export default function HashtagGenerator() {
  return (
    <>
      <SEO
        title="FityVid Hashtag Generator - Generate Hashtags for YouTube, TikTok, Instagram & Facebook"
        description="Generate relevant hashtags for YouTube, TikTok, Instagram, and Facebook with FityVid. Create hashtags for videos, reels, shorts, and social posts."
      />
      <div className="hashtag-section">
        <HashtagFloatingBg />
        <div className="hashtag-content">
          <PageHero
            title="Hashtag Generator"
            subtitle="Create relevant hashtags for YouTube, TikTok, Instagram, and Facebook posts and videos."
          />
          <section className="section">
            <div className="container">
              <HashtagForm />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
