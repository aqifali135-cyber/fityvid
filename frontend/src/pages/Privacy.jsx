import SEO from '../components/SEO';
import PolicyLayout from '../components/PolicyLayout';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy Policy" description="FityVid privacy policy." />
      <PolicyLayout title="Privacy Policy">
        <p>Last updated: June 2026</p>
        <p>
          FityVid respects your privacy. We do not require an account to use the video URL checker
          or hashtag generator. URLs and topics you submit are processed to provide the requested service.
        </p>
        <h2>Information we process</h2>
        <ul>
          <li>Video URLs submitted for validation</li>
          <li>Hashtag topics and preferences you enter</li>
          <li>Basic technical logs (e.g., errors) for service reliability</li>
        </ul>
        <h2>Third-party platforms</h2>
        <p>
          FityVid supports YouTube, TikTok, Instagram, and Facebook links only.
          FityVid is not affiliated with YouTube, Google, TikTok, ByteDance, Instagram, Facebook, or Meta.
        </p>
      </PolicyLayout>
    </>
  );
}
