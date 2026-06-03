import PageHero from './PageHero';

export default function PolicyLayout({ title, children, showLogo = true }) {
  return (
    <>
      <PageHero title={title} showLogo={showLogo} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose card">{children}</div>
      </section>
    </>
  );
}
