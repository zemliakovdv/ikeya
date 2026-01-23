import ProfileLayout from '@/components/profile/ProfileLayout';
import Orders from '@/components/profile/Orders';

export default function OrdersPage() {
  const breadcrumbs = [
    { label: 'Профиль', href: '/profile' },
    { label: 'Заказы', href: null }
  ];

  return (
    <ProfileLayout breadcrumbs={breadcrumbs}>
      <Orders />
    </ProfileLayout>
  );
}
