import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Pricing.css';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 200,
    price: 4.99,
    uses: 10,
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 600,
    price: 9.99,
    uses: 30,
    popular: true,
  },
  {
    id: 'growth',
    name: 'Growth Pack',
    credits: 1500,
    price: 19.99,
    uses: 75,
  },
  {
    id: 'business',
    name: 'Business Pack',
    credits: 4000,
    price: 39.99,
    uses: 200,
  },
];

export default function Pricing() {
  const [notice, setNotice] = useState('');

  function handleBuyClick() {
    setNotice('Payment system will be available soon.');
    setTimeout(() => setNotice(''), 4000);
  }

  return (
    <>
      <SEO
        title="Buy Credits | FityVid"
        description="Buy FityVid credits for hashtag searches, stylish text generation, and video downloads."
        path="/pricing"
        noSuffix
      />
      <div className="pricing-page">
        <div className="container">
          <header className="pricing-header">
            <h1 className="pricing-header__title">Buy Credits</h1>
            <p className="pricing-header__subtitle">
              Use credits for hashtag searches, stylish text, and video downloads.
            </p>
            <p className="pricing-header__note">Each tool use costs 20 credits.</p>
          </header>

          <div className="pricing-grid">
            {PACKAGES.map((pack) => (
              <article
                key={pack.id}
                className={`pricing-card card${pack.popular ? ' pricing-card--popular' : ''}`}
              >
                {pack.popular && <span className="pricing-card__badge">Popular</span>}
                <h2 className="pricing-card__name">{pack.name}</h2>
                <div className="pricing-card__credits">{pack.credits.toLocaleString()} Credits</div>
                <div className="pricing-card__price">${pack.price.toFixed(2)}</div>
                <p className="pricing-card__uses">Good for {pack.uses} tool uses</p>
                <button type="button" className="btn btn-primary btn-block" onClick={handleBuyClick}>
                  Buy Credits
                </button>
              </article>
            ))}
          </div>

          {notice && (
            <p className="pricing-notice" role="status">
              {notice}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
