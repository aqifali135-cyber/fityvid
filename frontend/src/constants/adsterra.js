const DEFAULT_KEY = 'd490373a510a21fa19dd628af58b29a3';

const key = import.meta.env.VITE_ADSTERRA_KEY?.trim() || DEFAULT_KEY;
const invokeUrl =
  import.meta.env.VITE_ADSTERRA_INVOKE_URL?.trim() ||
  `https://www.highperformanceformat.com/${key}/invoke.js`;

export const ADSTERRA_BANNER = {
  key,
  invokeUrl,
  width: Number(import.meta.env.VITE_ADSTERRA_WIDTH) || 728,
  height: Number(import.meta.env.VITE_ADSTERRA_HEIGHT) || 90,
};
