import { randomUUID } from 'crypto';
import { ensureSchema, getPool } from './db.js';

export const SIGNUP_BONUS_CREDITS = 60;
export const DEFAULT_TOOL_CREDIT_COST = 20;

function formatTransaction(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    tool: row.tool,
    amount: row.amount,
    balanceAfter: row.balance_after,
    description: row.description,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

export async function addCreditTransaction({
  userId,
  type,
  amount,
  balanceAfter,
  tool = null,
  description = null,
  connection = null,
}) {
  if (!connection) {
    await ensureSchema();
  }
  const db = connection || getPool();
  const id = randomUUID();
  await db.execute(
    `INSERT INTO credit_transactions (id, user_id, type, tool, amount, balance_after, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, type, tool, amount, balanceAfter, description],
  );
  return id;
}

export async function getUserCreditBalance(userId) {
  await ensureSchema();
  const [rows] = await getPool().execute(
    'SELECT credit_balance FROM users WHERE id = ? LIMIT 1',
    [userId],
  );
  return Number(rows[0]?.credit_balance ?? 0);
}

export async function getRecentCreditTransactions(userId, limit = 20) {
  await ensureSchema();
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const [rows] = await getPool().execute(
    `SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ${safeLimit}`,
    [userId],
  );
  return rows.map(formatTransaction);
}

export async function spendCredits(userId, { tool, amount = DEFAULT_TOOL_CREDIT_COST, description }) {
  await ensureSchema();
  const spendAmount = Number(amount);
  if (!tool || spendAmount <= 0) {
    throw new Error('Invalid credit spend request.');
  }

  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      'SELECT credit_balance FROM users WHERE id = ? FOR UPDATE',
      [userId],
    );
    const current = Number(rows[0]?.credit_balance ?? 0);
    if (current < spendAmount) {
      await connection.rollback();
      const error = new Error('You do not have enough credits. Please buy more credits.');
      error.code = 'INSUFFICIENT_CREDITS';
      throw error;
    }

    const balanceAfter = current - spendAmount;
    await connection.execute('UPDATE users SET credit_balance = ? WHERE id = ?', [balanceAfter, userId]);
    await addCreditTransaction({
      userId,
      type: 'spend',
      tool,
      amount: -spendAmount,
      balanceAfter,
      description,
      connection,
    });
    await connection.commit();
    return balanceAfter;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function refundCredits(userId, { tool, amount = DEFAULT_TOOL_CREDIT_COST, description }) {
  await ensureSchema();
  const refundAmount = Number(amount);
  if (!tool || refundAmount <= 0) {
    throw new Error('Invalid credit refund request.');
  }

  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      'SELECT credit_balance FROM users WHERE id = ? FOR UPDATE',
      [userId],
    );
    const current = Number(rows[0]?.credit_balance ?? 0);
    const balanceAfter = current + refundAmount;
    await connection.execute('UPDATE users SET credit_balance = ? WHERE id = ?', [balanceAfter, userId]);
    await addCreditTransaction({
      userId,
      type: 'refund',
      tool,
      amount: refundAmount,
      balanceAfter,
      description,
      connection,
    });
    await connection.commit();
    return balanceAfter;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
