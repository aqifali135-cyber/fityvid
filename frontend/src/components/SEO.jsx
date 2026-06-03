import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description }) {
  const fullTitle = title.includes('FityVid') ? title : `${title} | FityVid`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
