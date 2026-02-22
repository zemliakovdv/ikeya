// app/profile/settings/page.js
'use client';

import ProfileLayout from '@/components/profile/ProfileLayout';
import PersonalSettings from '@/components/profile/PersonalSettings';

const breadcrumbs = [
  { label: 'Главная',             href: '/' },
  { label: 'Профиль',             href: '/profile' },
  { label: 'Персональные данные', href: null },
];

export default function SettingsPage() {
  return (
    <ProfileLayout breadcrumbs={breadcrumbs} mainClassName="persdata">
      <PersonalSettings />
    </ProfileLayout>
  );
}
