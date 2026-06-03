import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import './HowItWorks.css';

const STEPS = [
  { title: 'Copy the video URL', text: 'Open YouTube, Facebook, TikTok, or Instagram and copy the public video link.' },
  { title: 'Paste on FityVid', text: 'Paste the link into the downloader on the home page and submit.' },
  { title: 'Review platform info', text: 'FityVid validates the URL and confirms the platform. Only permitted public content is supported.' },
  { title: 'Download responsibly', text: 'Download only content you own or have explicit permission to use.' },
];

export default function HowItWorks() {
  return (
    <>
      <SEO title="How It Works" description="Learn how to use FityVid to download videos from YouTube, TikTok, Instagram, and Facebook." />
      <PageHero title="How It Works" subtitle="Simple steps to use FityVid safely and responsibly." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="how-steps-grid">
            {STEPS.map((step, i) => (
              <article key={step.title} className="how-step-card">
                <span className="how-step-number" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <p className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn btn-primary">Try Downloader</Link>
          </p>
        </div>
      </section>
    </>
  );
}
