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

export async function getProfile() {
  return fetchAccount('/account/profile');
}

export async function updateProfile(data) {
  return fetchAccount('/account/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
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

export async function getPurchases({ sort = 'newest', page = 1 } = {}) {
  return fetchAccount(`/account/purchases?sort=${sort}&page=${page}`);
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

// ===== Favorites =====

export async function getFavorites() {
  return fetchAccount('/favorites');
}

export async function addFavorite(sku) {
  return fetchAccount('/favorites', {
    method: 'POST',
    body: JSON.stringify({ sku }),
  });
}

export async function removeFavorite(sku) {
  return fetchAccount(`/favorites/${sku}`, { method: 'DELETE' });
}
