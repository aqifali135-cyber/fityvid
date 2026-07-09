import { randomUUID } from 'crypto';
import { SIGNUP_BONUS_CREDITS } from './creditStore.js';
import { ensureSchema, getPool } from './db.js';

function rowToUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    hashtagFreeSearchUsed: Boolean(row.hashtag_free_search_used),
    creditBalance: Number(row.credit_balance ?? 0),
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
    creditBalance: Number(user.creditBalance ?? user.credit_balance ?? 0),
    createdAt: formatCreatedAt(user.createdAt ?? user.created_at),
  };
}

export async function findUserByEmail(email) {
  await ensureSchema();
  const normalized = String(email || '').trim().toLowerCase();
  const [rows] = await getPool().execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [normalized],
  );
  return rowToUser(rows[0]) || null;
}

export async function findUserById(id) {
  await ensureSchema();
  const [rows] = await getPool().execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rowToUser(rows[0]) || null;
}

export async function createUser({ name, email, passwordHash }) {
  await ensureSchema();

  const normalizedEmail = String(email).trim().toLowerCase();
  const userName = String(name).trim();
  const id = randomUUID();
  const signupBonus = SIGNUP_BONUS_CREDITS;

  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      'INSERT INTO users (id, name, email, password_hash, credit_balance) VALUES (?, ?, ?, ?, ?)',
      [id, userName, normalizedEmail, passwordHash, signupBonus],
    );
    await connection.execute(
      `INSERT INTO credit_transactions (id, user_id, type, tool, amount, balance_after, description)
       VALUES (?, ?, 'signup_bonus', NULL, ?, ?, ?)`,
      [randomUUID(), id, signupBonus, signupBonus, 'Signup bonus credits'],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      const duplicate = new Error('An account with this email already exists.');
      duplicate.code = 'EMAIL_EXISTS';
      throw duplicate;
    }
    throw error;
  } finally {
    connection.release();
  }

  const user = await findUserById(id);
  return sanitizeUser(user);
}

export async function updateUser(id, patch) {
  await ensureSchema();

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
  if (patch.creditBalance !== undefined) {
    fields.push('credit_balance = ?');
    values.push(Number(patch.creditBalance));
  }

  if (fields.length === 0) {
    const user = await findUserById(id);
    return sanitizeUser(user);
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
