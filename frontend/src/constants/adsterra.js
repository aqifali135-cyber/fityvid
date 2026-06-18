const key = import.meta.env.VITE_ADSTERRA_KEY?.trim() ?? '';
const invokeUrl = import.meta.env.VITE_ADSTERRA_INVOKE_URL?.trim() ?? '';

export const ADSTERRA_BANNER = {
  key,
  invokeUrl,
  width: Number(import.meta.env.VITE_ADSTERRA_WIDTH) || 728,
  height: Number(import.meta.env.VITE_ADSTERRA_HEIGHT) || 90,
  enabled: Boolean(key && invokeUrl),
};
