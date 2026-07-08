// components/cart/CartRecommendations.js
import { Suspense } from 'react';
import CartRecommendationsClient from '@/components/cart/CartRecommendationsClient';

export default function CartRecommendations() {
  return (
    <Suspense fallback={null}>
      <CartRecommendationsClient />
    </Suspense>
  );
}
