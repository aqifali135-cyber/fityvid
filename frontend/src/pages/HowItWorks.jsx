import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import { PAGE_SEO } from '../constants/seo';
import '../components/SeoProse.css';
import './HowItWorks.css';

const STEPS = [
  {
    title: 'Copy the video URL',
    text: 'Open YouTube, TikTok, Instagram, or Facebook and copy a public video link you are allowed to use.',
  },
  {
    title: 'Paste on FityVid',
    text: 'Paste the link into our free online video downloader on the home page. FityVid detects the platform automatically.',
  },
  {
    title: 'Choose quality and file size',
    text: 'Review available formats, including HD options when offered. File size details help you pick the right download.',
  },
  {
    title: 'Download responsibly',
    text: 'Save the video only if you own it or have permission. FityVid does not support private or restricted content.',
  },
];

export default function HowItWorks() {
  const seo = PAGE_SEO.howItWorks;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PageHero
        title="How FityVid Works"
        subtitle="Download videos online in a few simple steps."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="how-steps-grid">
            {STEPS.map((step, i) => (
              <article key={step.title} className="how-step-card">
                <span className="how-step-number" aria-hidden="true">
                  {i + 1}
                </span>
                <h2 className="how-step-title">{step.title}</h2>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="seo-content" style={{ marginTop: '2.5rem' }}>
            <p>
              FityVid only supports publicly accessible content. Please download only your
              own content or content you have permission to use.
            </p>
            <p>
              <Link to="/download-guide">Read the download guide</Link> ·{' '}
              <Link to="/platforms">Supported platforms</Link>
            </p>
          </div>
          <p className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn btn-primary">
              Try Video Downloader
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
