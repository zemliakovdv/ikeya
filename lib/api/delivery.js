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
    const error = new Error(data?.message || 'API error');
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
// cartId — опционально: при передаче возвращает только подходящие ПВЗ с ВГХ-проверкой, ETA и ценами
export function getEuropostOffices(cartId) {
  const qs = cartId ? `?cart_id=${cartId}` : '';
  return request(`/delivery/europost_offices${qs}`, { method: 'GET' });
}

// POST /delivery/calculate
// payload: { cart_token, delivery_type, pickup_point_id?, items? }
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
  return request('/account/delivery_addresses', { method: 'GET' });
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
  return request(`/account/delivery_addresses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// DELETE /account/delivery_addresses/:id
export function deleteDeliveryAddress(id) {
  return request(`/account/delivery_addresses/${id}`, { method: 'DELETE' });
}

/* ================================ */
/* ===== Account: сохранённые ПВЗ = */
/* ================================ */

// GET /account/pickup_points
export function getSavedPickupPoints() {
  return request('/account/pickup_points', { method: 'GET' });
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
  return request(`/account/pickup_points/${id}`, { method: 'DELETE' });
}