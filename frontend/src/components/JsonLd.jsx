import { Helmet } from 'react-helmet-async';

export default function JsonLd({ data }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <Helmet>
      {json.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
