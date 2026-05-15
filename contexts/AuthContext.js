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

const ACTIVITY_KEY = 'auth_last_activity';
const SESSION_TTL = 60 * 60 * 1000; // 1 час
const ACTIVITY_THROTTLE = 60 * 1000; // обновляем не чаще раза в минуту

function getLastActivity() {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(ACTIVITY_KEY);
  return val ? parseInt(val, 10) : null;
}

function updateLastActivity() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
}

function removeLastActivity() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVITY_KEY);
}

function isSessionExpired() {
  const last = getLastActivity();
  if (!last) return true;
  return Date.now() - last > SESSION_TTL;
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUserState] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Автовосстановление auth из localStorage
  useEffect(() => {
    const t = getAuthToken();
    const u = getStoredUser();

    if (t) {
      if (isSessionExpired()) {
        // Сессия истекла — чистим всё
        removeAuthToken();
        removeStoredUser();
        removeLastActivity();
      } else {
        setTokenState(t);
        if (u) setUserState(u);
      }
    }

    setIsHydrated(true);
  }, []);

  // Слушаем активность пользователя — обновляем timestamp (throttle 1 мин)
  useEffect(() => {
    if (!token) return;

    let lastUpdate = Date.now();

    function handleActivity() {
      const now = Date.now();
      if (now - lastUpdate < ACTIVITY_THROTTLE) return;
      lastUpdate = now;
      updateLastActivity();
    }

    const events = ['click', 'scroll', 'mousemove', 'keydown', 'touchstart'];
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [token]);

  // Проверяем истечение сессии раз в минуту (пока вкладка открыта)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        setTokenState(null);
        setUserState(null);
        removeAuthToken();
        removeStoredUser();
        removeLastActivity();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-logout'));
        }
      }
    }, ACTIVITY_THROTTLE);

    return () => clearInterval(interval);
  }, [token]);

  const isAuth = !!token;

  function setAuth({ token: newToken, user: newUser }) {
    setTokenState(newToken);
    setUserState(newUser || null);
    setAuthToken(newToken);
    if (newUser) setStoredUser(newUser);
    updateLastActivity();
  }

  function logout() {
    setTokenState(null);
    setUserState(null);
    removeAuthToken();
    removeStoredUser();
    removeLastActivity();
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