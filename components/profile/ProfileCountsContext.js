'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const ProfileCountsContext = createContext(null);

export function ProfileCountsProvider({ children }) {
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

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

