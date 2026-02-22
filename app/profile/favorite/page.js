// app/profile/favorites/page.js
'use client';

import ProfileLayout from '@/components/profile/ProfileLayout';
import Favorites from '@/components/profile/Favorites';

const breadcrumbs = [
  { label: 'Главная',   href: '/' },
  { label: 'Профиль',   href: '/profile' },
  { label: 'Избранное', href: null },
];

export default function FavoritesPage() {
  return (
    <ProfileLayout breadcrumbs={breadcrumbs} mainClassName="zakazi">
      <Favorites />
    </ProfileLayout>
  );
}
