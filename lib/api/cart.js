// src/lib/api/cart.js

const API_BASE_URL = 'http://45.135.234.22/api/v1';

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

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

async function fetchCartAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Cart API Error:', endpoint, error.message);
    throw error;
  }
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

/**
 * Получить корзину
 * (поддерживает promo_code query из сваггера)
 */
export async function getCart({ promo_code } = {}) {
  const token = getCartToken();

  if (!token) {
    return { cart: null };
  }

  try {
    const params = new URLSearchParams();
    params.set('cart_token', token);
    if (promo_code) params.set('promo_code', promo_code);

    const response = await fetchCartAPI(`/cart?${params.toString()}`);

    if (response.cart?.token) {
      setCartToken(response.cart.token);
    }

    return response;
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error.message);
    if (error.message.includes('404') || error.message.includes('не найдена')) {
      removeCartToken();
    }
    return { cart: null };
  }
}

/**
 * Добавить товар в корзину
 */
export async function addToCart(sku, quantity = 1) {
  const token = getCartToken();

  try {
    const response = await fetchCartAPI('/cart_items', {
      method: 'POST',
      body: JSON.stringify({
        sku,
        quantity,
        cart_token: token || undefined,
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

/**
 * Массовое удаление товаров из корзины (bulk)
 * DELETE /api/v1/cart_items body: { skus, delete_all, cart_token }
 */
export async function removeManyFromCart({ skus = [], delete_all = false } = {}) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    const response = await fetchCartAPI('/cart_items', {
      method: 'DELETE',
      body: JSON.stringify({
        skus,
        delete_all,
        cart_token: token,
      }),
    });

    return response;
  } catch (error) {
    console.error('Ошибка массового удаления:', error.message);
    throw error;
  }
}

/**
 * Удалить один товар из корзины
 */
export async function removeFromCart(sku) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    const response = await fetchCartAPI(`/cart_items/${sku}?cart_token=${token}`, {
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Ошибка удаления товара:', error.message);
    throw error;
  }
}

/**
 * Изменить количество товара в корзине (PATCH по сваггеру)
 * PATCH /api/v1/cart_items/{sku} body: { quantity, cart_token }
 */
export async function updateCartItemQuantity(sku, newQuantity) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    // Если 0 — можно либо PATCH 0 (если API позволяет), либо удалять.
    // Сваггер говорит PATCH quantity, но поведение на 0 не гарантировано -> безопасно удаляем.
    if (newQuantity === 0) {
      return await removeFromCart(sku);
    }

    const response = await fetchCartAPI(`/cart_items/${sku}`, {
      method: 'PATCH',
      body: JSON.stringify({
        quantity: newQuantity,
        cart_token: token,
      }),
    });

    return response;
  } catch (error) {
    console.error('Ошибка обновления количества:', error.message);
    throw error;
  }
}

/**
 * Очистить всю корзину
 */
export async function clearCart() {
  const token = getCartToken();

  if (!token) {
    return { cart: null };
  }

  try {
    const response = await fetchCartAPI(`/cart?cart_token=${token}`, {
      method: 'DELETE',
    });

    removeCartToken();
    return response;
  } catch (error) {
    console.error('Ошибка очистки корзины:', error.message);
    throw error;
  }
}

/**
 * Применить промокод
 */
export async function applyPromoCode(code) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    const response = await fetchCartAPI('/cart/promo/apply', {
      method: 'POST',
      body: JSON.stringify({
        code,
        cart_token: token,
      }),
    });

    return response;
  } catch (error) {
    // Перехватываем 422 и бросаем понятное сообщение
    if (error.message.includes('422')) {
      throw new Error('Промокод недействителен или истёк срок его действия');
    }
    console.error('Ошибка применения промокода:', error.message);
    throw error;
  }
}


/**
 * Удалить промокод
 */
export async function removePromoCode() {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    const response = await fetchCartAPI(`/cart/promo/remove?cart_token=${token}`, {
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Ошибка удаления промокода:', error.message);
    throw error;
  }
}

/**
 * Оформить заказ
 */
export async function checkout(orderData) {
  try {
    const response = await fetchCartAPI('/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });

    removeCartToken();
    return response;
  } catch (error) {
    console.error('Ошибка оформления заказа:', error.message);
    throw error;
  }
}

export { getCartToken, setCartToken, removeCartToken };