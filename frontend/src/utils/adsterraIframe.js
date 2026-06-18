/**
 * Build isolated srcDoc for an Adsterra unit so atOptions does not leak to the parent page.
 */
export function buildAdsterraSrcDoc({ key, width, height, invokeUrl }) {
  const scriptUrl =
    invokeUrl || `https://www.highperformanceformat.com/${key}/invoke.js`;
  const atOptions = JSON.stringify({
    key,
    format: 'iframe',
    height,
    width,
    params: {},
  });

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:transparent;overflow:hidden;"><script>atOptions=${atOptions};</script><script src="${scriptUrl}"></script></body></html>`;
}
