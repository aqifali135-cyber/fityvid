import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo size="footer" showText linkToHome />
          <p>Download videos from YouTube, Facebook, TikTok, and Instagram. Free hashtag tools included.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/platforms">Platforms</Link></li>
            <li><Link to="/hashtag-generator">Hashtag Generator</Link></li>
            <li><Link to="/download-guide">Download Guide</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} FityVid. All rights reserved.</p>
        <p className="footer-disclaimer">
          Please download only your own content or content you have permission to use.
        </p>
      </div>
    </footer>
  );
}
