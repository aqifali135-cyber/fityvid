import jwt from 'jsonwebtoken';
import { findUserById, sanitizeUser } from '../services/userStore.js';

const COOKIE_NAME = 'fityvid_token';
const DEV_FALLBACK_SECRET = 'fityvid-dev-secret-change-me';

let warnedMissingSecret = false;

export function getJwtSecret() {
  if (process.env.JWT_SECRET?.trim()) {
    return process.env.JWT_SECRET.trim();
  }
  if (!warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn(
      'WARNING: JWT_SECRET is not set. Using a development fallback. Set JWT_SECRET before production.',
    );
  }
  return DEV_FALLBACK_SECRET;
}

export function getTokenExpiry() {
  return process.env.JWT_EXPIRES_IN || '7d';
}

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: getTokenExpiry() },
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  if (req.cookies?.[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }
  return null;
}

export function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Please log in to continue.' });
    }
    const payload = verifyAuthToken(token);
    const user = findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Account not found. Please log in again.' });
    }
    req.user = sanitizeUser(user);
    req.authToken = token;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
}

export { COOKIE_NAME };
