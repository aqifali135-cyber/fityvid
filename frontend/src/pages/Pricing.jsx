import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { createCheckout } from '../api/payments';
import './Pricing.css';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 200,
    priceLabel: 'PKR 1,499',
    uses: 10,
    icon: 'rocket',
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 600,
    priceLabel: 'PKR 2,999',
    uses: 30,
    popular: true,
    icon: 'star',
  },
  {
    id: 'growth',
    name: 'Growth Pack',
    credits: 1500,
    priceLabel: 'PKR 5,999',
    uses: 75,
    icon: 'chart',
  },
  {
    id: 'business',
    name: 'Business Pack',
    credits: 4000,
    priceLabel: 'PKR 11,999',
    uses: 200,
    icon: 'briefcase',
  },
];

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 7H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 11h.01" strokeLinecap="round" />
      <path d="M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function PackIcon({ type }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (type) {
    case 'rocket':
      return (
        <svg {...props}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case 'star':
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...props}>
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 5-6" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...props}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loadingPackage, setLoadingPackage] = useState('');
  const [notice, setNotice] = useState('');

  async function handleBuyClick(packageKey) {
    setNotice('');

    if (authLoading) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    setLoadingPackage(packageKey);
    try {
      const data = await createCheckout({ packageKey });
      if (!data?.checkoutUrl) {
        throw new Error('Checkout URL missing. Please try again.');
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      if (err.status === 401) {
        navigate('/login', { state: { from: '/pricing' } });
        return;
      }
      setNotice(err.message || 'Unable to start checkout. Please try again.');
      setTimeout(() => setNotice(''), 5000);
    } finally {
      setLoadingPackage('');
    }
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
        <div className="pricing-page__inner">
          <header className="pricing-header">
            <div className="pricing-header__icon" aria-hidden="true">
              <WalletIcon />
            </div>
            <h1 className="pricing-header__title">Buy Credits</h1>
            <p className="pricing-header__subtitle">
              Use credits for hashtag searches, stylish text, and video downloads.
            </p>
            <p className="pricing-header__badge">Each tool use costs 20 credits.</p>
          </header>

          <div className="pricing-grid">
            {PACKAGES.map((pack) => {
              const busy = loadingPackage === pack.id;
              return (
                <article
                  key={pack.id}
                  className={`pricing-card${pack.popular ? ' pricing-card--popular' : ''}`}
                >
                  {pack.popular && <span className="pricing-card__badge">Popular</span>}
                  <div
                    className={`pricing-card__icon pricing-card__icon--${pack.icon}${
                      pack.icon === 'star' ? ' pricing-card__icon--accent' : ''
                    }`}
                  >
                    <PackIcon type={pack.icon} />
                  </div>
                  <h2 className="pricing-card__name">{pack.name}</h2>
                  <div className="pricing-card__credits">{pack.credits.toLocaleString()} Credits</div>
                  <div className="pricing-card__price">{pack.priceLabel}</div>
                  <p className="pricing-card__uses">Good for {pack.uses} tool uses</p>
                  <button
                    type="button"
                    className="pricing-card__btn"
                    onClick={() => handleBuyClick(pack.id)}
                    disabled={Boolean(loadingPackage)}
                  >
                    {busy ? 'Redirecting…' : 'Buy Credits'}
                  </button>
                </article>
              );
            })}
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
