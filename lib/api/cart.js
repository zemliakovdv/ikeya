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

async function fetchCartAPI(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  const authToken = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const err = new Error(
      payload?.message ||
      payload?.error ||
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

  if (authToken) {
    authHeaders.Authorization = `Bearer ${authToken}`;
  }

  return fetchCartAPI('/checkout', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(orderData),
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

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  return fetchCartAPI('/cart/summary', {
    method: 'POST',
    body: JSON.stringify({
      cart_token: token,
      items: items
        .filter((item) => item?.sku)
        .map((item) => ({
          sku: String(item.sku),
          quantity: Number(item.quantity || 1),
        })),
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

  return fetchCartAPI('/checkout', {
    method: 'POST',
    body: JSON.stringify(cleanPayload({
      ...(token ? { cart_token: token } : {}),
      ...data,
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
    body: JSON.stringify(orderData),
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
