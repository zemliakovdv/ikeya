// app/help/delivery/page.js
import HelpLayout from '@/components/help/HelpLayout';
import DeliveryContent from '@/components/help/delivery/DeliveryContent';

export default function DeliveryPage() {
  return (
    <HelpLayout breadcrumbs={[{ name: 'Доставка', href: null }]}>
      <DeliveryContent />
    </HelpLayout>
  );
}