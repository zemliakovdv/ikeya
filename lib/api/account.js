// lib/api/account.js

import { getAuthToken } from '@/lib/api/auth';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

async function fetchAccount(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    cache: 'no-store',
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
  'created', 'processing', 'confirmed', 'paid', 'purchased',
  'received_poland', 'preparing_for_shipment', 'export_eu',
  'customs_poland', 'on_border', 'customs_belarus',
  'shipped', 'handed_to_courier', 'arrived_pvz',
];

const HISTORY_STATUSES = [
  'completed', 'cancelled',
];

export const STATUS_LABELS = {
  created:                'Новый',
  processing:             'В работе',
  confirmed:              'Подтвержден',
  paid:                   'Оплачен',
  purchased:              'Выкуплен',
  received_poland:        'Получен на склад',
  preparing_for_shipment: 'Подготовка к отправке',
  export_eu:              'Экспорт из ЕС',
  customs_poland:         'Экспорт из ЕС',
  on_border:              'На границе',
  customs_belarus:        'Прибыл на таможню',
  shipped:                'Передано в доставку',
  arrived_pvz:            'Прибыло в отделение',
  handed_to_courier:      'Выдано курьеру',
  completed:              'Доставлено',
  cancelled:              'Отменен',
};

export function isActiveOrder(status)  { return ACTIVE_STATUSES.includes(status); }
export function isHistoryOrder(status) { return HISTORY_STATUSES.includes(status); }
export function getStatusLabel(status) { return STATUS_LABELS[status] || status; }

// ===== Profile =====

export async function getProfile() {
  return fetchAccount('/account/profile');
}

export async function updateProfile(data) {
  return fetchAccount('/account/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function requestPhoneChange(phone) {
  return fetchAccount('/account/profile/change_phone_request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function verifyPhoneChange(phone, code) {
  return fetchAccount('/account/profile/change_phone_verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
}

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

export async function requestA1Verification(phone, context = 'passport_update') {
  return fetchAccount('/a1/request', {
    method: 'POST',
    body: JSON.stringify({ phone, context }),
  });
}

export async function verifyA1Code(verificationId, last4) {
  return fetchAccount('/a1/verify', {
    method: 'POST',
    body: JSON.stringify({ verification_id: verificationId, last4 }),
  });
}

// ===== Favorites =====

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