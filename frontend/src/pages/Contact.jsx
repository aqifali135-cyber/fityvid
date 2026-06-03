import { useState } from 'react';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <SEO title="Contact" description="Contact FityVid for support and inquiries." />
      <PageHero title="Contact" subtitle="Have a question? Send us a message." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <form className="card" style={{ maxWidth: 480, margin: '0 auto' }} onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="name">Name</label>
              <input id="name" className="input" type="text" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input" type="email" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="message">Message</label>
              <textarea id="message" className="textarea" rows={5} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
            {submitted && (
              <p style={{ textAlign: 'center', color: '#059669', marginTop: '1rem' }}>
                Thank you! We will get back to you soon.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
