import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileDashboard from '@/components/profile/ProfileDashboard';

export default function ProfilePage() {
  const breadcrumbs = [
    { label: 'Профиль', href: null }
  ];

  return (
    <ProfileLayout breadcrumbs={breadcrumbs}>
      <ProfileDashboard />
    </ProfileLayout>
  );
}
