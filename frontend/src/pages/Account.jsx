import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { fetchCreditTransactions } from '../api/credits';
import './AuthPages.css';

function formatTransactionType(type) {
  if (type === 'signup_bonus') return 'Signup bonus';
  if (type === 'spend') return 'Credits used';
  if (type === 'refund') return 'Refund';
  if (type === 'purchase') return 'Purchase';
  if (type === 'purchase_pending') return 'Purchase';
  return type;
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingTransactions(true);
      try {
        const data = await fetchCreditTransactions(10);
        if (!cancelled && data?.success) {
          setTransactions(data.transactions || []);
        }
      } catch {
        if (!cancelled) setTransactions([]);
      } finally {
        if (!cancelled) setLoadingTransactions(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.creditBalance]);

  async function handleLogout() {
    setError('');
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      setError('Unable to log out. Please try again.');
      setLoggingOut(false);
    }
  }

  return (
    <>
      <SEO
        title="My Account | FityVid"
        description="Manage your FityVid account, credits, and login session."
        path="/account"
        noSuffix
      />
      <div className="auth-page">
        <div className="auth-card card account-card">
          <div className="auth-card__header">
            <p className="auth-card__eyebrow">Your profile</p>
            <h1 className="auth-card__title">My Account</h1>
            <p className="auth-card__subtitle">View your account details and credit balance.</p>
          </div>

          {error && (
            <p className="auth-alert auth-alert--error" role="alert">
              {error}
            </p>
          )}

          <div className="account-details">
            <div className="account-row">
              <span className="account-label">Name</span>
              <span className="account-value">{user?.name}</span>
            </div>
            <div className="account-row">
              <span className="account-label">Email</span>
              <span className="account-value">{user?.email}</span>
            </div>
            <div className="account-row">
              <span className="account-label">Status</span>
              <span className="account-value account-value--status">Active</span>
            </div>
            <div className="account-row">
              <span className="account-label">Credit Balance</span>
              <span className="account-value">{user?.creditBalance ?? 0} credits</span>
            </div>
          </div>

          <Link to="/pricing" className="btn btn-secondary btn-block account-buy-credits">
            Buy Credits
          </Link>

          <div className="account-transactions">
            <h2 className="account-transactions__title">Recent credit activity</h2>
            {loadingTransactions ? (
              <p className="account-transactions__empty">Loading transactions…</p>
            ) : transactions.length === 0 ? (
              <p className="account-transactions__empty">No credit activity yet.</p>
            ) : (
              <ul className="account-transactions__list">
                {transactions.map((tx) => (
                  <li key={tx.id} className="account-transactions__item">
                    <div>
                      <strong>{formatTransactionType(tx.type)}</strong>
                      {tx.description && <span> — {tx.description}</span>}
                    </div>
                    <div className="account-transactions__meta">
                      <span className={tx.amount >= 0 ? 'account-tx--plus' : 'account-tx--minus'}>
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                      <span>Balance: {tx.balanceAfter}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      </div>
    </>
  );
}
