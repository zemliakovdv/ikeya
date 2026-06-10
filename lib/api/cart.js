// src/lib/api/cart.js

import { buildApiUrl } from '@/lib/config/api';

function getCartToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cart_token');
}

function setCartToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart_token', token);
}

function removeCartToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart_token');
}

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function cleanPayload(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );
}

function resolveCheckoutItemSku(item) {
  return (
    item?.sku ||
    item?.product_sku ||
    item?.product?.sku ||
    item?.product?.data?.attributes?.sku ||
    item?.product?.attributes?.sku ||
    item?.attributes?.sku ||
    item?.attributes?.product_sku ||
    null
  );
}

export function normalizeCheckoutItems(items = []) {
  return (items || [])
    .map((item) => ({
      sku: String(resolveCheckoutItemSku(item) || '').trim(),
      quantity: Number(item?.quantity || item?.qty || 1),
    }))
    .filter((item) => item.sku && Number.isFinite(item.quantity) && item.quantity > 0);
}

function safeParseText(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function maskToken(value) {
  const str = String(value || '');
  if (str.length <= 10) return '***';
  return `${str.slice(0, 6)}***${str.slice(-4)}`;
}

function maskPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length <= 5) return '***';
  return `${digits.slice(0, 3)}***${digits.slice(-2)}`;
}

function sanitizeForLog(value, key = '') {
  if (value == null) return value;

  const normalizedKey = String(key || '').toLowerCase();

  if (normalizedKey.includes('token')) {
    return maskToken(value);
  }

  if (normalizedKey.includes('phone')) {
    return maskPhone(value);
  }

  if (
    normalizedKey.includes('passport') ||
    normalizedKey.includes('identification') ||
    normalizedKey.includes('intercom') ||
    normalizedKey.includes('email')
  ) {
    return '***';
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForLog(item, key));
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        sanitizeForLog(entryValue, entryKey),
      ])
    );
  }

  return value;
}

function logCartApi422(endpoint, payload, responseBody) {
  console.error('Cart API 422', {
    endpoint,
    status: 422,
    payload: sanitizeForLog(payload),
    responseBody: sanitizeForLog(responseBody),
  });
}

async function fetchCartAPI(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  const authToken = getAuthToken();
  const requestPayload = options.body ? safeParseText(options.body) : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = safeParseText(text);

  if (!response.ok) {
    if (response.status === 422) {
      logCartApi422(endpoint, requestPayload, payload);
    }

    const err = new Error(
      (typeof payload === 'object' && payload?.message) ||
      (typeof payload === 'object' && payload?.error) ||
      (typeof payload === 'string' && payload) ||
      `API Error: ${response.status}`
    );

    err.status = response.status;
    err.payload = payload || {};

    throw err;
  }

  return payload;
}

export async function getCart({ promo_code } = {}) {
  const authToken = getAuthToken();
  const token = getCartToken();

  if (!authToken && !token) {
    return { cart: null };
  }

  try {
    const params = new URLSearchParams();

    if (token) {
      params.set('cart_token', token);
    }

    if (promo_code) {
      params.set('promo_code', promo_code);
    }

    const qs = params.toString();
    const response = await fetchCartAPI(`/cart${qs ? `?${qs}` : ''}`);

    if (response?.cart?.token) {
      setCartToken(response.cart.token);
    }

    return response;
  } catch (error) {
    if (
      error.status === 404 ||
      error.message.includes('404') ||
      error.message.includes('не найдена')
    ) {
      removeCartToken();
    }

    return { cart: null };
  }
}

export async function addToCart(sku, quantity = 1) {
  const token = getCartToken();

  const response = await fetchCartAPI('/cart_items', {
    method: 'POST',
    body: JSON.stringify({
      sku,
      quantity,
      ...(token ? { cart_token: token } : {}),
    }),
  });

  if (response?.cart?.token) {
    setCartToken(response.cart.token);
  }

  return response;
}

export async function removeManyFromCart({ skus = [], delete_all = false } = {}) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  return fetchCartAPI('/cart_items', {
    method: 'DELETE',
    body: JSON.stringify({
      skus,
      delete_all,
      cart_token: token,
    }),
  });
}

export async function removeFromCart(sku) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  const params = new URLSearchParams({
    cart_token: token,
  });

  return fetchCartAPI(`/cart_items/${sku}?${params.toString()}`, {
    method: 'DELETE',
  });
}

export async function updateCartItemQuantity(sku, newQuantity) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  if (newQuantity === 0) {
    return removeFromCart(sku);
  }

  return fetchCartAPI(`/cart_items/${sku}`, {
    method: 'PATCH',
    body: JSON.stringify({
      quantity: newQuantity,
      cart_token: token,
    }),
  });
}

export async function clearCart() {
  const token = getCartToken();

  if (!token) {
    return { cart: null };
  }

  const params = new URLSearchParams({
    cart_token: token,
  });

  const response = await fetchCartAPI(`/cart?${params.toString()}`, {
    method: 'DELETE',
  });

  removeCartToken();

  return response;
}

