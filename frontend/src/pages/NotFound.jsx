import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | FityVid"
        description="The page you requested could not be found on FityVid."
        noSuffix
        robots="noindex, nofollow"
      />
      <PageHero
        title="Page Not Found"
        subtitle="The page you are looking for does not exist or may have been moved."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
