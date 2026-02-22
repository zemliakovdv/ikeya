// lib/api/account.js

import { getAuthToken } from '@/lib/api/auth';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

// ===== fetch wrapper с Bearer-токеном =====

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

// Активные заказы — ещё в процессе
const ACTIVE_STATUSES = [
  'awaiting_payment',
  'pending',
  'processing',
  'assembly',
  'assembly_process',
  'transit',
  'customs_poland',
  'customs_belarus',
  'available_warehouse',
  'delivering',
  'delivered_to_pvz',
];

// История — завершённые
const HISTORY_STATUSES = [
  'delivered',
  'completed',
  'canceled',
  'cancelled',
  'returned',
];

// Читаемые названия статусов для UI
export const STATUS_LABELS = {
  awaiting_payment:   'Ждёт оплаты',
  pending:            'Оформляется',
  processing:         'Обрабатывается',
  assembly:           'Сборка заказа',
  assembly_process:   'Подготовка и сборка',
  transit:            'В пути',
  customs_poland:     'Таможня Польша',
  customs_belarus:    'Таможня Беларусь',
  available_warehouse:'Доступен на складе',
  delivering:         'Доставляется',
  delivered_to_pvz:   'Прибыл в ПВЗ',
  delivered:          'Получен',
  completed:          'Завершён',
  canceled:           'Отменён',
  cancelled:          'Отменён',
  returned:           'Возврат',
};

export function isActiveOrder(status) {
  return ACTIVE_STATUSES.includes(status);
}

export function isHistoryOrder(status) {
  return HISTORY_STATUSES.includes(status);
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

// ===== Profile =====

/**
 * GET /api/v1/account/profile
 * Response: { id, username, email, phone, country_code, gdpr_consent, newsletter_consent, passport_verified }
 */
export async function getProfile() {
  return fetchAccount('/account/profile');
}

/**
 * PATCH /api/v1/account/profile
 * Body: { username?, email?, phone?, country_code?, gdpr_consent?, newsletter_consent? }
 * Response: { id, username, email, phone, ... }
 */
export async function updateProfile(data) {
  return fetchAccount('/account/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ===== Orders =====

/**
 * GET /api/v1/account/orders
 * Params: { page?, per_page? }
 * Response: { data: [{ id, type, attributes: { id, status, total_amount, ... } }], meta: { total, page, per_page } }
 */
export async function getOrders({ page = 1, per_page = 20 } = {}) {
  return fetchAccount(`/account/orders?page=${page}&per_page=${per_page}`);
}

/**
 * GET /api/v1/account/orders/{id}
 * Response: { data: { attributes: { ... } }, included: [{ attributes: { product_sku, quantity, price_byn, name, image_url } }] }
 */
export async function getOrderById(id) {
  return fetchAccount(`/account/orders/${id}`);
}

/**
 * POST /api/v1/account/orders/{id}/reorder
 * Response: { message, added_skus, missing_skus, has_missing }
 */
export async function reorder(id) {
  return fetchAccount(`/account/orders/${id}/reorder`, {
    method: 'POST',
  });
}

// ===== Purchases =====

/**
 * GET /api/v1/account/purchases
 * Params: { sort?: 'newest'|'oldest'|'price_asc'|'price_desc', page?: number }
 * Response: { purchases: [{ order_id, status, purchased_at, product_sku, quantity, price_byn, product: { sku, name, price_byn, images } }], meta }
 */
export async function getPurchases({ sort = 'newest', page = 1 } = {}) {
  return fetchAccount(`/account/purchases?sort=${sort}&page=${page}`);
}

// ===== Receipts =====

/**
 * GET /api/v1/account/receipts
 * Response: { receipts: [{ order_id, purchased_at, receipts: [{ filename, url }] }] }
 */
export async function getReceipts() {
  return fetchAccount('/account/receipts');
}

// ===== Returns =====

/**
 * GET /api/v1/account/returns
 */
export async function getReturns() {
  return fetchAccount('/account/returns');
}

/**
 * POST /api/v1/account/returns
 * Body: FormData { order_id, reason, comment?, attachments? }
 */
export async function createReturn(formData) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/account/returns`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      // Content-Type не ставим — браузер сам добавит boundary для multipart
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
