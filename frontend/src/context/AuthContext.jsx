import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
} from '../api/auth';
import { getStoredToken, storeAuthToken } from '../utils/authToken';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      return null;
    }

    try {
      const data = await fetchCurrentUser();
      if (data?.success && data.user) {
        setUser(data.user);
        return data.user;
      }
      storeAuthToken('');
      setUser(null);
      return null;
    } catch {
      storeAuthToken('');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await refreshUser();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const signup = useCallback(async ({ name, email, password }) => {
    const data = await signupUser({ name, email, password });
    if (data?.token) storeAuthToken(data.token);
    setUser(data.user || null);
    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    if (data?.token) storeAuthToken(data.token);
    setUser(data.user || null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Still clear local session if logout request fails
    } finally {
      storeAuthToken('');
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, signup, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
