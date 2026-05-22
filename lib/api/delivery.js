// ikeya/lib/api/delivery.js

import { getAuthToken } from '@/lib/api/auth';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

async function request(endpoint, options = {}) {
  const token = getAuthToken?.();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
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

// GET /delivery/europost_offices
// На checkout приоритетный контекст — order_id.
// cart_token оставлен как fallback для сценариев до создания draft.
export function getEuropostOffices(paramsOrCartToken = {}) {
  const params = new URLSearchParams();

  if (typeof paramsOrCartToken === 'string') {
    if (paramsOrCartToken) {
      params.set('cart_token', paramsOrCartToken);
    }
  } else if (paramsOrCartToken && typeof paramsOrCartToken === 'object') {
    const orderId = paramsOrCartToken.order_id || paramsOrCartToken.orderId;
    const cartToken = paramsOrCartToken.cart_token || paramsOrCartToken.cartToken;

    if (orderId) {
      params.set('order_id', orderId);
    } else if (cartToken) {
      params.set('cart_token', cartToken);
    }
  }

  const qs = params.toString();

  return request(`/delivery/europost_offices${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
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