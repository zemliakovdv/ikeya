// contexts/FavoritesContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, removeFavorite as apiRemoveFavorite } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

const FavoritesContext = createContext({ count: 0, items: [], remove: () => {}, reload: () => {} });

export function FavoritesProvider({ children }) {
  const { isAuth, isHydrated } = useAuth();
  const [items, setItems] = useState([]);

  async function load() {
    try {
      const data = await getFavorites();
      setItems(data.favorites ?? data);
    } catch (e) {
      console.error('FavoritesContext: ошибка загрузки', e);
    }
  }

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuth) {
      setItems([]);
      return;
    }
    load();
  }, [isAuth, isHydrated]);

  async function remove(productId) {
    await apiRemoveFavorite(productId);
    setItems(prev => prev.filter(p => p.id !== productId));
  }

  return (
    <FavoritesContext.Provider value={{ count: items.length, items, remove, reload: load }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
