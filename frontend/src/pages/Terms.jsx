import SEO from '../components/SEO';
import PolicyLayout from '../components/PolicyLayout';

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service" description="FityVid terms of service." />
      <PolicyLayout title="Terms of Service">
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
          FityVid provides tools for YouTube, Facebook, TikTok, and Instagram only.
          We do not support private videos or bypassing restrictions.
        </p>
        <h2>Hashtag tool</h2>
        <p>
          Hashtag suggestions are provided for content discovery and planning only.
          Users should avoid misleading, spammy, or irrelevant hashtags.
        </p>
      </PolicyLayout>
    </>
  );
}
