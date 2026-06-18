import { useEffect, useRef, useState } from 'react';
import { ADSTERRA_BANNER } from '../constants/adsterra';
import './AdsterraBanner.css';

const DESKTOP_MEDIA = '(min-width: 768px)';

function injectAdsterraScript(container) {
  if (container.querySelector('script[data-adsterra="invoke"]')) {
    return null;
  }

  const loadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  container.dataset.adsterraLoadId = loadId;

  window.atOptions = {
    key: ADSTERRA_BANNER.key,
    format: 'iframe',
    height: ADSTERRA_BANNER.height,
    width: ADSTERRA_BANNER.width,
    params: {},
  };

  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.dataset.adsterra = 'invoke';
  invokeScript.src = ADSTERRA_BANNER.invokeUrl;
  invokeScript.async = true;
  invokeScript.onload = () => {
    console.log('Adsterra script loaded');
  };
  invokeScript.onerror = () => {
    console.log('Adsterra script failed');
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

export default function AdsterraBanner() {
  const containerRef = useRef(null);
  const loadIdRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(DESKTOP_MEDIA).matches;
  });

  useEffect(() => {
    console.log('Adsterra banner component mounted');
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA);
    const onChange = (event) => setIsDesktop(event.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
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
        const loadId = injectAdsterraScript(container);
        if (loadId) {
          loadIdRef.current = loadId;
        }
      } catch {
        console.log('Adsterra script failed');
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
  }, [isDesktop]);

  if (!isDesktop) {
    return null;
  }

  return (
    <aside className="adsterra-banner-wrap" aria-label="Advertisement">
      <p className="adsterra-banner-label">Advertisement</p>
      <div ref={containerRef} className="adsterra-banner" />
    </aside>
  );
}
