import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import { PAGE_SEO } from '../constants/seo';
import './Contact.css';

const FEATURES = [
  {
    id: 'response',
    title: 'Fast Response',
    description: 'We reply within 24 hours',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy First',
    description: 'Your data is always protected',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'support',
    title: 'Friendly Support',
    description: "We're here to help you",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
        <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Contact() {
  const seo = PAGE_SEO.contact;
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <div className="contact-page">
        <div className="contact-page__inner">
          <header className="contact-hero">
            <div className="contact-hero__logo">
              <Logo size="hero" showText linkToHome={false} />
            </div>
            <h1 className="contact-hero__title">Contact FityVid</h1>
            <span className="contact-hero__underline" aria-hidden="true" />
            <p className="contact-hero__subtitle">
              Support, feedback, and questions about our video downloader and hashtag generator.
            </p>
          </header>

          <form className="contact-form-card" onSubmit={handleSubmit}>
            <div className="contact-field">
              <div className="contact-field__icon" aria-hidden="true">
                <UserIcon />
              </div>
              <div className="contact-field__content">
                <label className="contact-field__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="contact-field__input"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <div className="contact-field__icon" aria-hidden="true">
                <MailIcon />
              </div>
              <div className="contact-field__content">
                <label className="contact-field__label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="contact-field__input"
                  type="email"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>

            <div className="contact-field contact-field--message">
              <div className="contact-field__icon" aria-hidden="true">
                <MessageIcon />
              </div>
              <div className="contact-field__content">
                <label className="contact-field__label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className="contact-field__textarea"
                  placeholder="Type your message..."
                  rows={5}
                  required
                />
              </div>
            </div>

            <button type="submit" className="contact-submit-btn">
              <SendIcon />
              <span>Send Message</span>
            </button>

            {submitted && (
              <p className="contact-success" role="status">
                Thank you! We will get back to you soon.
              </p>
            )}
          </form>

          <div className="contact-features-card">
            {FEATURES.map((feature, index) => (
              <div key={feature.id} className="contact-feature">
                {index > 0 && <span className="contact-feature__divider" aria-hidden="true" />}
                <div className="contact-feature__icon">{feature.icon}</div>
                <h2 className="contact-feature__title">{feature.title}</h2>
                <p className="contact-feature__text">{feature.description}</p>
              </div>
            ))}
          </div>

          <p className="contact-footer-links">
            <Link to="/faq">View FAQ</Link> · <Link to="/about">About FityVid</Link>
          </p>
        </div>
      </div>
    </>
  );
}
