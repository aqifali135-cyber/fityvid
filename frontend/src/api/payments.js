import { resolveApiUrl } from './client';
import { getStoredToken } from '../utils/authToken';

async function paymentFetch(path, options = {}) {
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

export function createCheckout({ packageKey }) {
  return paymentFetch('/api/payments/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ packageKey }),
  });
}
