import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PolicyLayout from '../components/PolicyLayout';
import { PAGE_SEO } from '../constants/seo';

export default function Dmca() {
  const seo = PAGE_SEO.dmca;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PolicyLayout title="DMCA & Copyright Policy">
        <p>
          FityVid respects intellectual property rights and expects users to do the same.
        </p>
        <h2>Responsible use</h2>
        <p>
          FityVid only supports publicly accessible content. Users must download only content
          they own or have explicit permission to use. We do not encourage copyright
          infringement.
        </p>
        <h2>Copyright complaints</h2>
        <p>
          If you believe content accessible through our service infringes your copyright,
          please contact us with sufficient detail to identify the material and your
          authorization to act on behalf of the rights holder.
        </p>
        <h2>No affiliation</h2>
        <p>
          FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google,
          ByteDance, or Meta.
        </p>
        <p>
          <Link to="/contact">Contact FityVid</Link> ·{' '}
          <Link to="/terms-and-conditions">Terms and Conditions</Link>
        </p>
      </PolicyLayout>
    </>
  );
}
