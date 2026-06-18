import { useEffect, useRef } from 'react';
import { buildAdsterraSrcDoc } from '../utils/adsterraIframe';

export function useAdsterraIframe(config, enabled = true) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const iframe = iframeRef.current;
    if (!iframe) {
      return undefined;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled || !iframeRef.current) {
        return;
      }

      if (iframeRef.current.dataset.adsterraLoaded === 'true') {
        return;
      }

      try {
        iframeRef.current.srcdoc = buildAdsterraSrcDoc(config);
        iframeRef.current.dataset.adsterraLoaded = 'true';
      } catch {
        // Ad load failure must not break the page
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);

      if (iframeRef.current) {
        iframeRef.current.removeAttribute('srcdoc');
        iframeRef.current.src = 'about:blank';
        delete iframeRef.current.dataset.adsterraLoaded;
      }
    };
  }, [enabled, config.key, config.width, config.height, config.invokeUrl]);

  return iframeRef;
}
