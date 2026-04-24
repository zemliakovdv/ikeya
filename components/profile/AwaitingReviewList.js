'use client';

import AwaitingReviewItem from '@/components/profile/AwaitingReviewItem';

export default function AwaitingReviewList({ products, onOpenDrawer }) {
  return (
    <div className="awaiting-review-list">
      <div className="row">
        {products.map((product) => (
          <div key={product.sku} className="col-12 col-md-6">
            <AwaitingReviewItem
              product={product}
              onOpenDrawer={onOpenDrawer}
            />
          </div>
        ))}
      </div>
    </div>
  );
}