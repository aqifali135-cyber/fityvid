import { randomUUID } from 'crypto';
import { ensureUsersTable, getPool } from './db.js';

function rowToUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    hashtagFreeSearchUsed: Boolean(row.hashtag_free_search_used),
    createdAt: row.created_at,
  };
}

function formatCreatedAt(value) {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}

export function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: formatCreatedAt(user.createdAt),
  };
}

export async function findUserByEmail(email) {
  await ensureUsersTable();
  const normalized = String(email || '').trim().toLowerCase();
  const [rows] = await getPool().execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [normalized],
  );
  return rowToUser(rows[0]) || null;
}

export async function findUserById(id) {
  await ensureUsersTable();
  const [rows] = await getPool().execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rowToUser(rows[0]) || null;
}

export async function createUser({ name, email, passwordHash }) {
  await ensureUsersTable();

  const normalizedEmail = String(email).trim().toLowerCase();
  const userName = String(name).trim();
  const id = randomUUID();

  try {
    await getPool().execute(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, userName, normalizedEmail, passwordHash],
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const duplicate = new Error('An account with this email already exists.');
      duplicate.code = 'EMAIL_EXISTS';
      throw duplicate;
    }
    throw error;
  }

  return sanitizeUser({
    id,
    name: userName,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  });
}

export async function updateUser(id, patch) {
  await ensureUsersTable();

  const fields = [];
  const values = [];

  if (patch.name !== undefined) {
    fields.push('name = ?');
    values.push(String(patch.name).trim());
  }
  if (patch.email !== undefined) {
    fields.push('email = ?');
    values.push(String(patch.email).trim().toLowerCase());
  }
  if (patch.passwordHash !== undefined) {
    fields.push('password_hash = ?');
    values.push(patch.passwordHash);
  }
  if (patch.hashtagFreeSearchUsed !== undefined) {
    fields.push('hashtag_free_search_used = ?');
    values.push(patch.hashtagFreeSearchUsed ? 1 : 0);
  }

  if (fields.length === 0) {
    return findUserById(id).then(sanitizeUser);
  }

  values.push(id);
  const [result] = await getPool().execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  if (result.affectedRows === 0) return null;
  const user = await findUserById(id);
  return sanitizeUser(user);
}
