import ProfileLayout from '@/components/profile/ProfileLayout';
import PersonalData from '@/components/profile/PersonalData';

export default function PersonalDataPage() {
  const breadcrumbs = [
    { label: 'Профиль', href: '/profile' },
    { label: 'Личные данные', href: null }
  ];

  return (
    <ProfileLayout breadcrumbs={breadcrumbs} mainClassName="zakazi personal-data-profile">
      <PersonalData />
    </ProfileLayout>
  );
}
