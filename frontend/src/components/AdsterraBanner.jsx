import { useEffect, useState } from 'react';
import { ADS_ENABLED } from '../constants/adsterra';
import AdsterraDesktopBanner from './AdsterraDesktopBanner';
import AdsterraMobileBanner from './AdsterraMobileBanner';
import './AdsterraBanner.css';

const DESKTOP_MEDIA = '(min-width: 768px)';

export default function AdsterraBanner() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(DESKTOP_MEDIA).matches;
  });

  useEffect(() => {
    if (!ADS_ENABLED) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA);
    const onChange = (event) => setIsDesktop(event.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  if (!ADS_ENABLED) {
    return null;
  }

  return (
    <aside
      className={`adsterra-banner-wrap ${isDesktop ? 'adsterra-banner-wrap--desktop' : 'adsterra-banner-wrap--mobile'}`}
      aria-label="Advertisement"
    >
      {isDesktop ? <AdsterraDesktopBanner /> : <AdsterraMobileBanner />}
    </aside>
  );
}
