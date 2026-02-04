// components/catalog/products/ProductGrid.js
'use client';

import ProductCard from './ProductCard';

export default function ProductGrid({ products = [] }) {
  if (!products || products.length === 0) {
    return (
      <div className="all-catalog-items">
        <div className="empty-state" style={{ 
          padding: '60px 20px', 
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ fontSize: '18px' }}>Товары не найдены</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-catalog-items">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
