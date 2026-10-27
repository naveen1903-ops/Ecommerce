import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authenticate } from '../api/authApi.js';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../api/axiosClient.js';
import { useShopStore } from '../store/shopStore.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null'); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(() => readStoredUser());

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem('shopease-demo-user');
    // Do not leave one account's cart visible after logout on a shared browser.
    useShopStore.getState().clearCart();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await authenticate(username, password);
    const nextUser = { username };
    localStorage.setItem(AUTH_TOKEN_KEY, result.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    setToken(result.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem('shopease-demo-user');
      useShopStore.getState().clearCart();
      setToken(null);
      setUser(null);
    };
    window.addEventListener('shopease:auth-expired', handleExpired);
    return () => window.removeEventListener('shopease:auth-expired', handleExpired);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
  }), [user, token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
