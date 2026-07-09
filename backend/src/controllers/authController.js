import bcrypt from 'bcryptjs';
import { requireAuth, signAuthToken } from '../middleware/auth.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
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
    if (!user) {
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

export { requireAuth };