export async function applyPromoCode(code) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    return await fetchCartAPI('/cart/promo/apply', {
      method: 'POST',
      body: JSON.stringify({
        code,
        cart_token: token,
      }),
    });
  } catch (error) {
    if (error.status === 422 || error.message.includes('422')) {
      throw new Error('Промокод недействителен или истёк срок его действия');
    }

    throw error;
  }
}

export async function removePromoCode() {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  const params = new URLSearchParams({
    cart_token: token,
  });

  return fetchCartAPI(`/cart/promo/remove?${params.toString()}`, {
    method: 'DELETE',
  });
}

export async function checkout(orderData = {}, authToken) {
  const authHeaders = {};
  const normalizedItems = Array.isArray(orderData?.items)
    ? normalizeCheckoutItems(orderData.items)
    : undefined;

  if (authToken) {
    authHeaders.Authorization = `Bearer ${authToken}`;
  }

  return fetchCartAPI('/checkout', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(cleanPayload({
      ...orderData,
      ...(normalizedItems?.length ? { items: normalizedItems } : {}),
    })),
  });
}

export async function calculateDelivery({
  order_id,
  orderId,
  cart_token,
  cartToken,
  delivery_type = 'europost_pickup',
  pickup_point_id,
  items = [],
  address,
} = {}) {
  const resolvedOrderId = order_id || orderId;
  const resolvedCartToken = cart_token || cartToken || (!resolvedOrderId ? getCartToken() : null);

  return fetchCartAPI('/delivery/calculate', {
    method: 'POST',
    body: JSON.stringify(cleanPayload({
      ...(resolvedOrderId ? { order_id: resolvedOrderId } : {}),
      ...(!resolvedOrderId && resolvedCartToken ? { cart_token: resolvedCartToken } : {}),
      delivery_type,
      pickup_point_id,
      items,
      address,
    })),
  });
}

export async function getCartSummary({ items = [] } = {}) {
  const token = getCartToken();
  const normalizedItems = normalizeCheckoutItems(items);

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  if (!normalizedItems.length) {
    throw new Error('Не удалось подготовить товары для пересчета корзины');
  }

  return fetchCartAPI('/cart/summary', {
    method: 'POST',
    body: JSON.stringify({
      cart_token: token,
      items: normalizedItems,
    }),
  });
}

export async function getCheckoutSummary() {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  const params = new URLSearchParams({ cart_token: token });

  return fetchCartAPI(`/checkout/summary?${params.toString()}`);
}

export async function getProfile(authToken) {
  const headers = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return fetchCartAPI('/account/profile', {
    headers,
  });
}

export async function getPickupPoints(paramsOrCartToken) {
  const params = new URLSearchParams();

  if (typeof paramsOrCartToken === 'string') {
    params.set('cart_token', paramsOrCartToken);
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

  return fetchCartAPI(`/delivery/europost_offices${qs ? `?${qs}` : ''}`);
}

export async function createDraft(data = {}) {
  const token = getCartToken();
  const normalizedItems = normalizeCheckoutItems(data?.items || []);

  if (!normalizedItems.length) {
    throw new Error('Не удалось подготовить товары для оформления заказа');
  }

  return fetchCartAPI('/checkout', {
    method: 'POST',
    body: JSON.stringify(cleanPayload({
      ...(token ? { cart_token: token } : {}),
      ...data,
      items: normalizedItems,
      draft: true,
    })),
  });
}

export async function finalizeDraft(draftId, orderData = {}) {
  if (!draftId) {
    throw new Error('Не найден идентификатор черновика заказа');
  }

  return fetchCartAPI(`/checkout/${draftId}/finalize`, {
    method: 'POST',
    body: JSON.stringify(cleanPayload({
      ...orderData,
      ...(Array.isArray(orderData?.items) && normalizeCheckoutItems(orderData.items).length > 0
        ? { items: normalizeCheckoutItems(orderData.items) }
        : {}),
    })),
  });
}

export async function getDraft(draftId) {
  if (draftId) {
    try {
      return await fetchCartAPI(`/checkout/${draftId}`);
    } catch (error) {
      if (![404, 405, 422].includes(error.status)) {
        throw error;
      }
    }
  }

  const params = new URLSearchParams();

  if (draftId) {
    params.set('draft_id', draftId);
  }

  const qs = params.toString();

  return fetchCartAPI(`/checkout/draft${qs ? `?${qs}` : ''}`);
}

export async function updateCheckoutDraft(draftId, data = {}) {
  if (!draftId) {
    throw new Error('Не найден идентификатор черновика заказа');
  }

  return fetchCartAPI(`/checkout/${draftId}`, {
    method: 'PATCH',
    body: JSON.stringify(cleanPayload(data)),
  });
}

export {
  getCartToken,
  setCartToken,
  removeCartToken,
};
