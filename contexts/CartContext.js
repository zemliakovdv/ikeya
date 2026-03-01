'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as cartAPI from '@/lib/api/cart';
import { getProductBySku, getPopularProducts } from '@/lib/api/ikea';

const CartContext = createContext();

const UPDATE_DEBOUNCE_MS = 500;

function safeJsonParse(value, fallback) {
  if (typeof value !== 'string') return value ?? fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Дебаунс по sku: sku -> timeoutId
  const qtyTimersRef = useRef(new Map());

  // ==================== ENRICH (обогащение items данными товара) ====================

  const enrichCartItems = useCallback(async (incomingCart) => {
    if (!incomingCart?.items || incomingCart.items.length === 0) return incomingCart;

    const enrichedItems = await Promise.all(
      incomingCart.items.map(async (item) => {
        const sku = item?.sku;
        if (!sku) return item;

        try {
          const productData = await getProductBySku(sku);
          const attrs = productData?.data?.attributes || {};

          // attrs.local_images у тебя часто строка JSON (или массив) — оставляем как есть,
          // CartItem умеет парсить строку.
          const localImages =
            attrs.local_images ??
            item?.product?.images?.local_images ??
            item?.product?.local_images ??
            null;

          const images =
            attrs.images ??
            item?.product?.images?.images ??
            item?.product?.images ??
            null;

          return {
            ...item,
            product: {
              ...item.product,
              sku: attrs.sku || item.product?.sku || sku,
              name_ru: attrs.name_ru || item.product?.name_ru || null,
              name: attrs.name || item.product?.name || null,
              collection: attrs.collection || item.product?.collection || null,

              // ВАЖНО: CartItem ожидает product.local_images / product.images, не product.images.local_images
              local_images: localImages,
              images: images,

              // на всякий — если где-то ещё читают price_byn
              price_byn: attrs.price_byn || item.product?.price_byn || null,
              category_id: attrs.category_id || item.product?.category_id || null,
            },
          };
        } catch (e) {
          console.error(`Не удалось загрузить данные для SKU ${sku}`);
          return item;
        }
      })
    );

    return { ...incomingCart, items: enrichedItems };
  }, []);

  const ensureRecommendations = useCallback(async (incomingCart) => {
    if (!incomingCart) return incomingCart;

    if (incomingCart.recommendations && incomingCart.recommendations.length > 0) {
      return incomingCart;
    }

    try {
      const popularData = await getPopularProducts({ page: 1, per_page: 10 });
      return {
        ...incomingCart,
        recommendations: popularData?.data || [],
      };
    } catch (e) {
      console.error('Не удалось загрузить популярные товары');
      return incomingCart;
    }
  }, []);

  const normalizeAndSetCart = useCallback(
    async (nextCart) => {
      const withItems = await enrichCartItems(nextCart);
      const withRecs = await ensureRecommendations(withItems);
      setCart(withRecs);
    },
    [enrichCartItems, ensureRecommendations]
  );

  // ==================== ЗАГРУЗКА КОРЗИНЫ ====================

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      await normalizeAndSetCart(response?.cart || null);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Ошибка загрузки корзины');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [normalizeAndSetCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Чистим таймеры при размонтировании
  useEffect(() => {
    return () => {
      qtyTimersRef.current.forEach((t) => clearTimeout(t));
      qtyTimersRef.current.clear();
    };
  }, []);

  // ==================== ОПЕРАЦИИ С КОРЗИНОЙ ====================

  const addToCart = useCallback(
    async (sku, quantity = 1) => {
      try {
        setLoading(true);
        const response = await cartAPI.addToCart(sku, quantity);
        await normalizeAndSetCart(response?.cart || null);
        setError(null);
        return response;
      } catch (err) {
        setError(err?.message || 'Ошибка добавления в корзину');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [normalizeAndSetCart]
  );

  const removeFromCart = useCallback(
    async (sku) => {
      try {
        setLoading(true);
        const response = await cartAPI.removeFromCart(sku);
        await normalizeAndSetCart(response?.cart || null);
        setError(null);
        return response;
      } catch (err) {
        setError(err?.message || 'Ошибка удаления товара');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [normalizeAndSetCart]
  );

  /**
   * Изменить количество товара (оптимистично + дебаунс PATCH по SKU)
   */
  const updateQuantity = useCallback(
    async (sku, newQuantity) => {
      if (!sku) return;

      // newQuantity === 0 -> сразу удаляем
      if (newQuantity === 0) {
        // чистим возможный дебаунс по этому sku
        const prevTimer = qtyTimersRef.current.get(sku);
        if (prevTimer) clearTimeout(prevTimer);
        qtyTimersRef.current.delete(sku);

        return removeFromCart(sku);
      }

      // Оптимистично обновляем только quantity
      setCart((prev) => {
        if (!prev?.items) return prev;
        return {
          ...prev,
          items: prev.items.map((it) => (it.sku === sku ? { ...it, quantity: newQuantity } : it)),
        };
      });

      // Дебаунс по SKU
      const prevTimer = qtyTimersRef.current.get(sku);
      if (prevTimer) clearTimeout(prevTimer);

      const timerId = setTimeout(async () => {
        try {
          const response = await cartAPI.updateCartItemQuantity(sku, newQuantity);
          await normalizeAndSetCart(response?.cart || null);
          setError(null);
        } catch (err) {
          // откатимся к серверной версии
          await fetchCart();
          setError(err?.message || 'Ошибка обновления количества');
        } finally {
          qtyTimersRef.current.delete(sku);
        }
      }, UPDATE_DEBOUNCE_MS);

      qtyTimersRef.current.set(sku, timerId);
    },
    [removeFromCart, normalizeAndSetCart, fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart(null);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Ошибка очистки корзины');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyPromo = useCallback(
    async (code) => {
      try {
        setLoading(true);
        const response = await cartAPI.applyPromoCode(code);
        await normalizeAndSetCart(response?.cart || null);
        setError(null);
        return response;
      } catch (err) {
        setError(err?.message || 'Ошибка применения промокода');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [normalizeAndSetCart]
  );

  const removePromo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.removePromoCode();
      await normalizeAndSetCart(response?.cart || null);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.message || 'Ошибка удаления промокода');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [normalizeAndSetCart]);

  const checkout = useCallback(async (orderData) => {
    try {
      setLoading(true);
      const response = await cartAPI.checkout(orderData);
      setCart(null);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.message || 'Ошибка оформления заказа');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ====================

  const itemsCount = cart?.items_count || 0;
  const items = cart?.items || [];
  const totals = cart?.totals || {};
  const flags = cart?.flags || {};
  const recommendations = cart?.recommendations || [];

  const availableItems = items.filter((item) => item.available);
  const unavailableItems = items.filter((item) => !item.available);

  const value = {
    cart,
    loading,
    error,

    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo,
    checkout,
    refreshCart: fetchCart,

    itemsCount,
    items,
    availableItems,
    unavailableItems,
    totals,
    flags,
    recommendations,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
}