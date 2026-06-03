import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import PageHero from '../components/PageHero';
import { PAGE_SEO } from '../constants/seo';
import { faqPageSchema } from '../constants/structuredData';
import './FAQ.css';

export const FAQS = [
  {
    q: 'Which platforms does FityVid support?',
    a: 'FityVid supports YouTube, TikTok, Instagram, and Facebook only. No other platforms are supported.',
  },
  {
    q: 'Can I download videos in HD with file size shown?',
    a: 'When the source offers multiple qualities, FityVid lists available options and file size details when possible so you can choose before downloading.',
  },
  {
    q: 'Can I download private videos?',
    a: 'No. FityVid only works with publicly accessible content. Private videos are not supported.',
  },
  {
    q: 'Does FityVid include a free hashtag generator?',
    a: 'Yes. FityVid offers a free hashtag generator for YouTube, TikTok, Instagram, and Facebook posts, reels, shorts, and videos.',
  },
  {
    q: 'Is FityVid affiliated with YouTube or Meta?',
    a: 'No. FityVid is not affiliated with YouTube, TikTok, Instagram, Facebook, Google, ByteDance, or Meta.',
  },
  {
    q: 'How does the hashtag generator work?',
    a: 'Enter a topic, choose your platform and hashtag style, and FityVid generates relevant hashtag suggestions for your posts.',
  },
  {
    q: 'Are hashtag suggestions guaranteed to rank?',
    a: 'No. Hashtag suggestions are for content discovery and planning only. Use relevant hashtags and avoid spammy or misleading tags.',
  },
  {
    q: 'Can I use downloaded videos anywhere?',
    a: 'Only if you own the content or have explicit permission from the rights holder. Respect copyright and platform terms.',
  },
];

export default function FAQ() {
  const seo = PAGE_SEO.faq;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <JsonLd data={faqPageSchema(FAQS)} />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Answers about our video downloader and hashtag generator."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container faq-list">
          {FAQS.map((item) => (
            <details key={item.q} className="faq-item card">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
          <p className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/contact" className="btn btn-primary">
              Contact Support
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
