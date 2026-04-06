'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as cartAPI from '@/lib/api/cart';
import { getProductBySku, getRecommendedProducts } from '@/lib/api/ikea';
import { getCartToken } from '@/lib/api/cart';
import { useAuth } from '@/contexts/AuthContext';

const CartContext = createContext();

// Сохраняет порядок items из prevCart после ответа сервера
function mergeWithOrder(prevItems = [], nextItems = []) {
  const prevOrder = prevItems.map(it => it.sku);
  const nextMap = new Map(nextItems.map(it => [it.sku, it]));
  const sorted = prevOrder.map(sku => nextMap.get(sku)).filter(Boolean);
  const added = nextItems.filter(it => !prevOrder.includes(it.sku));
  return [...sorted, ...added];
}

export function CartProvider({ children }) {
  const { isHydrated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const updateTimeoutId = useRef(null);

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
              // Название: берём small_desc_name как заголовок, name_ru как подзаголовок
              name: attrs.small_desc_name || attrs.name_ru || item.product?.name,
              name_ru: attrs.name_ru || item.product?.name_ru || item.product?.name,
              small_desc_name: attrs.small_desc_name || item.product?.small_desc_name,
              collection: attrs.collection || item.product?.collection,
              // Цена: берём из product API, она актуальная
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
    return { ...cartObj, items: enrichedItems };
  }, []);

  const fetchCart = useCallback(async () => {
    console.log('fetchCart called, isHydrated:', isHydrated);
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      let nextCart = response.cart ? await enrichCartItems(response.cart) : null;
      try {
        const recsData = await getRecommendedProducts({ page: 1, per_page: 10 });
        const recs = (recsData.data || []).map((item) => {
          const attr = item.attributes || {};
          const images = (attr.local_images || []).map((img) => {
            const clean = img.startsWith('/') ? img.slice(1) : img;
            return `http://45.135.234.22/${clean}`;
          });
          const fallback = '/assets/img/no-image.jpg';
          return {
            id:          item.id,
            sku:         attr.sku,
            title:       attr.small_desc_name || attr.name_ru || '',
            description: attr.name_ru || '',
            price:       parseFloat(attr.price_byn || attr.price || 0),
            images:      images.length ? images : [fallback],
            thumbs:      images.length ? images : [fallback],
            isHit:       attr.is_bestseller || false,
            promoCode:   attr.promo?.code || null,
          };
        });
        nextCart = nextCart
          ? { ...nextCart, recommendations: recs }
          : { recommendations: recs };
      } catch {}
      setCart(nextCart);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [enrichCartItems]);

  // Загружаем корзину при маунте — ждём пока AuthContext восстановит токен из localStorage
  useEffect(() => { if (isHydrated) fetchCart(); }, [fetchCart, isHydrated]);

  // ✅ Логин: ждём auth-change-done — диспатчится из AuthModalsHost
  // ПОСЛЕ того как гостевые товары перенесены в авторизованную корзину
  useEffect(() => {
    function onAuthDone() { fetchCart(); }
    window.addEventListener('auth-change-done', onAuthDone);
    return () => window.removeEventListener('auth-change-done', onAuthDone);
  }, [fetchCart]);

  // ✅ Логаут: слушаем auth-logout — перенос товаров не нужен, сразу обновляем
  useEffect(() => {
    function onLogout() { fetchCart(); }
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
    if (newQuantity === 0) return removeFromCart(sku);

    // Оптимистичное обновление
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: (prev.items || []).map(it =>
          it.sku === sku ? { ...it, quantity: newQuantity } : it
        ),
      };
    });

    if (updateTimeoutId.current) clearTimeout(updateTimeoutId.current);

    updateTimeoutId.current = setTimeout(async () => {
      try {
        const response = await cartAPI.updateCartItemQuantity(sku, newQuantity);
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;
        setCart((prev) => ({
          ...nextCart,
          recommendations: prev?.recommendations || [],
          // ← сохраняем порядок
          items: mergeWithOrder(prev?.items, nextCart?.items),
        }));
        setError(null);
      } catch (err) {
        await fetchCart();
        setError(err.message);
      }
    }, 400);
  }, [enrichCartItems, fetchCart, removeFromCart]);

  const mergeGuestCart = useCallback(async (guestItems) => {
    if (!guestItems?.length) return;
    console.log('🔄 mergeGuestCart start', guestItems);
    for (const item of guestItems) {
      try {
        console.log('➕ adding', item.sku);
        const response = await cartAPI.addToCart(item.sku, item.quantity);
        console.log('✅ added', item.sku, response?.cart?.items_count);
        const nextCart = response.cart ? await enrichCartItems(response.cart) : null;
        if (nextCart) {
          setCart((prev) => ({
            ...nextCart,
            recommendations: prev?.recommendations || [],
            items: mergeWithOrder(prev?.items, nextCart?.items),
          }));
        }
      } catch (err) {
        console.error(`Ошибка переноса товара ${item.sku}:`, err.message);
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
  const flags = cart?.flags || {};
  const recommendations = cart?.recommendations || [];
  const availableItems = items.filter(it => it.available);
  const unavailableItems = items.filter(it => !it.available);

  return (
    <CartContext.Provider value={{
      cart, loading, error,
      addToCart, removeFromCart, removeManyFromCart,
      updateQuantity, clearCart, applyPromo, removePromo,
      checkout, refreshCart: fetchCart, mergeGuestCart,
      itemsCount, items, availableItems, unavailableItems,
      totals, flags, recommendations,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart должен использоваться внутри CartProvider');
  return ctx;
}