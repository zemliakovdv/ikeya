// app/help/payment/page.js
import HelpLayout from '@/components/help/HelpLayout';
import PaymentContent from '@/components/help/payment/PaymentContent';

export default function PaymentPage() {
  return (
    <HelpLayout breadcrumbs={[{ name: 'Способ оплаты', href: null }]}>
      <PaymentContent />
    </HelpLayout>
  );
}