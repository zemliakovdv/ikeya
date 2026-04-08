// lib/api/account.js

import { getAuthToken } from '@/lib/api/auth';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

async function fetchAccount(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

// ===== Маппинг статусов заказов =====

const ACTIVE_STATUSES = [
  'awaiting_payment', 'pending', 'processing', 'assembly',
  'assembly_process', 'transit', 'customs_poland', 'customs_belarus',
  'available_warehouse', 'delivering', 'delivered_to_pvz',
];

const HISTORY_STATUSES = [
  'delivered', 'completed', 'canceled', 'cancelled', 'returned',
];

export const STATUS_LABELS = {
  awaiting_payment:    'Ждёт оплаты',
  pending:             'Оформляется',
  processing:          'Обрабатывается',
  assembly:            'Сборка заказа',
  assembly_process:    'Подготовка и сборка',
  transit:             'В пути',
  customs_poland:      'Таможня Польша',
  customs_belarus:     'Таможня Беларусь',
  available_warehouse: 'Доступен на складе',
  delivering:          'Доставляется',
  delivered_to_pvz:    'Прибыл в ПВЗ',
  delivered:           'Получен',
  completed:           'Завершён',
  canceled:            'Отменён',
  cancelled:           'Отменён',
  returned:            'Возврат',
};

export function isActiveOrder(status)  { return ACTIVE_STATUSES.includes(status); }
export function isHistoryOrder(status) { return HISTORY_STATUSES.includes(status); }
export function getStatusLabel(status) { return STATUS_LABELS[status] || status; }

// ===== Profile =====

/**
 * GET /api/v1/account/profile
 * Возвращает полный объект профиля:
 * { id, username, first_name, last_name, middle_name, email, phone,
 *   country_code, dob, gender, address, region, city, postcode,
 *   street, house, building, apartment, telegram_marketing,
 *   email_marketing, gdpr_consent, newsletter_consent,
 *   passport_verified, passport_data: { ... } }
 */
export async function getProfile() {
  return fetchAccount('/account/profile');
}

/**
 * PATCH /api/v1/account/profile
 * Обновляет любые поля профиля.
 * Для паспорта передавать { passport: { first_name, last_name, ... } }
 * Для адреса: { region, city, postcode, street, house, building, apartment }
 */
export async function updateProfile(data) {
  return fetchAccount('/account/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * POST /api/v1/account/profile/change_phone_request
 * Шаг 1: запрос смены телефона — на новый номер поступит входящий звонок от A1
 * Body: { phone: "375291112233" }
 */
export async function requestPhoneChange(phone) {
  return fetchAccount('/account/profile/change_phone_request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

/**
 * POST /api/v1/account/profile/change_phone_verify
 * Шаг 2: подтверждение смены — вводим последние 4 цифры входящего звонка
 * Body: { phone: "375291112233", code: "1234" }
 * Response: обновлённый объект профиля
 */
export async function verifyPhoneChange(phone, code) {
  return fetchAccount('/account/profile/change_phone_verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
}

/**
 * POST /api/v1/account/profile/change_email_verify
 * Подтверждение смены email через код из письма (для теста код: 1234)
 * Body: { email: "new@mail.com", code: "1234" }
 * Response: обновлённый объект профиля
 */
export async function verifyEmailChange(email, code) {
  return fetchAccount('/account/profile/change_email_verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

// ===== Orders =====

export async function getOrders({ page = 1, per_page = 20 } = {}) {
  return fetchAccount(`/account/orders?page=${page}&per_page=${per_page}`);
}

export async function getOrderById(id) {
  return fetchAccount(`/account/orders/${id}`);
}

export async function reorder(id) {
  return fetchAccount(`/account/orders/${id}/reorder`, { method: 'POST' });
}

// ===== Purchases =====

export async function getPurchases({ sort = 'newest', page = 1, per_page = 20 } = {}) {
  return fetchAccount(`/account/purchases?sort=${sort}&page=${page}&per_page=${per_page}`);
}

// ===== Receipts =====

export async function getReceipts() {
  return fetchAccount('/account/receipts');
}

// ===== Returns =====

export async function getReturns() {
  return fetchAccount('/account/returns');
}

export async function createReturn(formData) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/account/returns`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    let payload = {};
    try { payload = await res.json(); } catch {}
    const err = new Error(payload?.message || `API Error: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  try { return await res.json(); } catch { return {}; }
}

// ===== A1 верификация по звонку =====

/**
 * POST /api/v1/a1/request
 * Запрос входящего звонка для верификации
 * Body: { phone: "+375291234567", context: "passport_update" }
 * Response: { verification_id, caller_number_masked, expires_at }
 */
export async function requestA1Verification(phone, context = 'passport_update') {
  return fetchAccount('/a1/request', {
    method: 'POST',
    body: JSON.stringify({ phone, context }),
  });
}

/**
 * POST /api/v1/a1/verify
 * Подтверждение кода из звонка
 * Body: { verification_id: 17, last4: "4776" }
 * Response: { success: true }
 */
export async function verifyA1Code(verificationId, last4) {
  return fetchAccount('/a1/verify', {
    method: 'POST',
    body: JSON.stringify({ verification_id: verificationId, last4 }),
  });
}

// ===== Reviews =====

export async function getFavorites(favoriteToken = null) {
  const qs = favoriteToken ? `?favorite_token=${favoriteToken}` : '';
  return fetchAccount(`/favorites${qs}`);
}

export async function addFavorite(sku, favoriteToken = null) {
  return fetchAccount('/favorites', {
    method: 'POST',
    body: JSON.stringify({
      sku,
      ...(favoriteToken ? { favorite_token: favoriteToken } : {}),
    }),
  });
}

export async function removeFavorite(sku, favoriteToken = null) {
  const qs = favoriteToken ? `?favorite_token=${favoriteToken}` : '';
  return fetchAccount(`/favorites/${sku}${qs}`, { method: 'DELETE' });
}