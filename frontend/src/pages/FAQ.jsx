import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import './FAQ.css';

const FAQS = [
  {
    q: 'Which platforms does FityVid support?',
    a: 'FityVid supports YouTube, Facebook, TikTok, and Instagram only. No other platforms are supported.',
  },
  {
    q: 'Can I download private videos?',
    a: 'No. FityVid only works with publicly accessible content. Private videos are not supported.',
  },
  {
    q: 'Is FityVid affiliated with YouTube or Meta?',
    a: 'No. FityVid is an independent tool and is not affiliated with YouTube, Google, TikTok, ByteDance, Instagram, Facebook, or Meta.',
  },
  {
    q: 'How does the Hashtag Generator work?',
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
  return (
    <>
      <SEO title="FAQ" description="Frequently asked questions about FityVid video downloader and hashtag generator." />
      <PageHero title="FAQ" subtitle="Common questions about FityVid." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container faq-list">
          {FAQS.map((item) => (
            <details key={item.q} className="faq-item card">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
