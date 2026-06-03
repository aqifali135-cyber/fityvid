import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import { PAGE_SEO } from '../constants/seo';
import '../components/SeoProse.css';

export default function DownloadGuide() {
  const seo = PAGE_SEO.downloadGuide;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PageHero
        title="Video Download Guide"
        subtitle="Step-by-step tips to download videos from YouTube, TikTok, Instagram, and Facebook."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose card seo-content">
          <h2>Before you download</h2>
          <p>
            FityVid is a free HD video downloader for publicly accessible links. Please
            download only your own content or content you have permission to use. Private
            or restricted videos are not supported.
          </p>

          <h2>Desktop, tablet, and mobile</h2>
          <p>
            Copy the video URL from your browser or app, open FityVid, paste the link, and
            choose a quality option. When available, you can download video with file size
            shown before saving.
          </p>

          <h2>Supported link types</h2>
          <ul>
            <li>YouTube — watch URLs, youtu.be links, and Shorts when publicly accessible</li>
            <li>TikTok — tiktok.com and vm.tiktok.com links</li>
            <li>Instagram — public posts and Reels</li>
            <li>Facebook — facebook.com and fb.watch links</li>
          </ul>

          <h2>What FityVid does not do</h2>
          <ul>
            <li>We do not bypass platform restrictions or DRM</li>
            <li>We do not support private or login-only content</li>
            <li>We do not encourage copyright infringement</li>
          </ul>

          <div className="notice-box">
            FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google,
            ByteDance, or Meta.
          </div>

          <p>
            <Link to="/how-it-works">How FityVid works</Link> ·{' '}
            <Link to="/platforms">Supported platforms</Link> ·{' '}
            <Link to="/" className="btn btn-primary">
              Start Download
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
