import { getAuthToken } from '@/lib/api/auth';
import { buildApiUrl } from '@/lib/config/api';

async function fetchAccount(endpoint, options = {}) {
  const token = getAuthToken();
  const url = buildApiUrl(endpoint);

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

// ===== Статусы заказов =====

const UNPAID_STATUSES = ['created', 'processing'];
const PAYMENT_LIFETIME_MS = 20 * 60 * 1000;

export const ORDER_STATUS_ALIASES = {
  confirmed: 'paid',
  purchased: 'paid',
  export_eu: 'preparing_for_shipment',
  on_border: 'customs_poland',
  in_transit_pvz: 'shipped',
  canceled: 'cancelled',
  delivered: 'completed',
};

export const ORDER_STATUS_FALLBACK_LABELS = {
  created: 'В обработке',
  processing: 'Ждёт оплаты',
  paid: 'Оформлен',
  received_poland: 'Получен на склад Польша',
  preparing_for_shipment: 'Подготовка и сборка заказа',
  customs_poland: 'Таможня Польша',
  customs_belarus: 'Таможня Беларусь',
  shipped: 'В доставке ПВЗ',
  handed_to_courier: 'Доставка курьером',
  handed_to_courier_ikeya: 'Доставка курьером IKEYA',
  arrived_pvz: 'Доставлено в ПВЗ',
  completed: 'Получен',
  cancelled: 'Отменен',
};

export const ORDER_STATUS_CONFIG = {
  created: {
    group: 'active',
    frontendStatus: 'awaiting',
    badgeClass: 'badge-awaiting',
    whereIsVisible: false,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: null,
  },
  processing: {
    group: 'active',
    frontendStatus: 'awaiting',
    badgeClass: 'badge-awaiting',
    whereIsVisible: false,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: null,
  },
  paid: {
    group: 'active',
    frontendStatus: 'assembly',
    badgeClass: 'badge-assembly',
    whereIsVisible: true,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: 'created',
  },
  received_poland: {
    group: 'active',
    frontendStatus: 'transit',
    badgeClass: 'badge-available',
    whereIsVisible: true,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: 'warehouse',
  },
  preparing_for_shipment: {
    group: 'active',
    frontendStatus: 'transit',
    badgeClass: 'badge-available',
    whereIsVisible: true,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: 'assembly',
  },
  customs_poland: {
    group: 'active',
    frontendStatus: 'transit',
    badgeClass: 'badge-available',
    whereIsVisible: true,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: 'customs-pl',
  },
  customs_belarus: {
    group: 'active',
    frontendStatus: 'customs-belarus',
    badgeClass: 'badge-available',
    whereIsVisible: true,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: 'customs-by',
  },
  shipped: {
    group: 'active',
    frontendStatus: 'in-transit-pvz',
    badgeClass: 'badge-available',
    whereIsVisible: false,
    trackingVisible: true,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: 'in-transit',
  },
  handed_to_courier: {
    group: 'active',
    frontendStatus: 'transit',
    badgeClass: 'badge-available',
    whereIsVisible: false,
    trackingVisible: true,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: null,
  },
  handed_to_courier_ikeya: {
    group: 'active',
    frontendStatus: 'transit',
    badgeClass: 'badge-available',
    whereIsVisible: false,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: null,
  },
  arrived_pvz: {
    group: 'active',
    frontendStatus: 'arrived-pvz',
    badgeClass: 'badge-ready',
    whereIsVisible: false,
    trackingVisible: true,
    pvzInfoVisible: true,
    repeatAllowed: false,
    trackingStep: 'arrived',
  },
  completed: {
    group: 'history',
    frontendStatus: 'delivered',
    badgeClass: 'badge-havit',
    whereIsVisible: false,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: false,
    trackingStep: null,
  },
  cancelled: {
    group: 'history',
    frontendStatus: 'canceled',
    badgeClass: 'badge-canceled',
    whereIsVisible: false,
    trackingVisible: false,
    pvzInfoVisible: false,
    repeatAllowed: true,
    trackingStep: null,
  },
};

export const ORDER_STATUS_LABELS = ORDER_STATUS_FALLBACK_LABELS;

const DRAFT_ORDER_STATUS_CONFIG = {
  group: 'active',
  frontendStatus: 'draft',
  badgeClass: 'badge-assembly',
  whereIsVisible: false,
  trackingVisible: false,
  pvzInfoVisible: false,
  repeatAllowed: false,
  trackingStep: null,
};

const UNKNOWN_ORDER_STATUS_CONFIG = {
  group: 'active',
  frontendStatus: 'unknown',
  badgeClass: '',
  whereIsVisible: false,
  trackingVisible: false,
  pvzInfoVisible: false,
  repeatAllowed: false,
  trackingStep: null,
};

export function normalizeOrderStatus(status) {
  if (!status) return null;
  return ORDER_STATUS_ALIASES[status] || status;
}

export function isActiveOrder(status) {
  const canonicalStatus = normalizeOrderStatus(status);
  return ORDER_STATUS_CONFIG[canonicalStatus]?.group === 'active';
}

export function isHistoryOrder(status) {
  const canonicalStatus = normalizeOrderStatus(status);
  return ORDER_STATUS_CONFIG[canonicalStatus]?.group === 'history';
}

export function getOrderStatus(order) {
  if (!order || typeof order !== 'object') return null;

  return (
    order.rawStatus ||
    order.attributes?.status ||
    order.status ||
    null
  );
}

export function getOrderCanonicalStatus(order) {
  if (!order || typeof order !== 'object') return null;
  if (order.canonicalStatus) return order.canonicalStatus;
  return normalizeOrderStatus(getOrderStatus(order));
}

function getOrderTrackNumber(order) {
  return (
    order?.trackNumber ||
    order?.track_number ||
    order?.attributes?.track_number ||
    null
  );
}

export function getOrderStatusConfig(order) {
  if (!order || typeof order !== 'object') return UNKNOWN_ORDER_STATUS_CONFIG;
  if (order.statusConfig) return order.statusConfig;
  if (isProfileDraftOrder(order)) return DRAFT_ORDER_STATUS_CONFIG;

  const canonicalStatus = order.isExpiredUnpaid === true
    ? 'cancelled'
    : getOrderCanonicalStatus(order);

  return ORDER_STATUS_CONFIG[canonicalStatus] || UNKNOWN_ORDER_STATUS_CONFIG;
}

export function getOrderStatusLabel(order) {
  const attributes = order?.attributes || order || {};
  const rawStatus = getOrderStatus(order);
  const canonicalStatus = getOrderCanonicalStatus(order);
  const canonicalLabel = ORDER_STATUS_FALLBACK_LABELS[canonicalStatus];

  if (canonicalLabel) {
    return canonicalLabel;
  }

  return (
    attributes.status_description ||
    attributes.status_label ||
    attributes.status_name ||
    attributes.status_title ||
    attributes.status_text ||
    rawStatus ||
    '—'
  );
}

export function isProfileDraftOrder(order) {
  const attributes = order?.attributes || {};

  return (
    order?.isDraft === true ||
    attributes.checkout_draft === true ||
    order?.checkout_draft === true
  );
}

export function isProfileExpiredUnpaidOrder(order) {
  if (order?.isExpiredUnpaid === true) return true;
  if (order?.isExpiredUnpaid === false && order?.rawStatus) return false;

  const attributes = order?.attributes || order || {};
  const rawStatus = getOrderStatus(order);

  if (isProfileDraftOrder(order)) return false;
  if (!UNPAID_STATUSES.includes(rawStatus)) return false;
  if (attributes.payment_expired === true || order?.paymentExpired === true) return true;

  const expiresAt = attributes.payment_expires_at || order?.paymentExpiresAt;
  if (expiresAt) {
    return new Date(expiresAt).getTime() <= Date.now();
  }

  const createdAt = new Date(attributes.created_at || order?.createdAt);
  if (Number.isNaN(createdAt.getTime())) return false;
  return createdAt.getTime() + PAYMENT_LIFETIME_MS <= Date.now();
}

export function isProfileActiveOrder(order) {
  if (!order || typeof order !== 'object') return false;
  if (isProfileDraftOrder(order)) return true;

  const statusConfig = getOrderStatusConfig(order);
  return statusConfig.group === 'active' && !isProfileHistoryOrder(order);
}

export function isProfileHistoryOrder(order) {
  if (isProfileDraftOrder(order)) return false;
  if (isProfileExpiredUnpaidOrder(order)) return true;

  const statusConfig = getOrderStatusConfig(order);
  return statusConfig.group === 'history';
}

export function canShowOrderTrackNumber(order) {
  const statusConfig = getOrderStatusConfig(order);
  return Boolean(getOrderTrackNumber(order) && statusConfig.trackingVisible === true);
}

export function canShowWhereIsOrderButton(order) {
  if (!getOrderStatus(order)) return false;
  if (isProfileHistoryOrder(order)) return false;

  const statusConfig = getOrderStatusConfig(order);
  return statusConfig.whereIsVisible === true;
}

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
  const url = buildApiUrl('/account/returns');

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
