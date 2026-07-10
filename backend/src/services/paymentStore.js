import { randomUUID } from 'crypto';
import { ensureSchema, getPool } from './db.js';

export const CREDIT_PACKAGES = {
  starter: {
    key: 'starter',
    name: 'Starter Pack',
    credits: 200,
    amount: 1499,
    currency: 'PKR',
    uses: 10,
    envVariantKey: 'LEMON_STARTER_VARIANT_ID',
  },
  creator: {
    key: 'creator',
    name: 'Creator Pack',
    credits: 600,
    amount: 2999,
    currency: 'PKR',
    uses: 30,
    envVariantKey: 'LEMON_CREATOR_VARIANT_ID',
  },
  growth: {
    key: 'growth',
    name: 'Growth Pack',
    credits: 1500,
    amount: 5999,
    currency: 'PKR',
    uses: 75,
    envVariantKey: 'LEMON_GROWTH_VARIANT_ID',
  },
  business: {
    key: 'business',
    name: 'Business Pack',
    credits: 4000,
    amount: 11999,
    currency: 'PKR',
    uses: 200,
    envVariantKey: 'LEMON_BUSINESS_VARIANT_ID',
  },
};

export function getCreditPackage(packageKey) {
  return CREDIT_PACKAGES[packageKey] || null;
}

export function getPackageVariantId(packageKey) {
  const pack = getCreditPackage(packageKey);
  if (!pack) return '';
  return process.env[pack.envVariantKey]?.trim() || '';
}

function formatOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    packageKey: row.package_key,
    packageName: row.package_name,
    credits: Number(row.credits),
    amount: Number(row.amount),
    currency: row.currency,
    gateway: row.gateway,
    gatewayCheckoutId: row.gateway_checkout_id,
    gatewayOrderId: row.gateway_order_id,
    status: row.status,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    paidAt: row.paid_at instanceof Date ? row.paid_at.toISOString() : row.paid_at,
  };
}

export async function createPaymentOrder({
  userId,
  email,
  packageKey,
  packageName,
  credits,
  amount,
  currency = 'PKR',
  gatewayCheckoutId = null,
}) {
  await ensureSchema();
  const id = randomUUID();
  await getPool().execute(
    `INSERT INTO payment_orders
      (id, user_id, email, package_key, package_name, credits, amount, currency, gateway, gateway_checkout_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'lemonsqueezy', ?, 'pending')`,
    [id, userId, email, packageKey, packageName, credits, amount, currency, gatewayCheckoutId],
  );
  return id;
}

export async function updatePaymentOrderCheckoutId(orderId, gatewayCheckoutId) {
  await ensureSchema();
  await getPool().execute(
    'UPDATE payment_orders SET gateway_checkout_id = ? WHERE id = ?',
    [gatewayCheckoutId, orderId],
  );
}

export async function findPaymentOrderByGatewayOrderId(gatewayOrderId) {
  await ensureSchema();
  const [rows] = await getPool().execute(
    'SELECT * FROM payment_orders WHERE gateway_order_id = ? LIMIT 1',
    [String(gatewayOrderId)],
  );
  return formatOrder(rows[0]);
}

export async function findPendingPaymentOrder({ userId, packageKey }) {
  await ensureSchema();
  const [rows] = await getPool().execute(
    `SELECT * FROM payment_orders
     WHERE user_id = ? AND package_key = ? AND status = 'pending'
     ORDER BY created_at DESC LIMIT 1`,
    [userId, packageKey],
  );
  return formatOrder(rows[0]);
}

export async function markPaymentOrderPaid({
  orderId,
  gatewayOrderId,
  connection = null,
}) {
  const db = connection || getPool();
  await db.execute(
    `UPDATE payment_orders
     SET status = 'paid', gateway_order_id = ?, paid_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [String(gatewayOrderId), orderId],
  );
}

export async function markPaymentOrderRefunded(gatewayOrderId) {
  await ensureSchema();
  const [result] = await getPool().execute(
    `UPDATE payment_orders
     SET status = 'refunded'
     WHERE gateway_order_id = ? AND status = 'paid'`,
    [String(gatewayOrderId)],
  );
  return result.affectedRows > 0;
}

export async function findLatestMatchingPendingOrder({
  userId,
  packageKey,
  credits,
}) {
  await ensureSchema();
  const [rows] = await getPool().execute(
    `SELECT * FROM payment_orders
     WHERE user_id = ?
       AND package_key = ?
       AND credits = ?
       AND status = 'pending'
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId, packageKey, Number(credits)],
  );
  return formatOrder(rows[0]);
}
