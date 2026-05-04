// src/lib/api/cart.js

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

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

async function fetchCartAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const authToken = getAuthToken();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const err = new Error(
        payload.message ||
        payload.error ||
        `API Error: ${response.status}`
      );

      err.status = response.status;
      err.payload = payload;

      throw err;
    }

    return await response.json();
  } catch (error) {
    console.error('Cart API Error:', endpoint, error.message);
    throw error;
  }
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

    if (response.cart?.token) {
      setCartToken(response.cart.token);
    }

    return response;
  } catch (error) {
    if (error.status === 404 || error.message.includes('404') || error.message.includes('не найдена')) {
      removeCartToken();
    }

    return { cart: null };
  }
}

export async function addToCart(sku, quantity = 1) {
  const token = getCartToken();

  try {
    const response = await fetchCartAPI('/cart_items', {
      method: 'POST',
      body: JSON.stringify({
        sku,
        quantity,
        ...(token ? { cart_token: token } : {}),
      }),
    });

    if (response.cart?.token) {
      setCartToken(response.cart.token);
    }

    return response;
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error.message);
    throw error;
  }
}

export async function removeManyFromCart({ skus = [], delete_all = false } = {}) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    return await fetchCartAPI('/cart_items', {
      method: 'DELETE',
      body: JSON.stringify({
        skus,
        delete_all,
        cart_token: token,
      }),
    });
  } catch (error) {
    console.error('Ошибка массового удаления:', error.message);
    throw error;
  }
}

export async function removeFromCart(sku) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    const params = new URLSearchParams({
      cart_token: token,
    });

    return await fetchCartAPI(`/cart_items/${sku}?${params.toString()}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Ошибка удаления товара:', error.message);
    throw error;
  }
}

export async function updateCartItemQuantity(sku, newQuantity) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    if (newQuantity === 0) {
      return await removeFromCart(sku);
    }

    return await fetchCartAPI(`/cart_items/${sku}`, {
      method: 'PATCH',
      body: JSON.stringify({
        quantity: newQuantity,
        cart_token: token,
      }),
    });
  } catch (error) {
    console.error('Ошибка обновления количества:', error.message);
    throw error;
  }
}

export async function clearCart() {
  const token = getCartToken();

  if (!token) {
    return { cart: null };
  }

  try {
    const params = new URLSearchParams({
      cart_token: token,
    });

    const response = await fetchCartAPI(`/cart?${params.toString()}`, {
      method: 'DELETE',
    });

    removeCartToken();

    return response;
  } catch (error) {
    console.error('Ошибка очистки корзины:', error.message);
    throw error;
  }
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

  try {
    const params = new URLSearchParams({
      cart_token: token,
    });

    return await fetchCartAPI(`/cart/promo/remove?${params.toString()}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Ошибка удаления промокода:', error.message);
    throw error;
  }
}

export async function checkout(orderData, authToken) {
  try {
    const authHeaders = {};

    if (authToken) {
      authHeaders.Authorization = `Bearer ${authToken}`;
    }

    const cartToken = getCartToken();

    const response = await fetchCartAPI('/checkout', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        ...orderData,
        ...(cartToken ? { cart_token: cartToken } : {}),
      }),
    });

    removeCartToken();

    return response;
  } catch (error) {
    console.error('Ошибка оформления заказа:', error.message);
    throw error;
  }
}

export async function calculateDelivery({
  delivery_type = 'europost_pickup',
  pickup_point_id,
  items = [],
} = {}) {
  const token = getCartToken();

  try {
    return await fetchCartAPI('/delivery/calculate', {
      method: 'POST',
      body: JSON.stringify({
        cart_token: token || undefined,
        delivery_type,
        pickup_point_id,
        items,
      }),
    });
  } catch (error) {
    console.error('Ошибка расчёта доставки:', error.message);
    throw error;
  }
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

export async function getPickupPoints(cartId) {
  const params = new URLSearchParams();

  if (cartId) {
    params.set('cart_id', cartId);
  }

  const qs = params.toString();

  return fetchCartAPI(`/delivery/europost_offices${qs ? `?${qs}` : ''}`);
}

export async function createDraft(data = {}) {
  const cartToken = getCartToken();

  return fetchCartAPI('/checkout', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      draft: true,
      ...(cartToken ? { cart_token: cartToken } : {}),
    }),
  });
}

export async function finalizeDraft(draftId, orderData) {
  if (!draftId) {
    throw new Error('Не найден идентификатор черновика заказа');
  }

  return fetchCartAPI(`/checkout/${draftId}/finalize`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function getDraft(draftId) {
  const params = new URLSearchParams();

  if (draftId) {
    params.set('draft_id', draftId);
  }

  const qs = params.toString();

  return fetchCartAPI(`/checkout/draft${qs ? `?${qs}` : ''}`);
}

export {
  getCartToken,
  setCartToken,
  removeCartToken,
};