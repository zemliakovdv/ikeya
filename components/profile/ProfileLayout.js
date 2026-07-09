// components/profile/ProfileLayout.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from './Breadcrumbs';
import ProfileSidebar from './ProfileSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import { getProfile } from '@/lib/api/account';

export default function ProfileLayout({ children, breadcrumbs, mainClassName = 'zakazi' }) {
  const { isAuth, isHydrated, user, setUser } = useAuth();
  const { openLogin } = useAuthModals();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuth) {
      openLogin();
      router.replace('/');
    }
  }, [isHydrated, isAuth]);

  // Загружаем first_name из профиля один раз — если его ещё нет в контексте
  useEffect(() => {
    if (!isHydrated || !isAuth || user?.first_name || user?.username) return;
    getProfile()
      .then(data => {
        const profileName = data?.first_name || data?.username;
        if (profileName) {
          setUser({
            ...user,
            first_name: data?.first_name || user?.first_name,
            username: data?.username || user?.username || profileName,
          });
        }
      })
      .catch(() => {});
  }, [isHydrated, isAuth, user, setUser]);

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
