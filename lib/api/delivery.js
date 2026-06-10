// ikeya/lib/api/delivery.js

import { getAuthToken } from '@/lib/api/auth';
import { buildApiUrl } from '@/lib/config/api';

const EUROPOST_OFFICES_TTL = 5 * 60 * 1000;
const europostOfficesCache = new Map();

async function request(endpoint, options = {}) {
  const token = getAuthToken?.();

  const res = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  let data = {};

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const error = new Error(data?.message || data?.error || 'API error');
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  return data;
}

/* ============================= */
/* ===== Delivery endpoints ==== */
/* ============================= */

function normalizeEuropostOfficesParams(paramsOrCartToken = {}) {
  const params = new URLSearchParams();
  let orderId = null;
  let cartToken = null;

  if (typeof paramsOrCartToken === 'string') {
    cartToken = paramsOrCartToken || null;
  } else if (paramsOrCartToken && typeof paramsOrCartToken === 'object') {
    orderId = paramsOrCartToken.order_id || paramsOrCartToken.orderId || null;
    cartToken = paramsOrCartToken.cart_token || paramsOrCartToken.cartToken || null;
  }

  if (orderId) {
    params.set('order_id', orderId);
  } else if (cartToken) {
    params.set('cart_token', cartToken);
  }

  return {
    orderId,
    cartToken,
    queryString: params.toString(),
  };
}

function getEuropostOfficesCacheKey(orderId, cartToken) {
  return JSON.stringify({
    orderId: orderId || null,
    cartToken: cartToken || null,
  });
}

// GET /delivery/europost_offices
// На checkout приоритетный контекст — order_id.
// cart_token оставлен как fallback для сценариев до создания draft.
export function getEuropostOffices(paramsOrCartToken = {}, forceRefresh = false) {
  const { orderId, cartToken, queryString } = normalizeEuropostOfficesParams(paramsOrCartToken);
  const cacheKey = getEuropostOfficesCacheKey(orderId, cartToken);
  const now = Date.now();
  const cached = europostOfficesCache.get(cacheKey);

  if (!forceRefresh) {
    if (cached?.data && cached.expiresAt > now) {
      return Promise.resolve(cached.data);
    }

    if (cached?.promise) {
      return cached.promise;
    }
  }

  const promise = request(`/delivery/europost_offices${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
  })
    .then((data) => {
      europostOfficesCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + EUROPOST_OFFICES_TTL,
        promise: null,
      });
      return data;
    })
    .catch((error) => {
      const current = europostOfficesCache.get(cacheKey);
      if (current?.promise === promise) {
        europostOfficesCache.delete(cacheKey);
      }
      throw error;
    });

  europostOfficesCache.set(cacheKey, {
    data: null,
    expiresAt: now + EUROPOST_OFFICES_TTL,
    promise,
  });

  return promise;
}

// POST /delivery/calculate
// payload checkout: { order_id, delivery_type, pickup_point_id?, items?, address? }
// payload fallback: { cart_token, delivery_type, pickup_point_id?, items?, address? }
// delivery_type: 'europost_pickup' | 'courier' | 'ikeya_delivery'
export function calculateDelivery(payload) {
  return request('/delivery/calculate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/* ================================== */
/* ===== Account: адреса доставки === */
/* ================================== */

// GET /account/delivery_addresses
export function getDeliveryAddresses() {
  return request('/account/delivery_addresses', {
    method: 'GET',
  });
}

// POST /account/delivery_addresses
// data: { city, street, house, building?, apartment?, entrance?, floor?, has_elevator?, intercom?, is_private_house?, lat?, lng?, comment? }
export function createDeliveryAddress(data) {
  return request('/account/delivery_addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PATCH /account/delivery_addresses/:id
export function updateDeliveryAddress(id, data) {
  if (!id) {
    throw new Error('Не найден идентификатор адреса доставки');
  }

  return request(`/account/delivery_addresses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// DELETE /account/delivery_addresses/:id
export function deleteDeliveryAddress(id) {
  if (!id) {
    throw new Error('Не найден идентификатор адреса доставки');
  }

  return request(`/account/delivery_addresses/${id}`, {
    method: 'DELETE',
  });
}

/* ================================ */
/* ===== Account: сохранённые ПВЗ = */
/* ================================ */

// GET /account/pickup_points
export function getSavedPickupPoints() {
  return request('/account/pickup_points', {
    method: 'GET',
  });
}

// POST /account/pickup_points
// data: { pickup_point_id, provider, external_id, city, address, working_hours?, lat?, lng?, raw_payload? }
// Повторный POST по provider+external_id не создаёт дубль — обновляет существующую запись
export function savePickupPoint(data) {
  return request('/account/pickup_points', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// DELETE /account/pickup_points/:id
export function deleteSavedPickupPoint(id) {
  if (!id) {
    throw new Error('Не найден идентификатор ПВЗ');
  }

  return request(`/account/pickup_points/${id}`, {
    method: 'DELETE',
  });
}
