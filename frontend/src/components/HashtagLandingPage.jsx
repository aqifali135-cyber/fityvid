import { Link } from 'react-router-dom';
import SEO from './SEO';
import JsonLd from './JsonLd';
import PageHero from './PageHero';
import HashtagSeoSections from './HashtagSeoSections';
import { faqPageSchema } from '../constants/structuredData';
import '../components/SeoProse.css';
import './HashtagLanding.css';
import '../pages/FAQ.css';

export default function HashtagLandingPage({ seo, hero, content }) {
  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <JsonLd data={faqPageSchema(content.faq)} />
      <PageHero title={hero.title} subtitle={hero.subtitle}>
        <div className="hashtag-hero-cta">
          <Link to="/hashtag-generator" className="btn btn-primary">
            {hero.ctaLabel}
          </Link>
        </div>
      </PageHero>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose card seo-content hashtag-landing-prose">
          <HashtagSeoSections {...content} />
        </div>
      </section>
    </>
  );
}
