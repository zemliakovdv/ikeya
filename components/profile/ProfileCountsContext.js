'use client';

// components/profile/ProfileCountsContext.js
// Контекст счётчиков профиля. Сам грузит заказы и считает активные,
// поэтому бейдж в сайдбаре работает на всех страницах профиля,
// а не только там, где смонтирован ProfileDashboard.

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders, isProfileActiveOrder } from '@/lib/api/account';

const ProfileCountsContext = createContext(null);

export function ProfileCountsProvider({ children }) {
  const { isAuth, isHydrated } = useAuth();
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;

    let cancelled = false;

    getOrders({ per_page: 50 })
      .then((resp) => {
        if (cancelled) return;
        const orders = resp?.data || [];
        const activeCount = orders.filter(isProfileActiveOrder).length;
        setActiveOrdersCount(activeCount);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('ProfileCounts: не удалось загрузить заказы', error?.message || error);
        setActiveOrdersCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, isAuth]);

  const value = useMemo(
    () => ({ activeOrdersCount, setActiveOrdersCount }),
    [activeOrdersCount]
  );

  return (
    <ProfileCountsContext.Provider value={value}>
      {children}
    </ProfileCountsContext.Provider>
  );
}

export function useProfileCounts() {
  const ctx = useContext(ProfileCountsContext);
  if (!ctx) throw new Error('useProfileCounts must be used inside <ProfileCountsProvider>');
  return ctx;
}
