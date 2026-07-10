import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const { isAuthenticated, refreshCredits, refreshUser } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    refreshCredits?.();
    refreshUser?.();
    const timer = setTimeout(() => {
      refreshCredits?.();
      refreshUser?.();
    }, 2500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, refreshCredits, refreshUser]);

  return (
    <>
      <SEO
        title="Payment Successful | FityVid"
        description="Your FityVid credit purchase was successful."
        path="/payment-success"
        noSuffix
      />
      <div className="payment-success-page">
        <div className="payment-success-card">
          <div className="payment-success-card__icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="payment-success-card__title">Payment successful</h1>
          <p className="payment-success-card__text">
            Thanks for your purchase. Your credits will be added to your account automatically
            once Lemon Squeezy confirms the payment.
          </p>
          <p className="payment-success-card__hint">
            This usually takes a few seconds. Refresh My Account if your balance has not updated yet.
          </p>
          <div className="payment-success-card__actions">
            <Link to="/account" className="payment-success-card__btn">
              Go to My Account
            </Link>
            <Link to="/pricing" className="payment-success-card__link">
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
