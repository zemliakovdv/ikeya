import { Suspense } from 'react';
import NotFoundRecommendations from '@/components/recommendations/NotFoundRecommendations';
import ProductNotFoundContent from '@/components/product/ProductNotFoundContent';

export default function ProductNotFound() {
  return (
    <main className="not-found">
      <ProductNotFoundContent />

      <Suspense fallback={null}>
        <NotFoundRecommendations />
      </Suspense>
    </main>
  );
}
