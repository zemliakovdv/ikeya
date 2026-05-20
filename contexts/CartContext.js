'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as cartAPI from '@/lib/api/cart';
import { getProductBySku, getRecommendedProducts, resolveImageUrl } from '@/lib/api/ikea';
import { useAuth } from '@/contexts/AuthContext';

const CartContext = createContext();

function mergeWithOrder(prevItems = [], nextItems = []) {
  const prevOrder = prevItems.map((item) => item.sku);
  const nextMap = new Map(nextItems.map((item) => [item.sku, item]));
  const sorted = prevOrder.map((sku) => nextMap.get(sku)).filter(Boolean);
  const added = nextItems.filter((item) => !prevOrder.includes(item.sku));

  return [...sorted, ...added];
}

export function CartProvider({ children }) {
  const { isHydrated } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateTimeoutsRef = useRef(new Map());

  useEffect(() => {
    return () => {
      updateTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      updateTimeoutsRef.current.clear();
    };
  }, []);

  const enrichCartItems = useCallback(async (cartObj) => {
    if (!cartObj?.items?.length) return cartObj;

    const enrichedItems = await Promise.all(
      cartObj.items.map(async (item) => {
        try {
          const productData = await getProductBySku(item.sku);
          const attrs = productData?.data?.attributes || {};

          return {
            ...item,
            product: {
              ...item.product,
              name: attrs.small_desc_name || attrs.name_ru || item.product?.name,
              name_ru: attrs.name_ru || item.product?.name_ru || item.product?.name,
              small_desc_name: attrs.small_desc_name || item.product?.small_desc_name,
              slug: attrs.slug || item.product?.slug,
              collection: attrs.collection || item.product?.collection,
              price_byn: String(attrs.price_byn || item.product?.price_byn || 0).replace(/\s/g, ''),
              price: attrs.price || item.product?.price,
              local_images:
                attrs.local_images ??
                item.product?.local_images ??
                item.product?.images?.local_images,
              images:
                item.product?.images ??
                item.product?.images?.images,
            },
            customs_duty: attrs.customs_duty || null,
            weight: attrs.weight || item.weight || null,
          };
        } catch {
          return item;
        }
      })
    );

    return {
      ...cartObj,
      items: enrichedItems,
    };
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const response = await cartAPI.getCart();
      let nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      try {
        const recsData = await getRecommendedProducts({ page: 1, per_page: 10 });

        const recs = (recsData.data || []).map((item) => {
          const attr = item.attributes || {};
          const images = (attr.local_images || [])
            .map((img) => resolveImageUrl(img))
            .filter(Boolean);

          const fallback = '/assets/img/no-image.jpg';

          return {
            id: item.id,
            sku: attr.sku,
            title: attr.small_desc_name || attr.name_ru || '',
            description: attr.name_ru || '',
            price: Number.parseFloat(attr.price_byn || attr.price || 0),
            images: images.length ? images : [fallback],
            thumbs: images.length ? images : [fallback],
            isHit: attr.is_bestseller || false,
            promoCode: attr.promo?.code || null,
          };
        });

        nextCart = nextCart
          ? { ...nextCart, recommendations: recs }
          : { recommendations: recs };
      } catch {
        // Рекомендации не должны ломать корзину.
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
    if (isHydrated) fetchCart();
  }, [fetchCart, isHydrated]);

  useEffect(() => {
    function onAuthDone() {
      fetchCart();
    }

    window.addEventListener('auth-change-done', onAuthDone);

    return () => window.removeEventListener('auth-change-done', onAuthDone);
  }, [fetchCart]);

  useEffect(() => {
    function onLogout() {
      fetchCart();
    }

    window.addEventListener('auth-logout', onLogout);

    return () => window.removeEventListener('auth-logout', onLogout);
  }, [fetchCart]);

  const addToCart = useCallback(async (sku, quantity = 1) => {
    try {
      setLoading(true);

      const response = await cartAPI.addToCart(sku, quantity);
      const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      setCart((prev) => ({
        ...nextCart,
        recommendations: prev?.recommendations || [],
        items: mergeWithOrder(prev?.items, nextCart?.items),
      }));

      setError(null);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enrichCartItems]);

  const removeFromCart = useCallback(async (sku) => {
    try {
      setLoading(true);

      const response = await cartAPI.removeFromCart(sku);
      const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      setCart((prev) => ({
        ...nextCart,
        recommendations: prev?.recommendations || [],
        items: mergeWithOrder(prev?.items, nextCart?.items),
      }));

      setError(null);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enrichCartItems]);

  const removeManyFromCart = useCallback(async ({ skus = [], delete_all = false } = {}) => {
    try {
      setLoading(true);

      const response = await cartAPI.removeManyFromCart({ skus, delete_all });
      const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      setCart((prev) => ({
        ...nextCart,
        recommendations: prev?.recommendations || [],
      }));

      setError(null);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enrichCartItems]);

  const updateQuantity = useCallback(async (sku, newQuantity) => {
    if (newQuantity === 0) {
      return removeFromCart(sku);
    }

    setCart((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        items: (prev.items || []).map((item) =>
          item.sku === sku ? { ...item, quantity: newQuantity } : item
        ),
      };
    });

    const currentTimeout = updateTimeoutsRef.current.get(sku);

    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await cartAPI.updateCartItemQuantity(sku, newQuantity);
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

        setCart((prev) => ({
          ...nextCart,
          recommendations: prev?.recommendations || [],
          items: mergeWithOrder(prev?.items, nextCart?.items),
        }));

        setError(null);
      } catch (err) {
        await fetchCart();
        setError(err.message);
      } finally {
        updateTimeoutsRef.current.delete(sku);
      }
    }, 400);

    updateTimeoutsRef.current.set(sku, timeoutId);

    return undefined;
  }, [enrichCartItems, fetchCart, removeFromCart]);

  const mergeGuestCart = useCallback(async (guestItems) => {
    if (!guestItems?.length) return;

    for (const item of guestItems) {
      try {
        const response = await cartAPI.addToCart(item.sku, item.quantity);
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

        if (nextCart) {
          setCart((prev) => ({
            ...nextCart,
            recommendations: prev?.recommendations || [],
            items: mergeWithOrder(prev?.items, nextCart?.items),
          }));
        }
      } catch {
        // Ошибка одного товара не должна останавливать перенос остальных.
      }
    }
  }, [enrichCartItems]);

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

  const applyPromo = useCallback(async (code) => {
    try {
      setLoading(true);

      const response = await cartAPI.applyPromoCode(code);
      const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      setCart((prev) => ({
        ...nextCart,
        recommendations: prev?.recommendations || [],
        items: mergeWithOrder(prev?.items, nextCart?.items),
      }));

      setError(null);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enrichCartItems]);

  const removePromo = useCallback(async () => {
    try {
      setLoading(true);

      const response = await cartAPI.removePromoCode();
      const nextCart = response.cart ? await enrichCartItems(response.cart) : null;

      setCart((prev) => ({
        ...nextCart,
        recommendations: prev?.recommendations || [],
        items: mergeWithOrder(prev?.items, nextCart?.items),
      }));

      setError(null);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enrichCartItems]);

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

  const itemsCount = cart?.items_count || 0;
  const items = cart?.items || [];
  const totals = cart?.totals || {};
  const delivery = cart?.delivery || {};
  const flags = cart?.flags || {};
  const recommendations = cart?.recommendations || [];
  const availableItems = items.filter((item) => item.available);
  const unavailableItems = items.filter((item) => !item.available);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        removeManyFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
        checkout,
        refreshCart: fetchCart,
        mergeGuestCart,
        itemsCount,
        items,
        availableItems,
        unavailableItems,
        totals,
        delivery,
        flags,
        recommendations,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }

  return ctx;
}