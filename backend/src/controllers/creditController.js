import {
  getRecentCreditTransactions,
  getUserCreditBalance,
  refundCredits,
  spendCredits,
} from '../services/creditStore.js';

export async function getBalance(req, res) {
  try {
    const creditBalance = await getUserCreditBalance(req.user.id);
    return res.json({ success: true, creditBalance });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to load credit balance.',
    });
  }
}

export async function getTransactions(req, res) {
  try {
    const limit = Number(req.query.limit) || 20;
    const transactions = await getRecentCreditTransactions(req.user.id, limit);
    return res.json({ success: true, transactions });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to load credit transactions.',
    });
  }
}

export async function spend(req, res) {
  try {
    const tool = String(req.body?.tool || '').trim();
    const amount = Number(req.body?.amount ?? 20);
    const description = req.body?.description ? String(req.body.description).trim() : null;

    if (!tool) {
      return res.status(400).json({ success: false, message: 'Tool is required.' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
    }

    const creditBalance = await spendCredits(req.user.id, { tool, amount, description });
    return res.json({
      success: true,
      creditBalance,
      message: `${amount} credits used.`,
    });
  } catch (error) {
    if (error.code === 'INSUFFICIENT_CREDITS') {
      return res.status(402).json({
        success: false,
        code: 'INSUFFICIENT_CREDITS',
        message: 'You do not have enough credits. Please buy more credits.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Unable to spend credits. Please try again.',
    });
  }
}

export async function refund(req, res) {
  try {
    const tool = String(req.body?.tool || '').trim();
    const amount = Number(req.body?.amount ?? 20);
    const description = req.body?.description ? String(req.body.description).trim() : null;

    if (!tool) {
      return res.status(400).json({ success: false, message: 'Tool is required.' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
    }

    const creditBalance = await refundCredits(req.user.id, { tool, amount, description });
    return res.json({
      success: true,
      creditBalance,
      message: `${amount} credits refunded.`,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to refund credits.',
    });
  }
}
