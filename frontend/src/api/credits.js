import { resolveApiUrl } from './client';
import { getStoredToken } from '../utils/authToken';

async function creditFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(resolveApiUrl(path), {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = { success: false, message: 'Unexpected server response.' };
  }

  if (!res.ok) {
    const error = new Error(data?.message || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function fetchCreditBalance() {
  return creditFetch('/api/credits/balance', { method: 'GET' });
}

export function fetchCreditTransactions(limit = 20) {
  return creditFetch(`/api/credits/transactions?limit=${limit}`, { method: 'GET' });
}

export function spendCredits({ tool, amount = 20, description }) {
  return creditFetch('/api/credits/spend', {
    method: 'POST',
    body: JSON.stringify({ tool, amount, description }),
  });
}

export function refundCredits({ tool, amount = 20, description }) {
  return creditFetch('/api/credits/refund', {
    method: 'POST',
    body: JSON.stringify({ tool, amount, description }),
  });
}
