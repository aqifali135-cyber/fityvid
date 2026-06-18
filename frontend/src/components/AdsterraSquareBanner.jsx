import { ADSTERRA_SQUARE } from '../constants/adsterra';
import { useAdsterraIframe } from '../hooks/useAdsterraIframe';
import './AdsterraSquareBanner.css';

const IFRAME_STYLE = {
  border: 'none',
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
};

export default function AdsterraSquareBanner() {
  const iframeRef = useAdsterraIframe(ADSTERRA_SQUARE, true);

  return (
    <aside className="adsterra-square-wrap" aria-label="Advertisement">
      <p className="adsterra-square-label">Advertisement</p>
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width={ADSTERRA_SQUARE.width}
        height={ADSTERRA_SQUARE.height}
        className="adsterra-square-iframe"
        scrolling="no"
        style={IFRAME_STYLE}
      />
    </aside>
  );
}
