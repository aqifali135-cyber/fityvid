import { useCallback, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Signup() {
  const { signup, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const busy = loading;

  const handleGoogleCredential = useCallback(
    async (response) => {
      if (!response?.credential) {
        setError('Google sign-in failed. Please try again.');
        return;
      }

      setError('');
      setLoading(true);
      try {
        await loginWithGoogle({ credential: response.credential });
        navigate('/account', { replace: true });
      } catch (err) {
        setError(err.message || 'Google sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [loginWithGoogle, navigate],
  );

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Sign Up | FityVid"
        description="Create a free FityVid account."
        path="/signup"
        noSuffix
      />
      <div className="auth-page">
        <form className="auth-card card" onSubmit={handleSubmit} noValidate>
          <div className="auth-card__header">
            <p className="auth-card__eyebrow">Get started</p>
            <h1 className="auth-card__title">Sign up</h1>
            <p className="auth-card__subtitle">Create your free FityVid account in seconds.</p>
          </div>

          {error && (
            <p className="auth-alert auth-alert--error" role="alert">
              {error}
            </p>
          )}

          <GoogleSignInButton onCredential={handleGoogleCredential} disabled={busy} />

          <div className="auth-divider" aria-hidden="true">
            <span>or create account with email</span>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="signup-name">
              Name
            </label>
            <input
              id="signup-name"
              className="input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="signup-confirm">
              Confirm Password
            </label>
            <input
              id="signup-confirm"
              className="input"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={busy}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {loading ? 'Creating account…' : 'Sign up'}
          </button>

          <p className="auth-card__footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </>
  );
}
