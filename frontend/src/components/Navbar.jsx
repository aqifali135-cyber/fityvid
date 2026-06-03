import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/platforms', label: 'Platforms' },
  { to: '/hashtag-generator', label: 'Hashtag Generator' },
  { to: '/download-guide', label: 'Download Guide' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
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
        <nav className={`navbar-nav ${open ? 'open' : ''}`}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
