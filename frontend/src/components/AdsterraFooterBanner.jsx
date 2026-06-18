import { useEffect, useRef, useState } from 'react';
import { ADSTERRA_FOOTER } from '../constants/adsterra';
import './AdsterraFooterBanner.css';

const FOOTER_MEDIA = '(min-width: 500px)';

function injectAdsterraScript(container, config) {
  if (container.querySelector('script[data-adsterra="invoke-footer"]')) {
    return null;
  }

  const loadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  container.dataset.adsterraLoadId = loadId;

  window.atOptions = {
    key: config.key,
    format: 'iframe',
    height: config.height,
    width: config.width,
    params: {},
  };

  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.dataset.adsterra = 'invoke-footer';
  invokeScript.src = config.invokeUrl;
  invokeScript.async = true;
  invokeScript.onerror = () => {
    console.log('Adsterra footer banner script failed');
  };

  container.appendChild(invokeScript);
  return loadId;
}

function clearAdsterraContainer(container, loadId) {
  if (!container || container.dataset.adsterraLoadId !== loadId) {
    return;
  }

  delete container.dataset.adsterraLoadId;
  container.replaceChildren();
}

export default function AdsterraFooterBanner() {
  const containerRef = useRef(null);
  const loadIdRef = useRef(null);
  const [isWideEnough, setIsWideEnough] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(FOOTER_MEDIA).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(FOOTER_MEDIA);
    const onChange = (event) => setIsWideEnough(event.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isWideEnough) {
      return undefined;
    }

    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled || !containerRef.current || containerRef.current !== container) {
        return;
      }

      if (container.dataset.adsterraLoadId) {
        return;
      }

      try {
        const loadId = injectAdsterraScript(container, ADSTERRA_FOOTER);
        if (loadId) {
          loadIdRef.current = loadId;
        }
      } catch {
        console.log('Adsterra footer banner script failed');
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);

      if (loadIdRef.current) {
        clearAdsterraContainer(container, loadIdRef.current);
        loadIdRef.current = null;
      }
    };
  }, [isWideEnough]);

  if (!isWideEnough) {
    return null;
  }

  return (
    <aside className="adsterra-footer-wrap" aria-label="Advertisement">
      <p className="adsterra-footer-label">Advertisement</p>
      <div ref={containerRef} className="adsterra-footer-slot" />
    </aside>
  );
}
