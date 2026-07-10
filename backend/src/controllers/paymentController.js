import {
  createPaymentOrder,
  findPaymentOrderByGatewayOrderId,
  getCreditPackage,
  markPaymentOrderPaid,
  markPaymentOrderRefunded,
  updatePaymentOrderCheckoutId,
} from '../services/paymentStore.js';
import {
  createLemonCheckout,
  isLemonConfigured,
  verifyLemonWebhookSignature,
} from '../services/lemonSqueezyService.js';
import { addCreditTransaction } from '../services/creditStore.js';
import { ensureSchema, getPool } from '../services/db.js';

export async function createCheckout(req, res) {
  console.log('[payments] createCheckout controller reached for user', req.user?.id || 'unknown');
  try {
    if (!isLemonConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Payment system is not configured yet.',
        debug: 'create-checkout reached paymentController',
      });
    }

    const packageKey = String(req.body?.packageKey || '').trim().toLowerCase();
    const pack = getCreditPackage(packageKey);
    if (!pack) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package. Choose starter, creator, growth, or business.',
      });
    }

    const user = req.user;
    const checkout = await createLemonCheckout({
      packageKey: pack.key,
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const orderId = await createPaymentOrder({
      userId: user.id,
      email: user.email,
      packageKey: pack.key,
      packageName: pack.name,
      credits: pack.credits,
      amount: pack.amount,
      currency: pack.currency,
      gatewayCheckoutId: checkout.checkoutId,
    });

    if (checkout.checkoutId) {
      await updatePaymentOrderCheckoutId(orderId, checkout.checkoutId);
    }

    return res.json({
      success: true,
      checkoutUrl: checkout.checkoutUrl,
      packageKey: pack.key,
      credits: pack.credits,
      orderId,
    });
  } catch (error) {
    if (error.code === 'PAYMENT_NOT_CONFIGURED' || error.code === 'INVALID_PACKAGE') {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('createCheckout error:', error.message);
    return res.status(502).json({
      success: false,
      message: error.message || 'Unable to start checkout. Please try again.',
    });
  }
}

async function fulfillPaidOrder({
  userId,
  packageKey,
  credits,
  packageName,
  gatewayOrderId,
}) {
  const existing = await findPaymentOrderByGatewayOrderId(gatewayOrderId);
  if (existing?.status === 'paid') {
    return { alreadyProcessed: true };
  }

  const pack = getCreditPackage(packageKey) || {
    key: packageKey,
    name: packageName || 'Credit Pack',
    credits: Number(credits),
  };

  const creditAmount = Number(pack.credits || credits);
  if (!userId || !creditAmount || creditAmount <= 0) {
    const error = new Error('Missing user or credits in webhook payload.');
    error.code = 'INVALID_WEBHOOK_DATA';
    throw error;
  }

  await ensureSchema();
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();

    const [paidRows] = await connection.execute(
      `SELECT id, status FROM payment_orders WHERE gateway_order_id = ? LIMIT 1 FOR UPDATE`,
      [String(gatewayOrderId)],
    );
    if (paidRows[0]?.status === 'paid') {
      await connection.rollback();
      return { alreadyProcessed: true };
    }

    let orderId = paidRows[0]?.id || null;
    if (!orderId) {
      const [pendingRows] = await connection.execute(
        `SELECT id FROM payment_orders
         WHERE user_id = ?
           AND package_key = ?
           AND credits = ?
           AND status = 'pending'
         ORDER BY created_at DESC
         LIMIT 1
         FOR UPDATE`,
        [String(userId), pack.key, creditAmount],
      );
      orderId = pendingRows[0]?.id || null;
    }

    if (orderId) {
      await markPaymentOrderPaid({
        orderId,
        gatewayOrderId,
        connection,
      });
    } else {
      // Fallback: create a paid order if pending row was missing
      const { randomUUID } = await import('crypto');
      const newId = randomUUID();
      await connection.execute(
        `INSERT INTO payment_orders
          (id, user_id, email, package_key, package_name, credits, amount, currency, gateway, gateway_order_id, status, paid_at)
         VALUES (?, ?, '', ?, ?, ?, 0, 'PKR', 'lemonsqueezy', ?, 'paid', CURRENT_TIMESTAMP)`,
        [newId, String(userId), pack.key, pack.name, creditAmount, String(gatewayOrderId)],
      );
      orderId = newId;
    }

    const [userRows] = await connection.execute(
      'SELECT credit_balance FROM users WHERE id = ? FOR UPDATE',
      [String(userId)],
    );
    if (!userRows[0]) {
      await connection.rollback();
      const error = new Error('User not found for paid order.');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const current = Number(userRows[0].credit_balance ?? 0);
    const balanceAfter = current + creditAmount;
    await connection.execute('UPDATE users SET credit_balance = ? WHERE id = ?', [
      balanceAfter,
      String(userId),
    ]);
    await addCreditTransaction({
      userId: String(userId),
      type: 'purchase',
      tool: 'credits',
      amount: creditAmount,
      balanceAfter,
      description: `Purchased ${pack.name}`,
      connection,
    });

    await connection.commit();
    return { alreadyProcessed: false, balanceAfter, credits: creditAmount };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function lemonWebhook(req, res) {
  try {
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

    const signature = req.get('X-Signature') || req.get('x-signature') || '';
    if (!verifyLemonWebhookSignature(rawBody, signature)) {
      return res.status(401).json({ success: false, message: 'Invalid webhook signature.' });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid webhook payload.' });
    }

    const eventName =
      payload?.meta?.event_name || req.get('X-Event-Name') || req.get('x-event-name') || '';

    if (eventName === 'order_created') {
      const custom = payload?.meta?.custom_data || {};
      const userId = custom.user_id || custom.userId;
      const packageKey = custom.packageKey || custom.package_key;
      const credits = custom.credits;
      const packageName = custom.package_name || custom.packageName;
      const gatewayOrderId = payload?.data?.id;

      if (!gatewayOrderId) {
        return res.status(400).json({ success: false, message: 'Missing order id.' });
      }

      await fulfillPaidOrder({
        userId,
        packageKey,
        credits,
        packageName,
        gatewayOrderId,
      });

      return res.status(200).json({ success: true });
    }

    if (eventName === 'order_refunded') {
      const gatewayOrderId = payload?.data?.id;
      if (gatewayOrderId) {
        await markPaymentOrderRefunded(gatewayOrderId);
      }
      // Do not automatically subtract credits yet.
      return res.status(200).json({ success: true, refundRecorded: true });
    }

    return res.status(200).json({ success: true, ignored: true });
  } catch (error) {
    console.error('lemonWebhook error:', error.message);
    // Still return 200 for already-processed style issues when possible;
    // return 500 so Lemon retries on unexpected failures.
    if (error.code === 'INVALID_WEBHOOK_DATA' || error.code === 'USER_NOT_FOUND') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Webhook processing failed.' });
  }
}
