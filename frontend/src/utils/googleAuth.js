const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
let scriptPromise = null;

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';
}

export function isGoogleAuthConfigured() {
  return Boolean(getGoogleClientId());
}

export function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google sign-in is only available in the browser.'));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Google sign-in.')), {
          once: true,
        });
        return;
      }

      const script = document.createElement('script');
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google sign-in.'));
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
}

export async function initGoogleSignIn({ onCredential, buttonRef, width = 360 }) {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error('Google sign-in is not configured.');
  }

  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.id) {
    throw new Error('Google sign-in is unavailable.');
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: onCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  if (buttonRef?.current) {
    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: width || buttonRef.current.offsetWidth || 360,
      logo_alignment: 'left',
    });
  }
}
