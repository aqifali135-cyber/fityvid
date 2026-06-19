/** Temporary testing flag — set to true to re-enable Adsterra ads. */
export const ADS_ENABLED = false;

const DESKTOP_DEFAULT_KEY = 'd490373a510a21fa19dd628af58b29a3';
const MOBILE_DEFAULT_KEY = '5e714184b8e787316ca74140f7bab84e';

const desktopKey = import.meta.env.VITE_ADSTERRA_KEY?.trim() || DESKTOP_DEFAULT_KEY;
const mobileKey = import.meta.env.VITE_ADSTERRA_MOBILE_KEY?.trim() || MOBILE_DEFAULT_KEY;

export const ADSTERRA_DESKTOP = {
  key: desktopKey,
  invokeUrl:
    import.meta.env.VITE_ADSTERRA_INVOKE_URL?.trim() ||
    `https://www.highperformanceformat.com/${desktopKey}/invoke.js`,
  width: Number(import.meta.env.VITE_ADSTERRA_WIDTH) || 728,
  height: Number(import.meta.env.VITE_ADSTERRA_HEIGHT) || 90,
};

export const ADSTERRA_MOBILE = {
  key: mobileKey,
  invokeUrl:
    import.meta.env.VITE_ADSTERRA_MOBILE_INVOKE_URL?.trim() ||
    `https://www.highperformanceformat.com/${mobileKey}/invoke.js`,
  width: Number(import.meta.env.VITE_ADSTERRA_MOBILE_WIDTH) || 320,
  height: Number(import.meta.env.VITE_ADSTERRA_MOBILE_HEIGHT) || 50,
};

const SQUARE_DEFAULT_KEY = 'a3f921bcd75b2cf1a676b310613c53d9';
const squareKey = import.meta.env.VITE_ADSTERRA_SQUARE_KEY?.trim() || SQUARE_DEFAULT_KEY;

export const ADSTERRA_SQUARE = {
  key: squareKey,
  invokeUrl:
    import.meta.env.VITE_ADSTERRA_SQUARE_INVOKE_URL?.trim() ||
    `https://www.highperformanceformat.com/${squareKey}/invoke.js`,
  width: Number(import.meta.env.VITE_ADSTERRA_SQUARE_WIDTH) || 300,
  height: Number(import.meta.env.VITE_ADSTERRA_SQUARE_HEIGHT) || 250,
};

const FOOTER_DEFAULT_KEY = 'a049ce4089624e4be168a48480a99dfa';
const footerKey = import.meta.env.VITE_ADSTERRA_FOOTER_KEY?.trim() || FOOTER_DEFAULT_KEY;

export const ADSTERRA_FOOTER = {
  key: footerKey,
  invokeUrl:
    import.meta.env.VITE_ADSTERRA_FOOTER_INVOKE_URL?.trim() ||
    `https://www.highperformanceformat.com/${footerKey}/invoke.js`,
  width: Number(import.meta.env.VITE_ADSTERRA_FOOTER_WIDTH) || 468,
  height: Number(import.meta.env.VITE_ADSTERRA_FOOTER_HEIGHT) || 60,
};

/** @deprecated Use ADSTERRA_DESKTOP */
export const ADSTERRA_BANNER = ADSTERRA_DESKTOP;
