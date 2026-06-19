import { ADS_ENABLED, ADSTERRA_SQUARE } from '../constants/adsterra';
import { useAdsterraIframe } from '../hooks/useAdsterraIframe';
import './AdsterraSquareBanner.css';

const IFRAME_STYLE = {
  border: 'none',
  display: 'block',
  overflow: 'hidden',
};

export default function AdsterraSquareBanner() {
  const iframeRef = useAdsterraIframe(ADSTERRA_SQUARE, ADS_ENABLED);

  if (!ADS_ENABLED) {
    return null;
  }

  return (
    <aside className="adsterra-square-wrap" aria-label="Advertisement">
      <div className="adsterra-square-inner">
        <p className="adsterra-square-label">Advertisement</p>
        <iframe
          ref={iframeRef}
          title="Advertisement"
          width={300}
          height={250}
          className="adsterra-square-iframe"
          scrolling="no"
          style={IFRAME_STYLE}
        />
      </div>
    </aside>
  );
}
