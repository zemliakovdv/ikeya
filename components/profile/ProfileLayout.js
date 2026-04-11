// components/profile/ProfileLayout.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from './Breadcrumbs';
import ProfileSidebar from './ProfileSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';

export default function ProfileLayout({ children, breadcrumbs, mainClassName = 'zakazi' }) {
  const { isAuth, isHydrated } = useAuth();
  const { openLogin } = useAuthModals();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuth) {
      openLogin();
      router.replace('/');
    }
  }, [isHydrated, isAuth]);

  // Пока не прошла гидрация — ничего не рендерим (избегаем flash контента)
  if (!isHydrated || !isAuth) return null;

  return (
    <main className={mainClassName}>
      <Breadcrumbs items={breadcrumbs} />

      <section className="orders-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page">
                <div className="profile-layout">
                  <ProfileSidebar />
                  <div className="profile-content">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}