'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, addFavorite, removeFavorite as apiRemoveFavorite } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'guest_favorites';

const FavoritesContext = createContext({
  count: 0, items: [], loading: true,
  add: () => {}, remove: () => {}, isFavorite: () => false, reload: () => {},
});

export function FavoritesProvider({ children }) {
  const { isAuth, isHydrated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuth) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setItems(stored);
      setLoading(false);
      return;
    }
    load();
  }, [isAuth, isHydrated]);

  async function load() {
    try {
      setLoading(true);
      const data = await getFavorites();
      // API: { favorite: { token, items_count, items: [{ sku, added_at, product: {...} }] } }
      setItems(data?.favorite?.items ?? []);
    } catch (e) {
      console.error('FavoritesContext: ошибка загрузки', e);
    } finally {
      setLoading(false);
    }
  }

  async function add(sku) {
    if (isAuth) {
      await addFavorite(sku);
      await load();
    } else {
      setItems(prev => {
        const updated = [...prev, { sku }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

async function remove(sku) {
  // Сразу убираем из стейта оптимистично
  setItems(prev => {
    const updated = prev.filter(p => p.sku !== sku);
    if (!isAuth) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  });

  if (isAuth) {
    try {
      await apiRemoveFavorite(sku);
    } catch (e) {
      // 404 — товар уже не существует на сервере, просто игнорируем
      if (e.status !== 404) {
        console.error('Ошибка удаления из избранного', e);
        // откатываем только если реальная ошибка
        await load();
      }
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
