import { resolveApiUrl } from './client';
import { getStoredToken } from '../utils/authToken';

async function authFetch(path, options = {}) {
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

export function signupUser({ name, email, password }) {
  return authFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser({ email, password }) {
  return authFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchCurrentUser() {
  const token = getStoredToken();
  if (!token) {
    return { success: false, user: null };
  }

  try {
    return await authFetch('/api/auth/me', { method: 'GET' });
  } catch (err) {
    if (err.status === 401) {
      return { success: false, user: null };
    }
    throw err;
  }
}

export function logoutUser() {
  return authFetch('/api/auth/logout', {
    method: 'POST',
    body: '{}',
  });
}
