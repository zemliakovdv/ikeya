'use client';

import { useCart } from '@/contexts/CartContext';
import CartPage from '@/components/cart/CartPage';

export default function Cart() {
  const { loading } = useCart();

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p>Загрузка корзины...</p>
      </div>
    );
  }

  return <CartPage />;
}
