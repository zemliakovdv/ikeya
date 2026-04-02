'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getFavorites, addFavorite, removeFavorite as apiRemoveFavorite } from '@/lib/api/account';
import { getProductBySku } from '@/lib/api/ikea';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'guest_favorites';
const API_BASE_URL = 'http://45.135.234.22';

const FavoritesContext = createContext({
  count: 0, items: [], loading: true,
  add: () => {}, remove: () => {}, isFavorite: () => false, reload: () => {},
});

async function fetchProductBySku(sku) {
  try {
    const data = await getProductBySku(sku);
    const attr = data?.data?.attributes || {};
    return {
      sku: attr.sku || sku,
      small_desc_name: attr.small_desc_name || '',
      name_ru: attr.name_ru || attr.name || 'Товар',
      price_byn: attr.price_byn || attr.price || '0',
      collection: attr.collection || '',
      local_images: attr.local_images,
      images: { local_images: attr.local_images },
      is_bestseller: attr.is_bestseller,
    };
  } catch {
    return null;
  }
}

export function FavoritesProvider({ children }) {
  const { isAuth, isHydrated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevIsAuth = useRef(null);

  // Основной эффект — загрузка при смене состояния авторизации
  useEffect(() => {
    if (!isHydrated) return;

    const prev = prevIsAuth.current;
    const curr = isAuth;

    // Переход: гость → авторизован
    if (prev === false && curr === true) {
      mergeGuestToApi().then(() => {
        prevIsAuth.current = curr;
      });
      return;
    }

    // Переход: авторизован → гость
    if (prev === true && curr === false) {
      saveCurrentToGuest();
      prevIsAuth.current = curr;
      loadGuestFavorites();
      return;
    }

    // Первая загрузка
    prevIsAuth.current = curr;
    if (curr) {
      load();
    } else {
      loadGuestFavorites();
    }
  }, [isAuth, isHydrated]);

  // Загрузка избранного авторизованного пользователя
  async function load() {
    try {
      setLoading(true);
      const data = await getFavorites();
      const rawItems = data?.favorite?.items ?? [];
      const enriched = await Promise.all(
        rawItems.map(async (item) => {
          const sku = item.sku || item.product?.sku;
          const product = await fetchProductBySku(sku);
          return { sku, product: product || item.product };
        })
      );
      setItems(enriched);
    } catch (e) {
      console.error('FavoritesContext: ошибка загрузки', e);
    } finally {
      setLoading(false);
    }
  }

  // Загрузка гостевого избранного из localStorage
  async function loadGuestFavorites() {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!stored.length) { setItems([]); return; }
      const enriched = await Promise.all(
        stored.map(async ({ sku }) => {
          const product = await fetchProductBySku(sku);
          return { sku, product };
        })
      );
      setItems(enriched);
    } catch (e) {
      console.error('FavoritesContext: ошибка загрузки гостевых избранных', e);
    } finally {
      setLoading(false);
    }
  }

  // При авторизации: переносим гостевые избранные в API
  async function mergeGuestToApi() {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (stored.length > 0) {
        // Добавляем все гостевые SKU в API параллельно
        await Promise.allSettled(
          stored.map(({ sku }) => addFavorite(sku))
        );
        // Чистим localStorage
        localStorage.removeItem(STORAGE_KEY);
      }
      // Загружаем актуальное избранное с сервера
      await load();
    } catch (e) {
      console.error('FavoritesContext: ошибка merge гостевых избранных', e);
      await load();
    }
  }

  // При выходе: сохраняем текущие избранные в localStorage
  function saveCurrentToGuest() {
    try {
      const skus = items
        .map(item => ({ sku: item.sku || item.product?.sku }))
        .filter(({ sku }) => sku);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skus));
    } catch (e) {
      console.error('FavoritesContext: ошибка сохранения в localStorage', e);
    }
  }

  async function add(sku) {
    if (isAuth) {
      await addFavorite(sku);
      await load();
    } else {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (stored.some(p => p.sku === sku)) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, { sku }]));
      const product = await fetchProductBySku(sku);
      setItems(prev => [...prev, { sku, product }]);
    }
  }

  async function remove(sku) {
    setItems(prev => {
      const updated = prev.filter(p => p.sku !== sku);
      if (!isAuth) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.map(p => ({ sku: p.sku }))));
      return updated;
    });
    if (isAuth) {
      try {
        await apiRemoveFavorite(sku);
      } catch (e) {
        if (e.status !== 404) { await load(); }
      }
    }
  }

  function isFavorite(sku) {
    return items.some(p => p.sku === sku);
  }

  return (
    <FavoritesContext.Provider value={{ count: items.length, items, loading, add, remove, isFavorite, reload: load }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}