import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PolicyLayout from '../components/PolicyLayout';
import { PAGE_SEO } from '../constants/seo';

export default function Privacy() {
  const seo = PAGE_SEO.privacy;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PolicyLayout title="Privacy Policy">
        <p>Last updated: June 2026</p>
        <p>
          FityVid respects your privacy. We do not require an account to use the video
          downloader or hashtag generator. URLs and topics you submit are processed to
          provide the requested service.
        </p>
        <h2>Information we process</h2>
        <ul>
          <li>Video URLs submitted for validation and download options</li>
          <li>Hashtag topics and preferences you enter</li>
          <li>Basic technical logs (e.g., errors) for service reliability</li>
          <li>Contact form messages when you reach out to us</li>
        </ul>
        <h2>Third-party platforms</h2>
        <p>
          FityVid supports YouTube, TikTok, Instagram, and Facebook links only. FityVid is
          not affiliated with YouTube, TikTok, Instagram, Facebook, Google, ByteDance, or
          Meta.
        </p>
        <p>
          <Link to="/contact">Contact FityVid</Link>
        </p>
      </PolicyLayout>
    </>
  );
}
