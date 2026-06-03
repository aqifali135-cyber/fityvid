import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import { PAGE_SEO } from '../constants/seo';
import '../components/SeoProse.css';

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
      <PageHero
        title="Contact FityVid"
        subtitle="Support, feedback, and questions about our video downloader and hashtag generator."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <form
            className="card"
            style={{ maxWidth: 480, margin: '0 auto' }}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input id="name" className="input" type="text" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" className="input" type="email" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="message">
                Message
              </label>
              <textarea id="message" className="textarea" rows={5} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
            {submitted && (
              <p style={{ textAlign: 'center', color: '#059669', marginTop: '1rem' }}>
                Thank you! We will get back to you soon.
              </p>
            )}
          </form>
          <p className="seo-content text-center" style={{ marginTop: '1.5rem' }}>
            <Link to="/faq">View FAQ</Link> · <Link to="/about">About FityVid</Link>
          </p>
        </div>
      </section>
    </>
  );
}
