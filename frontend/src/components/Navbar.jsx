import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/platforms', label: 'Platforms' },
  { to: '/hashtag-generator', label: 'Hashtag Generator' },
  { to: '/stylish-text-generator', label: 'Stylish Text' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/download-guide', label: 'Download Guide' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

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

            <div className="navbar-login-wrap" ref={menuRef}>
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
                  Login
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
