// ikeya/lib/api/delivery.js

import { getAuthToken } from '@/lib/api/auth';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

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

// GET /delivery/types
export function getDeliveryTypes() {
  return request('/delivery/types', { method: 'GET' });
}

// GET /delivery/pickup_points
export function getPickupPoints() {
  return request('/delivery/pickup_points', { method: 'GET' });
}

// GET /delivery/pickup_points_search?query=...
export function searchPickupPoints(query) {
  return request(
    `/delivery/pickup_points_search?query=${encodeURIComponent(query)}`,
    { method: 'GET' }
  );
}

// GET /delivery/europost_offices
export function getEuropostOffices() {
  return request('/delivery/europost_offices', { method: 'GET' });
}

// POST /delivery/calculate
export function calculateDelivery(payload) {
  return request('/delivery/calculate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}