// app/profile/electronic-receipts/page.js
'use client';

import { useState, useEffect } from 'react';
import ProfileLayout from '@/components/profile/ProfileLayout';
import Receipts from '@/components/profile/Receipts';
import { getReceipts } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

const breadcrumbs = [
  { label: 'Профиль', href: '/profile' },
  { label: 'Электронные чеки', href: null },
];

export default function ElectronicReceiptsPage() {
  const { isAuth, isHydrated } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!isHydrated || !isAuth) return;

    async function load() {
      try {
        const resp = await getReceipts();
        setReceipts(resp.receipts || []);
      } catch (e) {
        setError(e.message || 'Не удалось загрузить чеки');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isHydrated, isAuth]);

  return (
    <ProfileLayout breadcrumbs={breadcrumbs}>
      {loading ? (
        <div className="orders-loading">Загружаем чеки…</div>
      ) : error ? (
        <p style={{ color: 'crimson' }}>{error}</p>
      ) : (
        <Receipts receipts={receipts} />
      )}
    </ProfileLayout>
  );
}
