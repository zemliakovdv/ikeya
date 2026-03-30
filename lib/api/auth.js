// lib/api/auth.js

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
    try { payload = await res.json(); } catch {}
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

  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ===== endpoints =====

/**
 * Проверка существования номера
 * POST /api/v1/auth/phone/check
 * Body: { phone: "375291234567" }
 * Response: { phone, exists: bool }
 */
export async function phoneCheck({ phone }) {
  return fetchAuthAPI('/auth/phone/check', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

/**
 * Запрос звонка
 * POST /api/v1/auth/phone/send
 * Body: { phone: "375291234567" }
 * Response: { message: "string" }
 */
export async function phoneSend({ phone }) {
  return fetchAuthAPI('/auth/phone/send', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

/**
 * Подтверждение кода → вход или регистрация
 * POST /api/v1/auth/phone/verify
 * Body: { phone, code, username?, email?, cart_token? }
 * Response: { token, user: { id, username, email, role }, is_new }
 *
 * Если юзер новый — username обязателен (иначе 422)
 * is_new: true = регистрация, false = вход
 */
export async function phoneVerify({
  phone,
  code,
  cart_token = null,
  username,
  email,
}) {
  const body = { phone, code, cart_token };
  if (username) body.username = username;
  if (email)    body.email    = email;

  return fetchAuthAPI('/auth/phone/verify', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}