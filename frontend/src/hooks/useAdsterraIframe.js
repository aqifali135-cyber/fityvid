import { useEffect, useRef } from 'react';
import { ADS_ENABLED } from '../constants/adsterra';
import { buildAdsterraSrcDoc } from '../utils/adsterraIframe';

const activeUnitKeys = new Set();

export function useAdsterraIframe(config, enabled = true) {
  const iframeRef = useRef(null);
  const loadSessionRef = useRef(0);

  useEffect(() => {
    if (!ADS_ENABLED || !enabled) {
      return undefined;
    }

    const iframe = iframeRef.current;
    if (!iframe) {
      return undefined;
    }

    const unitKey = config.key;
    const loadSession = ++loadSessionRef.current;
    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      if (
        cancelled ||
        loadSession !== loadSessionRef.current ||
        !iframeRef.current
      ) {
        return;
      }

      const target = iframeRef.current;

      if (target.dataset.adsterraLoaded === 'true') {
        return;
      }

      if (activeUnitKeys.has(unitKey)) {
        return;
      }

      try {
        target.srcdoc = buildAdsterraSrcDoc(config);
        target.dataset.adsterraLoaded = 'true';
        target.dataset.adsterraKey = unitKey;
        activeUnitKeys.add(unitKey);
      } catch {
        // Ad load failure must not break the page
      }
    }, 0);

    return () => {
      cancelled = true;
      loadSessionRef.current += 1;
      window.clearTimeout(timeoutId);

      const target = iframeRef.current;
      if (target?.dataset.adsterraKey === unitKey) {
        target.removeAttribute('srcdoc');
        target.src = 'about:blank';
        delete target.dataset.adsterraLoaded;
        delete target.dataset.adsterraKey;
        activeUnitKeys.delete(unitKey);
      }
    };
  }, [enabled, config.key, config.width, config.height, config.invokeUrl]);

  return iframeRef;
}
