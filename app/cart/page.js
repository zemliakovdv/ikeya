'use client';

import { useCart } from '/contexts/CartContext';
import CartPage from '/components/cart/CartPage';
import PageLoader from '@/components/ui/PageLoader';

export default function Cart() {
  const { loading } = useCart();

if (loading) return <PageLoader />;

  return <CartPage />;
}
