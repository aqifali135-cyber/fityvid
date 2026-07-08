import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/platforms', label: 'Platforms' },
  { to: '/hashtag-generator', label: 'Hashtag Generator' },
  { to: '/stylish-text-generator', label: 'Stylish Text' },
  { to: '/download-guide', label: 'Download Guide' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginNotice, setLoginNotice] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setLoginNotice(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!loginNotice) return undefined;
    const timer = setTimeout(() => setLoginNotice(false), 2800);
    return () => clearTimeout(timer);
  }, [loginNotice]);

  function handleLoginClick() {
    setLoginNotice(true);
  }

  return (
    <header className="navbar">
      <div className="navbar-shell">
        <div className="navbar-glass">
          <Logo size="nav" showText onClick={() => setOpen(false)} />
          <button
            type="button"
            className="navbar-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`navbar-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setOpen(false)}
              >
                <span className="nav-link__label">{label}</span>
              </NavLink>
            ))}
            <div className="navbar-login-wrap">
              <button
                type="button"
                className="navbar-login-btn"
                onClick={handleLoginClick}
                aria-describedby={loginNotice ? 'navbar-login-notice' : undefined}
              >
                Login
              </button>
              {loginNotice && (
                <p id="navbar-login-notice" className="navbar-login-notice" role="status">
                  Login system coming soon
                </p>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
