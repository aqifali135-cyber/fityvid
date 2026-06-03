import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PolicyLayout from '../components/PolicyLayout';
import { PAGE_SEO } from '../constants/seo';

export default function Terms() {
  const seo = PAGE_SEO.terms;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PolicyLayout title="Terms and Conditions">
        <p>Last updated: June 2026</p>
        <p>By using FityVid, you agree to these terms.</p>
        <h2>Acceptable use</h2>
        <ul>
          <li>Use FityVid only for content you own or have permission to download and use</li>
          <li>Do not use FityVid to infringe copyright or violate platform terms</li>
          <li>Only submit publicly accessible video URLs</li>
        </ul>
        <h2>Service scope</h2>
        <p>
          FityVid provides a video downloader and hashtag generator for YouTube, TikTok,
          Instagram, and Facebook only. We do not support private videos or bypassing
          restrictions.
        </p>
        <h2>Hashtag tool</h2>
        <p>
          Hashtag suggestions are provided for content discovery and planning only. Users
          should avoid misleading, spammy, or irrelevant hashtags.
        </p>
        <p>
          FityVid only supports publicly accessible content. Please download only your own
          content or content you have permission to use.
        </p>
        <p>
          <Link to="/contact">Contact FityVid</Link> ·{' '}
          <Link to="/dmca">DMCA policy</Link>
        </p>
      </PolicyLayout>
    </>
  );
}
