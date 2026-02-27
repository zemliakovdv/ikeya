'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, addFavorite, removeFavorite as apiRemoveFavorite } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'guest_favorites';

const FavoritesContext = createContext({ count: 0, items: [], loading: true, add: () => {}, remove: () => {}, isFavorite: () => false, reload: () => {} });

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

      // Синхронизируем гостевые товары при логине
      const guestItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (guestItems.length > 0) {
        await Promise.all(guestItems.map(p => addFavorite(p.id).catch(() => {})));
        localStorage.removeItem(STORAGE_KEY);
      }

      const data = await getFavorites();
      setItems(data.favorites ?? data);
    } catch (e) {
      console.error('FavoritesContext: ошибка загрузки', e);
    } finally {
      setLoading(false);
    }
  }

  async function add(product) {
    if (isAuth) {
      await addFavorite(product.id);
      setItems(prev => [...prev, product]);
    } else {
      setItems(prev => {
        const updated = [...prev, product];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }

  async function remove(productId) {
    if (isAuth) {
      await apiRemoveFavorite(productId);
    } else {
      setItems(prev => {
        const updated = prev.filter(p => p.id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
    setItems(prev => prev.filter(p => p.id !== productId));
  }

  function isFavorite(productId) {
    return items.some(p => p.id === productId);
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
