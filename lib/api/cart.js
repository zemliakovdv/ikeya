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
 */
export async function getCart() {
  const token = getCartToken();

  if (!token) {
    return { cart: null };
  }

  try {
    const response = await fetchCartAPI(`/cart?cart_token=${token}`);

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
 * Полная очистка корзины
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
 * Удалить один товар из корзины
 */
export async function removeFromCart(sku) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    return await fetchCartAPI(`/cart_items/${encodeURIComponent(sku)}?cart_token=${token}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Ошибка удаления товара:', error.message);
    throw error;
  }
}

/**
 * Массовое удаление товаров из корзины (Swagger: DELETE /cart_items)
 * @param {string[]} skus
 * @param {boolean} deleteAll - если true, удалит всё (даже если skus пустой)
 */
export async function removeManyFromCart(skus = [], deleteAll = false) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  try {
    const response = await fetchCartAPI('/cart_items', {
      method: 'DELETE',
      body: JSON.stringify({
        skus,
        delete_all: deleteAll,
        cart_token: token,
      }),
    });

    if (response.cart?.token) {
      setCartToken(response.cart.token);
    }

    return response;
  } catch (error) {
    console.error('Ошибка массового удаления товаров:', error.message);
    throw error;
  }
}

/**
 * Изменить количество товара в корзине (Swagger: PATCH /cart_items/{sku})
 * Если newQuantity === 0 — удаляем товар.
 */
export async function updateCartItemQuantity(sku, newQuantity) {
  const token = getCartToken();

  if (!token) {
    throw new Error('Корзина не найдена');
  }

  if (newQuantity === 0) {
    return removeFromCart(sku);
  }

  try {
    const response = await fetchCartAPI(`/cart_items/${encodeURIComponent(sku)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        quantity: newQuantity,
        cart_token: token,
      }),
    });

    if (response.cart?.token) {
      setCartToken(response.cart.token);
    }

    return response;
  } catch (error) {
    console.error('Ошибка обновления количества:', error.message);
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
    return await fetchCartAPI('/cart/promo/apply', {
      method: 'POST',
      body: JSON.stringify({
        code,
        cart_token: token,
      }),
    });
  } catch (error) {
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
    return await fetchCartAPI(`/cart/promo/remove?cart_token=${token}`, {
      method: 'DELETE',
    });
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

// Экспорт вспомогательных функций
export { getCartToken, setCartToken, removeCartToken };