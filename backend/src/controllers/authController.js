import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { requireAuth, signAuthToken } from '../middleware/auth.js';
import {
  createGoogleUser,
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  linkGoogleProfile,
  sanitizeUser,
} from '../services/userStore.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateEmail(email) {
  return EMAIL_RE.test(String(email || '').trim());
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;
}

export async function signup(req, res) {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your name (at least 2 characters).',
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash });
    const token = signAuthToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user,
      token,
    });
  } catch (error) {
    if (error.code === 'EMAIL_EXISTS') {
      return res.status(409).json({ success: false, message: error.message });
    }
    if (process.env.NODE_ENV !== 'production') {
      console.error('Signup error:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Unable to create account. Please try again.',
    });
  }
}

export async function login(req, res) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!validateEmail(email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const safeUser = sanitizeUser(await findUserById(user.id));
    const token = signAuthToken(safeUser);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user: safeUser,
      token,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to log in. Please try again.',
    });
  }
}

export async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Account not found. Please log in again.' });
    }
    return res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to load account.' });
  }
}

export function logout(_req, res) {
  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function googleAuth(req, res) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    if (!clientId) {
      return res.status(503).json({
        success: false,
        message: 'Google sign-in is not configured.',
      });
    }

    const credential = String(req.body?.credential || '').trim();
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google sign-in failed. Please try again.',
      });
    }

    const client = new OAuth2Client(clientId);
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Google sign-in failed. Please try again.',
      });
    }

    const googleId = String(payload?.sub || '').trim();
    const email = String(payload?.email || '').trim().toLowerCase();
    const name = String(payload?.name || payload?.given_name || email.split('@')[0] || 'User').trim();
    const picture = payload?.picture ? String(payload.picture).trim() : null;

    if (!googleId || !email || !validateEmail(email)) {
      return res.status(401).json({
        success: false,
        message: 'Google sign-in failed. Please try again.',
      });
    }

    let user = (await findUserByGoogleId(googleId)) || (await findUserByEmail(email));

    if (user) {
      user = await linkGoogleProfile(user.id, {
        googleId: user.googleId || googleId,
        name: user.name || name,
        avatarUrl: picture || user.avatarUrl,
      });
    } else {
      try {
        user = await createGoogleUser({
          name,
          email,
          googleId,
          avatarUrl: picture,
        });
      } catch (error) {
        if (error.code === 'EMAIL_EXISTS') {
          const existing = await findUserByEmail(email);
          if (!existing) throw error;
          user = await linkGoogleProfile(existing.id, {
            googleId: existing.googleId || googleId,
            name: existing.name || name,
            avatarUrl: picture || existing.avatarUrl,
          });
        } else {
          throw error;
        }
      }
    }

    const safeUser = sanitizeUser(await findUserById(user.id));
    const token = signAuthToken(safeUser);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user: safeUser,
      token,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Google auth error:', error);
    }
    return res.status(500).json({
      success: false,
      message: 'Google sign-in failed. Please try again.',
    });
  }
}

export { requireAuth };
