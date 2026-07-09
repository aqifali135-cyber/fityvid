import mysql from 'mysql2/promise';

let pool = null;
let schemaReady = null;

export function isDbConfigured() {
  return Boolean(
    process.env.DB_HOST?.trim() &&
      process.env.DB_USER?.trim() &&
      process.env.DB_PASSWORD?.trim() &&
      process.env.DB_NAME?.trim(),
  );
}

export function getPool() {
  if (!isDbConfigured()) {
    throw new Error('Database is not configured. Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.');
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST.trim(),
      user: process.env.DB_USER.trim(),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME.trim(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

async function columnExists(tableName, columnName) {
  const db = getPool();
  const [rows] = await db.execute(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [process.env.DB_NAME.trim(), tableName, columnName],
  );
  return rows.length > 0;
}

export async function ensureUsersTable() {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NULL,
      google_id VARCHAR(255) NULL,
      auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
      avatar_url VARCHAR(500) NULL,
      hashtag_free_search_used TINYINT(1) DEFAULT 0,
      credit_balance INT NOT NULL DEFAULT 60,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists('users', 'credit_balance'))) {
    await db.execute(
      'ALTER TABLE users ADD COLUMN credit_balance INT NOT NULL DEFAULT 60',
    );
  }

  if (!(await columnExists('users', 'google_id'))) {
    await db.execute('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL');
  }

  if (!(await columnExists('users', 'auth_provider'))) {
    await db.execute(
      "ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) NOT NULL DEFAULT 'email'",
    );
  }

  if (!(await columnExists('users', 'avatar_url'))) {
    await db.execute('ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL');
  }

  // Allow Google-only accounts without a password hash
  await db.execute('ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL');
}

export async function ensureCreditTransactionsTable() {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      type VARCHAR(50) NOT NULL,
      tool VARCHAR(100) NULL,
      amount INT NOT NULL,
      balance_after INT NOT NULL,
      description VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_credit_transactions_user_id (user_id),
      INDEX idx_credit_transactions_created_at (created_at)
    )
  `);
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await ensureUsersTable();
      await ensureCreditTransactionsTable();
    })();
  }
  return schemaReady;
}

export async function initDatabase() {
  if (!isDbConfigured()) {
    console.warn(
      'WARNING: MySQL auth DB not configured. Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME for auth.',
    );
    return false;
  }

  try {
    await ensureSchema();
    const connection = await getPool().getConnection();
    try {
      await connection.ping();
    } finally {
      connection.release();
    }
    console.log(`MySQL: connected (${process.env.DB_NAME.trim()})`);
    return true;
  } catch (error) {
    console.error('MySQL: connection failed:', error.message);
    return false;
  }
}
