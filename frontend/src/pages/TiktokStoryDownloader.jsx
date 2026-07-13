import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './TiktokToolComingSoon.css';

export default function TiktokStoryDownloader() {
  return (
    <>
      <SEO
        title="TikTok Story Downloader | FityVid"
        description="TikTok Story Downloader on FityVid — this tool is coming soon."
        path="/tiktok-story-downloader"
        noSuffix
      />
      <section className="ttcs-page section">
        <div className="ttcs-page__bg" aria-hidden="true">
          <span className="ttcs-page__orb ttcs-page__orb--left" />
          <span className="ttcs-page__orb ttcs-page__orb--right" />
        </div>
        <div className="container ttcs-page__inner">
          <p className="ttcs-page__badge">TikTok tool</p>
          <h1 className="ttcs-page__title">TikTok Story Downloader</h1>
          <p className="ttcs-page__subtitle">This tool is coming soon.</p>
          <Link to="/tiktok-video-downloader" className="ttcs-page__btn">
            Back to TikTok Downloader
          </Link>
        </div>
      </section>
    </>
  );
}
