import { useEffect, useState } from 'react';
import { ADSTERRA_DESKTOP, ADSTERRA_MOBILE } from '../constants/adsterra';
import { useAdsterraIframe } from '../hooks/useAdsterraIframe';
import './AdsterraBanner.css';

const DESKTOP_MEDIA = '(min-width: 768px)';

const IFRAME_STYLE = {
  border: 'none',
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
};

export default function AdsterraBanner() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(DESKTOP_MEDIA).matches;
  });

  const config = isDesktop ? ADSTERRA_DESKTOP : ADSTERRA_MOBILE;
  const iframeRef = useAdsterraIframe(config, true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA);
    const onChange = (event) => setIsDesktop(event.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return (
    <aside
      className={`adsterra-banner-wrap ${isDesktop ? 'adsterra-banner-wrap--desktop' : 'adsterra-banner-wrap--mobile'}`}
      aria-label="Advertisement"
    >
      <p className="adsterra-banner-label">Advertisement</p>
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width={config.width}
        height={config.height}
        className={`adsterra-banner-iframe ${isDesktop ? 'adsterra-banner-iframe--desktop' : 'adsterra-banner-iframe--mobile'}`}
        scrolling="no"
        style={IFRAME_STYLE}
      />
    </aside>
  );
}
