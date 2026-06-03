import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

export default function DownloadGuide() {
  return (
    <>
      <SEO title="Download Guide" description="Guide for downloading videos from YouTube, TikTok, Instagram, and Facebook with FityVid." />
      <PageHero title="Download Guide" subtitle="Tips for using FityVid with YouTube, Facebook, TikTok, and Instagram." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose card">
          <h2>Before you download</h2>
          <p>
            Please download only your own content or content you have permission to use.
            FityVid processes publicly accessible videos only. Private or restricted videos are not supported.
          </p>
          <h2>Supported links</h2>
          <ul>
            <li>YouTube — standard watch URLs and youtu.be short links</li>
            <li>TikTok — tiktok.com and vm.tiktok.com links</li>
            <li>Instagram — public post and reel URLs</li>
            <li>Facebook — facebook.com and fb.watch links</li>
          </ul>
          <h2>What we do not do</h2>
          <ul>
            <li>We do not bypass platform restrictions or DRM</li>
            <li>We do not support private or login-only content</li>
            <li>We do not encourage copyright infringement</li>
          </ul>
          <div className="notice-box">
            FityVid supports YouTube, TikTok, Instagram, and Facebook links only.
            FityVid is not affiliated with YouTube, Google, TikTok, ByteDance, Instagram, Facebook, or Meta.
          </div>
        </div>
      </section>
    </>
  );
}
