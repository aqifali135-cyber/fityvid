import { ADSTERRA_DESKTOP } from '../constants/adsterra';
import { useAdsterraIframe } from '../hooks/useAdsterraIframe';

const IFRAME_STYLE = {
  border: 'none',
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
};

export default function AdsterraDesktopBanner() {
  const iframeRef = useAdsterraIframe(ADSTERRA_DESKTOP, true);

  return (
    <>
      <p className="adsterra-banner-label">Advertisement</p>
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width={ADSTERRA_DESKTOP.width}
        height={ADSTERRA_DESKTOP.height}
        className="adsterra-banner-iframe adsterra-banner-iframe--desktop"
        scrolling="no"
        style={IFRAME_STYLE}
      />
    </>
  );
}
