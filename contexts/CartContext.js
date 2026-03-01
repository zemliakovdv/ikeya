'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as cartAPI from '@/lib/api/cart';
import { getProductBySku, getPopularProducts } from '@/lib/api/ikea';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateTimeoutId = useRef(null);

  // --- единый энрич ---
  const enrichCartItems = useCallback(async (cartObj) => {
    if (!cartObj?.items?.length) return cartObj;

    const enrichedItems = await Promise.all(
      cartObj.items.map(async (item) => {
        try {
          const productData = await getProductBySku(item.sku);
          const attrs = productData?.data?.attributes || {};

          // API корзины: product.images = { local_images:[], images:[] }
          // мы кладём в product.local_images / product.images, как у тебя в CartItem
          const imagesObj = attrs.images || attrs.images === '' ? attrs.images : null;

          return {
            ...item,
            product: {
              ...item.product,
              name_ru: attrs.name_ru || item.product?.name_ru || item.product?.name,
              collection: attrs.collection || item.product?.collection,

              // важное: CartItem читает product.local_images
              local_images:
                attrs.local_images ??
                imagesObj?.local_images ??
                item.product?.local_images ??
                item.product?.images?.local_images,

              // если где-то понадобится, оставляем
              images:
                imagesObj?.images ??
                item.product?.images ??
                item.product?.images?.images,
            },
          };
        } catch (e) {
          console.error(`Не удалось загрузить данные для SKU ${item.sku}`);
          return item;
        }
      })
    );

    return { ...cartObj, items: enrichedItems };
  }, []);

  // ==================== ЗАГРУЗКА КОРЗИНЫ ====================

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const response = await cartAPI.getCart();
      let nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      // ← Грузим популярные товары всегда, независимо от состояния корзины
      try {
        const popularData = await getPopularProducts({ page: 1, per_page: 10 });
        const recs = popularData.data || [];
        if (nextCart) {
          nextCart = { ...nextCart, recommendations: recs };
        } else {
          // корзина пустая — храним рекомендации отдельно
          nextCart = { recommendations: recs };
        }
      } catch (e) {
        console.error('Не удалось загрузить популярные товары');
      }

      setCart(nextCart);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [enrichCartItems]);


  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ==================== ОПЕРАЦИИ С КОРЗИНОЙ ====================

const addToCart = useCallback(
  async (sku, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart(sku, quantity);
      const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      setCart((prevCart) => ({
        ...nextCart,
        recommendations: prevCart?.recommendations || nextCart?.recommendations || [],
      }));
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [enrichCartItems]
);

const removeFromCart = useCallback(
  async (sku) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(sku);
      const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      setCart((prevCart) => ({
        ...nextCart,
        recommendations: prevCart?.recommendations || nextCart?.recommendations || [],
      }));
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [enrichCartItems]
);

  // bulk удаление (для "удалить выбранные")
  const removeManyFromCart = useCallback(
    async ({ skus = [], delete_all = false } = {}) => {
      try {
        setLoading(true);
        const response = await cartAPI.removeManyFromCart({ skus, delete_all });
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

        setCart(nextCart);
        setError(null);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enrichCartItems]
  );

  /**
   * Изменить количество (PATCH)
   * оставляем оптимистичное обновление + debounce, но серверный вызов теперь лёгкий и правильный
   */
const updateQuantity = useCallback(
  async (sku, newQuantity) => {
    if (newQuantity === 0) return removeFromCart(sku);

    // оптимистично — сохраняем recommendations
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      return {
        ...prevCart,
        recommendations: prevCart.recommendations, // ← явно сохраняем
        items: (prevCart.items || []).map((it) =>
          it.sku === sku ? { ...it, quantity: newQuantity } : it
        ),
      };
    });

    if (updateTimeoutId.current) clearTimeout(updateTimeoutId.current);

    updateTimeoutId.current = setTimeout(async () => {
      try {
        const response = await cartAPI.updateCartItemQuantity(sku, newQuantity);
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

        // после ответа сервера тоже сохраняем recommendations
        setCart((prevCart) => ({
          ...nextCart,
          recommendations: prevCart?.recommendations || nextCart?.recommendations || [],
        }));

        setError(null);
      } catch (err) {
        await fetchCart();
        setError(err.message);
      }
    }, 400);
  },
  [enrichCartItems, fetchCart, removeFromCart]
);


  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyPromo = useCallback(
    async (code) => {
      try {
        setLoading(true);

        // Применяем промокод
        const response = await cartAPI.applyPromoCode(code);

        // API сразу возвращает обновлённую корзину — используем её
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

        setCart(nextCart);
        setError(null);

        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enrichCartItems]
  );


  const removePromo = useCallback(
    async () => {
      try {
        setLoading(true);
        const response = await cartAPI.removePromoCode();
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

        setCart(nextCart);
        setError(null);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enrichCartItems]
  );

  const checkout = useCallback(async (orderData) => {
    try {
      setLoading(true);
      const response = await cartAPI.checkout(orderData);
      setCart(null);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ВЫЧИСЛЯЕМЫЕ ====================

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
    removeManyFromCart, // ⬅️ новое
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
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart должен использоваться внутри CartProvider');
  return ctx;
}