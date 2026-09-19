import { Suspense } from 'react';
import PaymentCancelPage from '@/components/order/PaymentCancelPage';

export const metadata = {
  title: 'Оплата не завершена | IKEYA',
  robots: { index: false, follow: false },
};

export default function PaymentCancel() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelPage />
    </Suspense>
  );
}
