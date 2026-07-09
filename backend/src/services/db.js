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

export async function ensureUsersTable() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getPool();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          hashtag_free_search_used TINYINT(1) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
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
    await ensureUsersTable();
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
