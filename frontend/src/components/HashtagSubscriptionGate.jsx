import { useState } from 'react';
import './HashtagSubscriptionGate.css';

export const HASHTAG_FREE_SEARCH_KEY = 'fityvid_hashtag_free_search_used';

export function isHashtagFreeSearchUsed() {
  try {
    return localStorage.getItem(HASHTAG_FREE_SEARCH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markHashtagFreeSearchUsed() {
  try {
    localStorage.setItem(HASHTAG_FREE_SEARCH_KEY, 'true');
  } catch {
    // localStorage may be unavailable in private mode
  }
}

const PLANS = [
  {
    id: 'basic',
    name: 'Hashtag Basic',
    monthly: 4.99,
    annual: 39.99,
    features: [
      'Hashtag Generator',
      '30 hashtags per search',
      'Instagram hashtags',
      'TikTok hashtags',
      'YouTube hashtags',
      'Copy hashtags',
      'Basic hashtag ideas',
    ],
  },
  {
    id: 'creator',
    name: 'Creator Tools',
    monthly: 9.99,
    annual: 79.99,
    popular: true,
    features: [
      'Everything in Hashtag Basic',
      'Unlimited hashtag searches',
      'Platform-wise hashtags',
      'Viral hashtag ideas',
      'Better hashtag mix',
      'Saved hashtag sets',
      'Priority updates',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Growth',
    monthly: 19.99,
    annual: 149.99,
    features: [
      'Everything in Creator Tools',
      'Advanced hashtag research',
      'Social growth tools',
      'Downloader access',
      'Profile tools',
      'Premium support',
      'Future AI tools access',
    ],
  },
];

function formatPrice(amount) {
  return amount.toFixed(2);
}

export default function HashtagSubscriptionGate() {
  const [billing, setBilling] = useState('monthly');
  const [paymentNotice, setPaymentNotice] = useState('');

  function handleSelectPlan() {
    setPaymentNotice('Payment system will be available soon.');
    setTimeout(() => setPaymentNotice(''), 4000);
  }

  return (
    <section
      id="hashtag-subscription-gate"
      className="hashtag-subscription-gate card"
      aria-labelledby="hashtag-subscription-title"
    >
      <div className="hashtag-subscription-gate__header">
        <p className="hashtag-subscription-gate__notice">
          You have used your free hashtag search. Upgrade to continue.
        </p>
        <h2 id="hashtag-subscription-title" className="hashtag-subscription-gate__title">
          Choose your plan
        </h2>
        <p className="hashtag-subscription-gate__subtitle">
          Unlock unlimited hashtag searches and platform-wise results for your content.
        </p>

        <div className="hashtag-subscription-gate__toggle" role="group" aria-label="Billing period">
          <button
            type="button"
            className={`hashtag-subscription-gate__toggle-btn${billing === 'monthly' ? ' hashtag-subscription-gate__toggle-btn--active' : ''}`}
            aria-pressed={billing === 'monthly'}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`hashtag-subscription-gate__toggle-btn${billing === 'annual' ? ' hashtag-subscription-gate__toggle-btn--active' : ''}`}
            aria-pressed={billing === 'annual'}
            onClick={() => setBilling('annual')}
          >
            Annual
            <span className="hashtag-subscription-gate__save">Save</span>
          </button>
        </div>
      </div>

      <div className="hashtag-subscription-gate__plans">
        {PLANS.map((plan) => {
          const isAnnual = billing === 'annual';
          const price = isAnnual ? plan.annual : plan.monthly;
          const period = isAnnual ? '/year' : '/month';

          return (
            <article
              key={plan.id}
              className={`hashtag-subscription-plan${plan.popular ? ' hashtag-subscription-plan--popular' : ''}`}
            >
              {plan.popular && (
                <span className="hashtag-subscription-plan__badge">Most Popular</span>
              )}
              <h3 className="hashtag-subscription-plan__name">{plan.name}</h3>
              <div className="hashtag-subscription-plan__price">
                <span className="hashtag-subscription-plan__amount">${formatPrice(price)}</span>
                <span className="hashtag-subscription-plan__period">{period}</span>
              </div>
              {isAnnual && (
                <p className="hashtag-subscription-plan__equiv">
                  ${formatPrice(plan.annual / 12)}/mo billed annually
                </p>
              )}
              <ul className="hashtag-subscription-plan__features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className="hashtag-subscription-plan__cta"
                onClick={handleSelectPlan}
              >
                Select Payment Method
              </button>
            </article>
          );
        })}
      </div>

      {paymentNotice && (
        <p className="hashtag-subscription-gate__payment-msg" role="status">
          Payment system will be available soon.
        </p>
      )}
    </section>
  );
}
