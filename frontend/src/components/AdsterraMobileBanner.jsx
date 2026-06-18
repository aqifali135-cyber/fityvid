import { ADSTERRA_MOBILE } from '../constants/adsterra';
import { useAdsterraIframe } from '../hooks/useAdsterraIframe';

const IFRAME_STYLE = {
  border: 'none',
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
};

export default function AdsterraMobileBanner() {
  const iframeRef = useAdsterraIframe(ADSTERRA_MOBILE, true);

  return (
    <>
      <p className="adsterra-banner-label">Advertisement</p>
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width={ADSTERRA_MOBILE.width}
        height={ADSTERRA_MOBILE.height}
        className="adsterra-banner-iframe adsterra-banner-iframe--mobile"
        scrolling="no"
        style={IFRAME_STYLE}
      />
    </>
  );
}
