import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PolicyLayout from '../components/PolicyLayout';
import { PAGE_SEO } from '../constants/seo';

export default function Disclaimer() {
  const seo = PAGE_SEO.disclaimer;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PolicyLayout title="Disclaimer">
        <div className="notice-box" style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: 0 }}>
            <strong>
              FityVid supports YouTube, TikTok, Instagram, and Facebook links only.
            </strong>{' '}
            FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google,
            ByteDance, or Meta.
          </p>
        </div>
        <h2>Video downloads</h2>
        <p>
          FityVid only supports publicly accessible content. Please download only your own
          content or content you have permission to use. We do not support private videos,
          do not claim to bypass restrictions, and do not encourage copyright violation.
        </p>
        <h2>Hashtag generator</h2>
        <p>
          Hashtag suggestions are provided for content discovery and planning only. Users
          should avoid misleading, spammy, or irrelevant hashtags.
        </p>
        <h2>No affiliation</h2>
        <p>
          All trademarks belong to their respective owners. FityVid is an independent
          website and is not endorsed by any social media platform.
        </p>
        <p>
          <Link to="/contact">Contact FityVid</Link>
        </p>
      </PolicyLayout>
    </>
  );
}
