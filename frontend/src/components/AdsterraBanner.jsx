import { useEffect, useRef, useState } from 'react';
import { ADSTERRA_BANNER } from '../constants/adsterra';
import './AdsterraBanner.css';

const DESKTOP_MEDIA = '(min-width: 768px)';

function injectAdsterraScripts(container) {
  const loadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  container.dataset.adsterraLoadId = loadId;

  const configScript = document.createElement('script');
  configScript.type = 'text/javascript';
  configScript.dataset.adsterra = 'config';
  configScript.textContent = `atOptions = ${JSON.stringify({
    key: ADSTERRA_BANNER.key,
    format: 'iframe',
    height: ADSTERRA_BANNER.height,
    width: ADSTERRA_BANNER.width,
    params: {},
  })};`;

  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.dataset.adsterra = 'invoke';
  invokeScript.src = ADSTERRA_BANNER.invokeUrl;
  invokeScript.async = true;

  container.appendChild(configScript);
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
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA);
    const onChange = (event) => setIsDesktop(event.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!ADSTERRA_BANNER.enabled || !isDesktop) {
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

      const loadId = injectAdsterraScripts(container);
      loadIdRef.current = loadId;
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

  if (!ADSTERRA_BANNER.enabled) {
    return null;
  }

  return (
    <aside className="adsterra-banner-wrap" aria-label="Advertisement">
      <div ref={containerRef} className="adsterra-banner" />
    </aside>
  );
}
