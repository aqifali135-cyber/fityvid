import { useEffect, useState } from 'react';
import { ADSTERRA_FOOTER } from '../constants/adsterra';
import { useAdsterraIframe } from '../hooks/useAdsterraIframe';
import './AdsterraFooterBanner.css';

const FOOTER_MEDIA = '(min-width: 500px)';

const IFRAME_STYLE = {
  border: 'none',
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
};

export default function AdsterraFooterBanner() {
  const [isWideEnough, setIsWideEnough] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(FOOTER_MEDIA).matches;
  });

  const iframeRef = useAdsterraIframe(ADSTERRA_FOOTER, isWideEnough);

  useEffect(() => {
    const mediaQuery = window.matchMedia(FOOTER_MEDIA);
    const onChange = (event) => setIsWideEnough(event.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  if (!isWideEnough) {
    return null;
  }

  return (
    <aside className="adsterra-footer-wrap" aria-label="Advertisement">
      <p className="adsterra-footer-label">Advertisement</p>
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width={ADSTERRA_FOOTER.width}
        height={ADSTERRA_FOOTER.height}
        className="adsterra-footer-iframe"
        scrolling="no"
        style={IFRAME_STYLE}
      />
    </aside>
  );
}
