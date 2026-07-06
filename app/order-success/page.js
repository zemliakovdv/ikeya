import { Suspense } from 'react';
import OrderSuccessPage from '@/components/order/OrderSuccessPage';

export default function OrderSuccess() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessPage />
    </Suspense>
  );
}
