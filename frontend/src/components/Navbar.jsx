import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/how-it-works', label: 'How It Works', icon: 'how' },
  { to: '/platforms', label: 'Platforms', icon: 'platforms' },
  { to: '/tiktok-video-downloader', label: 'TikTok Downloader', icon: 'tiktok' },
  { to: '/hashtag-generator', label: 'Hashtag Generator', icon: 'hashtag' },
  { to: '/stylish-text-generator', label: 'Stylish Text', icon: 'text' },
  { to: '/pricing', label: 'Pricing', icon: 'pricing' },
  { to: '/contact', label: 'Contact', icon: 'contact' },
];

function NavIcon({ name }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
        </svg>
      );
    case 'how':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case 'platforms':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...props}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 19h14" />
        </svg>
      );
    case 'hashtag':
      return (
        <svg {...props}>
          <path d="M10 3 8 21M16 3l-2 18M4 8h16M3 16h16" />
        </svg>
      );
    case 'text':
      return (
        <svg {...props}>
          <path d="M6 4h12M9 4v16M15 4v16M7 20h10" />
        </svg>
      );
    case 'pricing':
      return (
        <svg {...props}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'contact':
      return (
        <svg {...props}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      );
    default:
      return null;
  }
}

function LoginIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    setOpen(false);
    await logout();
    navigate('/login');
  }

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || 'Account';

  return (
    <header className="navbar">
      <div className="navbar-shell">
        <div className="navbar-glass">
          <div className="navbar-brand">
            <Logo size="nav" showText onClick={() => setOpen(false)} />
          </div>

          <nav className={`navbar-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setOpen(false)}
                isActive={
                  to === '/hashtag-generator'
                    ? (match, { pathname }) =>
                        match || pathname.includes('hashtag-generator')
                    : undefined
                }
              >
                <span className="nav-link__label">
                  <span className="nav-link__icon">
                    <NavIcon name={icon} />
                  </span>
                  {label}
                </span>
                <span className="nav-link__dot" aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions" ref={menuRef}>
            {loading ? (
              <span className="navbar-auth-loading" aria-hidden="true">
                …
              </span>
            ) : isAuthenticated ? (
              <>
                <span className="navbar-credits" aria-label={`Credits: ${user?.creditBalance ?? 0}`}>
                  Credits: {user?.creditBalance ?? 0}
                </span>
                <button
                  type="button"
                  className="navbar-user-btn"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <span className="navbar-user-avatar" aria-hidden="true">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="navbar-user-name">{firstName}</span>
                </button>
                {menuOpen && (
                  <div className="navbar-user-menu" role="menu">
                    <NavLink
                      to="/account"
                      role="menuitem"
                      className="navbar-user-menu__item"
                      onClick={() => {
                        setMenuOpen(false);
                        setOpen(false);
                      }}
                    >
                      Account
                    </NavLink>
                    <button
                      type="button"
                      role="menuitem"
                      className="navbar-user-menu__item navbar-user-menu__item--button"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NavLink to="/login" className="navbar-login-btn" onClick={() => setOpen(false)}>
                <LoginIcon />
                <span>Login</span>
              </NavLink>
            )}
          </div>

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
        </div>
      </div>
    </header>
  );
}
