import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getGoogleClientId, initGoogleSignIn, isGoogleAuthConfigured } from '../utils/googleAuth';

function GoogleIcon() {
  return (
    <svg className="google-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function measureButtonWidth(element) {
  if (!element) return 360;
  const width = element.getBoundingClientRect().width;
  return Math.max(Math.floor(width), 240);
}

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const overlayRef = useRef(null);
  const wrapperRef = useRef(null);
  const onCredentialRef = useRef(onCredential);
  const [ready, setReady] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const configured = isGoogleAuthConfigured();

  onCredentialRef.current = onCredential;

  useLayoutEffect(() => {
    if (!configured || disabled) {
      setReady(false);
      return undefined;
    }

    let cancelled = false;
    setInitializing(true);
    setLoadError('');

    async function mountGoogleButton() {
      try {
        const width = measureButtonWidth(wrapperRef.current);
        await initGoogleSignIn({
          onCredential: (response) => onCredentialRef.current?.(response),
          buttonRef: overlayRef,
          width,
        });
        if (!cancelled) {
          setReady(true);
          setLoadError('');
        }
      } catch (err) {
        if (!cancelled) {
          setReady(false);
          setLoadError(err.message || 'Google sign-in is unavailable.');
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    }

    mountGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [configured, disabled]);

  useEffect(() => {
    if (!configured || disabled || !ready) return undefined;

    function handleResize() {
      const width = measureButtonWidth(wrapperRef.current);
      if (overlayRef.current && window.google?.accounts?.id) {
        overlayRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(overlayRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width,
          logo_alignment: 'left',
        });
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [configured, disabled, ready]);

  const inactive = disabled || initializing || !configured || !ready;

  return (
    <div className={`google-signin${inactive ? ' google-signin--inactive' : ''}`}>
      <div ref={wrapperRef} className="google-signin__surface">
        <div
          className={`google-btn${disabled ? ' google-btn--disabled' : ''}${
            initializing ? ' google-btn--loading' : ''
          }`}
        >
          <GoogleIcon />
          <span>{initializing ? 'Loading Google sign-in…' : 'Continue with Google'}</span>
        </div>
        {configured && (
          <div
            ref={overlayRef}
            className={`google-btn-overlay${inactive ? ' google-btn-overlay--hidden' : ''}`}
            aria-label="Continue with Google"
            title="Continue with Google"
          />
        )}
      </div>
      {!configured && (
        <p className="google-signin__hint" role="status">
          Google sign-in requires <code>VITE_GOOGLE_CLIENT_ID</code> in your frontend environment.
        </p>
      )}
      {loadError && (
        <p className="auth-alert auth-alert--error google-signin__error" role="alert">
          {loadError}
        </p>
      )}
    </div>
  );
}
