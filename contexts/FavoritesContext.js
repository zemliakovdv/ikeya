'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getFavorites, addFavorite, removeFavorite as apiRemoveFavorite } from '@/lib/api/account';
import { getProductBySku } from '@/lib/api/ikea';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'guest_favorites';
// Сохраняем favorite_token в localStorage — он нужен в каждом запросе
const FAV_TOKEN_KEY = 'favorite_token';

const FavoritesContext = createContext({
  count: 0, items: [], loading: true,
  add: () => {}, remove: () => {}, isFavorite: () => false, reload: () => {},
});

// Получить сохранённый favorite_token
function getFavToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(FAV_TOKEN_KEY) || null;
}

// Сохранить favorite_token из ответа бэка
function saveFavToken(token) {
  if (typeof window === 'undefined' || !token) return;
  localStorage.setItem(FAV_TOKEN_KEY, token);
}

function removeFavToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAV_TOKEN_KEY);
}

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
      variants: attr.variants || null,
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

  useEffect(() => {
    if (!isHydrated) return;

    const prev = prevIsAuth.current;
    const curr = isAuth;

    // Переход: гость → авторизован
    if (prev === false && curr === true) {
      mergeGuestToApi().then(() => { prevIsAuth.current = curr; });
      return;
    }

    // Переход: авторизован → гость
    if (prev === true && curr === false) {
      removeFavToken();
      setItems([]);
      prevIsAuth.current = curr;
      loadGuestFavorites();
      return;
    }

    // Первая загрузка
    prevIsAuth.current = curr;
    if (curr) {
      load();
    } else {
      removeFavToken();
      loadGuestFavorites();
    }
  }, [isAuth, isHydrated]);

  // Загрузка избранного — сохраняем favorite_token из ответа
  async function load() {
    try {
      setLoading(true);
      setItems([]);
      const favToken = getFavToken();
      const data = await getFavorites(favToken);

      // Сохраняем актуальный токен из ответа
      if (data?.favorite?.token) saveFavToken(data.favorite.token);

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

  // Гостевое избранное — через localStorage
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

  // При авторизации: переносим гостевые SKU в API с favorite_token
  async function mergeGuestToApi() {
    setLoading(true);
    setItems([]);
    try {
      removeFavToken();
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      if (stored.length > 0) {
        const results = await Promise.allSettled(
          stored.map(({ sku }) => addFavorite(sku, null))
        );

        const failed = [];
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const token = result.value?.favorite?.token;
            if (token) saveFavToken(token);
          } else {
            failed.push(stored[index]);
          }
        });

        if (failed.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(failed));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      await load();
    } catch (e) {
      console.error('FavoritesContext: ошибка merge гостевых избранных', e);
      await load();
    }
  }


  async function add(sku) {
    if (isAuth) {
      const favToken = getFavToken();
      const data = await addFavorite(sku, favToken);
      // Обновляем токен если бэк вернул новый
      if (data?.favorite?.token) saveFavToken(data.favorite.token);
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
    // Оптимистично убираем из UI
    setItems(prev => {
      const updated = prev.filter(p => p.sku !== sku);
      if (!isAuth) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.map(p => ({ sku: p.sku }))));
      return updated;
    });
    if (isAuth) {
      try {
        const favToken = getFavToken();
        await apiRemoveFavorite(sku, favToken);
      } catch (e) {
        if (e.status !== 404) await load();
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
