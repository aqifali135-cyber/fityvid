import { Link } from 'react-router-dom';
import './HashtagLanding.css';

/**
 * Shared SEO content blocks for hashtag landing and generator pages.
 */
export default function HashtagSeoSections({
  intro = [],
  howItWorks,
  platformTips,
  examples,
  bestPractices,
  commonMistakes,
  faq = [],
  relatedLinks = [],
  relatedLinksTitle = 'Related tools',
  showBottomCta = true,
  disclaimer,
}) {
  const disclaimerText =
    disclaimer ??
    'Hashtags help organize posts and may help people discover your content. They do not guarantee views, followers, or ranking. Results depend on your content, audience, and each platform\'s systems.';
  return (
    <div className="hashtag-seo-sections">
      {intro.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}

      {howItWorks && (
        <section className="hashtag-seo-block">
          <h2>{howItWorks.title}</h2>
          {howItWorks.paragraphs?.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {howItWorks.steps?.length > 0 && (
            <ol className="hashtag-steps">
              {howItWorks.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </section>
      )}

      {platformTips && (
        <section className="hashtag-seo-block">
          <h2>{platformTips.title}</h2>
          {platformTips.paragraphs?.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {platformTips.list?.length > 0 && (
            <ul>
              {platformTips.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {examples && (
        <section className="hashtag-seo-block">
          <h2>{examples.title}</h2>
          {examples.paragraphs?.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {examples.groups?.map((group) => (
            <div key={group.label} className="hashtag-examples-group">
              <h3>{group.label}</h3>
              <p className="hashtag-examples-tags">{group.tags.join(' ')}</p>
            </div>
          ))}
          {examples.note && <p className="hashtag-examples-note">{examples.note}</p>}
        </section>
      )}

      {bestPractices && (
        <section className="hashtag-seo-block">
          <h2>{bestPractices.title}</h2>
          <ul>
            {bestPractices.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {commonMistakes && (
        <section className="hashtag-seo-block">
          <h2>{commonMistakes.title}</h2>
          <ul>
            {commonMistakes.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="notice-box hashtag-disclaimer">{disclaimerText}</div>

      {faq.length > 0 && (
        <section className="hashtag-seo-block">
          <h2>Frequently asked questions</h2>
          <div className="hashtag-faq-list">
            {faq.map((item) => (
              <details key={item.q} className="faq-item card">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {relatedLinks.length > 0 && (
        <section className="hashtag-seo-block">
          <h2>{relatedLinksTitle}</h2>
          <ul className="hashtag-related-links">
            {relatedLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showBottomCta && (
        <p className="hashtag-bottom-cta">
          <Link to="/hashtag-generator" className="btn btn-primary">
            Open free hashtag generator
          </Link>
        </p>
      )}
    </div>
  );
}
