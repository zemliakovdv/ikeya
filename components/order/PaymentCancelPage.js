'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('order_id');

    if (orderId) {
      router.replace(`/order-success/?order_id=${encodeURIComponent(orderId)}&payment=failed`);
      return;
    }

    router.replace('/profile/orders/?payment=failed');
  }, [router, searchParams]);

  return (
    <main className="orders-statused">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="order-success-page">
              <div className="success-header">
                <h1 className="success-title">Оплата не завершена</h1>
              </div>
              <p style={{ textAlign: 'center', color: '#616161' }}>
                Возвращаем к заказу, чтобы можно было оплатить ещё раз.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
