// src/lib/api/auth.js

const API_BASE_URL = 'http://45.135.234.22/api/v1';

// ===== localStorage helpers =====
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function removeAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function removeStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_user');
}

// ===== fetch wrapper =====
async function fetchAuthAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let payload = {};
    try {
      payload = await res.json();
    } catch {}
    const message =
      payload?.message ||
      payload?.error ||
      (payload?.errors && JSON.stringify(payload.errors)) ||
      `API Error: ${res.status}`;

    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  // некоторые эндпоинты могут отдавать пустое тело
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ===== endpoints =====

/**
 * Запрос обратного звонка (A1)
 * @param {string} phone - "375291234567"
 * @param {string} context - строка контекста (если бэк требует)
 */
export async function a1Request({ phone, context = 'auth' }) {
  return fetchAuthAPI('/a1/request', {
    method: 'POST',
    body: JSON.stringify({ phone, context }),
  });
}

/**
 * Проверка последних 4 цифр (A1)
 */
export async function a1Verify({ verification_id, last4 }) {
  return fetchAuthAPI('/a1/verify', {
    method: 'POST',
    body: JSON.stringify({ verification_id, last4 }),
  });
}

/**
 * Вход / завершение регистрации по телефону
 * (после успешного A1 verify)
 * @param {string} phone - "375291234567"
 * @param {string} code - "1234" (last4)
 * @param {string|null} cart_token
 */
export async function phoneVerify({ phone, code, cart_token }) {
  return fetchAuthAPI('/auth/phone/verify', {
    method: 'POST',
    body: JSON.stringify({
      phone,
      code,
      cart_token: cart_token || null,
    }),
  });
}
