import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../constants/seo';

/**
 * @param {string} title - Page title (use exact titles from seo config)
 * @param {string} description
 * @param {string} path - Canonical path e.g. "/faq"
 * @param {boolean} noSuffix - If true, do not append "| FityVid"
 */
export default function SEO({ title, description, path = '/', noSuffix = false }) {
  const pageTitle = noSuffix || title.includes('FityVid') ? title : `${title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const ogUrl = canonical;

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  );
}
