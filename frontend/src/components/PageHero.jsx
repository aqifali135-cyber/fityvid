import Logo from './Logo';

export default function PageHero({ title, subtitle, children, showLogo = true }) {
  return (
    <div className="page-hero">
      <div className="container">
        {showLogo && (
          <div className="page-hero-logo">
            <Logo size="hero" showText />
          </div>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
