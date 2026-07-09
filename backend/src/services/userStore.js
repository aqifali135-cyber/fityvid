import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), 'utf8');
  }
}

function readDb() {
  ensureStore();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users)) {
      return { users: [] };
    }
    return parsed;
  } catch {
    return { users: [] };
  }
}

function writeDb(db) {
  ensureStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), 'utf8');
}

export function findUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  return readDb().users.find((user) => user.email === normalized) || null;
}

export function findUserById(id) {
  return readDb().users.find((user) => user.id === id) || null;
}

export function createUser({ name, email, passwordHash }) {
  const db = readDb();
  const normalizedEmail = String(email).trim().toLowerCase();
  if (db.users.some((user) => user.email === normalizedEmail)) {
    const error = new Error('An account with this email already exists.');
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const user = {
    id: randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    hashtagFreeSearchUsed: false,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);
  return sanitizeUser(user);
}

export function updateUser(id, patch) {
  const db = readDb();
  const index = db.users.findIndex((user) => user.id === id);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...patch };
  writeDb(db);
  return sanitizeUser(db.users[index]);
}

export function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
