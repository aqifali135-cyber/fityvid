import { Link } from 'react-router-dom';
import SEO from './SEO';
import JsonLd from './JsonLd';
import DownloaderForm from './DownloaderForm';
import { webApplicationSchema, faqPageSchema } from '../constants/structuredData';
import './SeoProse.css';
import './PlatformDownloaderPage.css';
import '../pages/FAQ.css';

export default function PlatformDownloaderPage({
  platformId,
  platformName,
  slug,
  heading,
  introduction,
  metaTitle,
  metaDescription,
  supportedUrlExamples,
  howToSteps,
  commonProblems,
  faqs,
  relatedLinks,
  responsibleNotice,
}) {
  const path = `/${slug}`;

  return (
    <>
      <SEO title={metaTitle} description={metaDescription} path={path} noSuffix />
      <JsonLd data={[webApplicationSchema, faqPageSchema(faqs)]} />

      <section className="section platform-downloader-hero">
        <div className="container platform-downloader-hero-inner">
          <h1 className="platform-downloader-title">{heading}</h1>
          <p className="platform-downloader-intro">{introduction}</p>
          <DownloaderForm defaultPlatform={platformId} />
        </div>
      </section>

      <section className="section platform-downloader-body">
        <div className="container prose card seo-content platform-downloader-content">
          <section className="platform-downloader-block">
            <h2>How to download {platformName} videos</h2>
            <ol className="platform-downloader-steps">
              {howToSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="platform-downloader-block">
            <h2>Supported public link formats</h2>
            <p>These are common public URL patterns FityVid can often process for {platformName}:</p>
            <ul>
              {supportedUrlExamples.map((example) => (
                <li key={example}>
                  <code>{example}</code>
                </li>
              ))}
            </ul>
          </section>

          <section className="platform-downloader-block">
            <h2>Common errors and solutions</h2>
            <ul>
              {commonProblems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="notice-box platform-downloader-notice">{responsibleNotice}</div>

          <section className="platform-downloader-block">
            <h2>Frequently asked questions</h2>
            <div className="platform-downloader-faq">
              {faqs.map((item) => (
                <details key={item.q} className="faq-item card">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {relatedLinks.length > 0 && (
            <section className="platform-downloader-block">
              <h2>Other video downloaders</h2>
              <ul className="platform-downloader-related">
                {relatedLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/">FityVid home downloader</Link>
                </li>
              </ul>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
