import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
} from '../api/auth';
import {
  fetchCreditBalance,
  spendCredits as spendCreditsApi,
} from '../api/credits';
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

  const refreshCredits = useCallback(async () => {
    if (!getStoredToken()) return null;
    try {
      const data = await fetchCreditBalance();
      if (data?.success) {
        setUser((prev) => (prev ? { ...prev, creditBalance: data.creditBalance } : prev));
        return data.creditBalance;
      }
    } catch {
      // ignore refresh failures
    }
    return user?.creditBalance ?? null;
  }, [user?.creditBalance]);

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

  const spendCredits = useCallback(async (tool, description, amount = 20) => {
    const data = await spendCreditsApi({ tool, amount, description });
    setUser((prev) =>
      prev ? { ...prev, creditBalance: data.creditBalance } : prev,
    );
    return data;
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
      refreshCredits,
      spendCredits,
    }),
    [user, loading, signup, login, logout, refreshUser, refreshCredits, spendCredits],
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
