import { useEffect, useRef } from 'react';
import { ADSTERRA_SQUARE } from '../constants/adsterra';
import './AdsterraSquareBanner.css';

function injectAdsterraScript(container, config) {
  if (container.querySelector('script[data-adsterra="invoke-square"]')) {
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
  invokeScript.dataset.adsterra = 'invoke-square';
  invokeScript.src = config.invokeUrl;
  invokeScript.async = true;
  invokeScript.onerror = () => {
    console.log('Adsterra square banner script failed');
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

export default function AdsterraSquareBanner() {
  const containerRef = useRef(null);
  const loadIdRef = useRef(null);

  useEffect(() => {
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
        const loadId = injectAdsterraScript(container, ADSTERRA_SQUARE);
        if (loadId) {
          loadIdRef.current = loadId;
        }
      } catch {
        console.log('Adsterra square banner script failed');
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
  }, []);

  return (
    <aside className="adsterra-square-wrap" aria-label="Advertisement">
      <p className="adsterra-square-label">Advertisement</p>
      <div ref={containerRef} className="adsterra-square-slot" />
    </aside>
  );
}
