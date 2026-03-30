// components/cart/CartRecommendations.js
import { Suspense } from 'react';
import NotFoundRecommendations from '@/components/recommendations/NotFoundRecommendations';

export default function CartRecommendations() {
  return (
    <Suspense fallback={null}>
      <NotFoundRecommendations />
    </Suspense>
  );
}