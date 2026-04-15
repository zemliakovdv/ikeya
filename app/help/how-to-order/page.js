// app/help/how-to-order/page.js
import HelpLayout from '@/components/help/HelpLayout';
import HowToOrderContent from '@/components/help/how-to-order/HowToOrderContent';

export default function HowToOrderPage() {
  return (
    <HelpLayout breadcrumbs={[{ name: 'Как сделать заказ', href: null }]}>
      <HowToOrderContent />
    </HelpLayout>
  );
}