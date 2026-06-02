// app/profile/orders/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileLayout from '@/components/profile/ProfileLayout';
import Orders from '@/components/profile/Orders';
import { useAuth } from '@/contexts/AuthContext';

const breadcrumbs = [
  { label: 'Профиль', href: '/profile' },
  { label: 'Заказы', href: null },
];

export default function OrdersPage() {
  const { isAuth, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuth) router.push('/');
  }, [isAuth, isHydrated, router]);

  if (!isHydrated || !isAuth) return null;

  return (
    <ProfileLayout breadcrumbs={breadcrumbs}>
      <Orders />
    </ProfileLayout>
  );
}