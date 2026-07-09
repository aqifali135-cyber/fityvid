import { Link } from 'react-router-dom';
import {
  INSUFFICIENT_CREDITS_MESSAGE,
  LOGIN_TOOL_MESSAGE,
} from '../constants/credits';
import './CreditNotice.css';

export default function CreditNotice({ type, message, className = '' }) {
  if (!type && !message) return null;

  if (type === 'login') {
    return (
      <div className={`credit-notice credit-notice--info ${className}`} role="status">
        <p>{LOGIN_TOOL_MESSAGE}</p>
        <p className="credit-notice__actions">
          <Link to="/login">Log in</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    );
  }

  if (type === 'insufficient') {
    return (
      <div className={`credit-notice credit-notice--warning ${className}`} role="alert">
        <p>{INSUFFICIENT_CREDITS_MESSAGE}</p>
        <p className="credit-notice__actions">
          <Link to="/pricing">Buy Credits</Link>
        </p>
      </div>
    );
  }

  if (type === 'success') {
    return (
      <div className={`credit-notice credit-notice--success ${className}`} role="status">
        <p>{message}</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className={`credit-notice credit-notice--error ${className}`} role="alert">
        <p>{message}</p>
      </div>
    );
  }

  return null;
}
