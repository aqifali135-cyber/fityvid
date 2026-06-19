import { useEffect } from 'react';
import { ADS_ENABLED } from '../constants/adsterra';

const POPUNDER_SCRIPT_ID = 'adsterra-popunder';
const POPUNDER_SCRIPT_SRC =
  'https://pl29799711.effectivecpmnetwork.com/d3/06/be/d306beae1bea0a1fc39e84ed3091ceba.js';

export default function AdsterraPopunder() {
  useEffect(() => {
    if (!ADS_ENABLED) {
      return undefined;
    }

    if (
      document.getElementById(POPUNDER_SCRIPT_ID) ||
      document.querySelector(`script[src="${POPUNDER_SCRIPT_SRC}"]`)
    ) {
      return undefined;
    }

    try {
      const script = document.createElement('script');
      script.id = POPUNDER_SCRIPT_ID;
      script.src = POPUNDER_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    } catch {
      // Popunder load failure must not break the page
    }

    return undefined;
  }, []);

  return null;
}
