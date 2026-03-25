// app/profile/favorite/page.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Breadcrumbs from '@/components/profile/Breadcrumbs';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import GuestFavoriteSidebar from '@/components/profile/GuestFavoriteSidebar';
import Favorites from '@/components/profile/Favorites';
import RecommendationsSection from '@/components/recommendations/RecommendationsSection';

const breadcrumbs = [
  { label: 'Профиль', href: '/profile' },
  { label: 'Избранное', href: null },
];

export default function FavoritesPage() {
  const { isAuth, isHydrated } = useAuth();
  const { recommendations } = useCart();

  return (
    <main className="zakazi">
      <Breadcrumbs items={breadcrumbs} />

      <section className="orders-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page">
                <div className="profile-layout">
                  {isHydrated && (isAuth ? <ProfileSidebar /> : <GuestFavoriteSidebar />)}
                  <div className="profile-content">
                    <Favorites />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isHydrated && !isAuth && (
        <RecommendationsSection products={recommendations || []} />
      )}
    </main>
  );
}