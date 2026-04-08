// src/contexts/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
} from '@/lib/api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUserState] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Автовосстановление auth из localStorage
  useEffect(() => {
    const t = getAuthToken();
    const u = getStoredUser();
    if (t) setTokenState(t);
    if (u) setUserState(u);
    setIsHydrated(true);
  }, []);

  const isAuth = !!token;

  function setAuth({ token: newToken, user: newUser }) {
    setTokenState(newToken);
    setUserState(newUser || null);
    setAuthToken(newToken);
    if (newUser) setStoredUser(newUser);
    // ✅ НЕ диспатчим auth-change здесь — это делает AuthModalsHost
    // после завершения переноса гостевых товаров в корзину
  }

  function logout() {
    setTokenState(null);
    setUserState(null);
    removeAuthToken();
    removeStoredUser();
    // ✅ При логауте диспатчим отдельное событие — перенос товаров не нужен
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-logout'));
    }
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuth,
      isHydrated,
      setAuth,
      setUser: (u) => {
        // Мёржим с текущим user — чтобы не затирать уже сохранённые поля
        const merged = u ? { ...(getStoredUser() || {}), ...u } : null;
        setUserState(merged);
        if (merged) setStoredUser(merged);
      },
      logout,
    }),
    [token, user, isAuth, isHydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}