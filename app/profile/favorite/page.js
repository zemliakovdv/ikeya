// app/profile/favorite/page.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import Breadcrumbs from '@/components/profile/Breadcrumbs';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import GuestFavoriteSidebar from '@/components/profile/GuestFavoriteSidebar';
import Favorites from '@/components/profile/Favorites';

export default function FavoritesPage() {
  const { isAuth, isHydrated } = useAuth();
  const { openLogin } = useAuthModals();

  const breadcrumbs = [
    {
      label: 'Профиль',
      href: isAuth ? '/profile' : null,
      onClick: !isAuth ? (e) => { e.preventDefault(); openLogin(); } : null,
    },
    { label: 'Избранное', href: null },
  ];

  return (
    <main className="zakazi favorite-profile">
      <Breadcrumbs items={breadcrumbs} />

      <section className="orders-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page">
                <div className="profile-layout">
                  {isHydrated && (
                    isAuth ? (
                      <ProfileSidebar />
                    ) : (
                      <GuestFavoriteSidebar />
                    )
                  )}
                  <div className="profile-content">
                    <Favorites />
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
