// components/profile/Purchases.js
'use client';

import { useState } from 'react';
import EmptyState from './EmptyState';
import ProductCard from '@/components/catalog/products/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Сначала новые' },
  { value: 'oldest',     label: 'Сначала старые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'price_asc',  label: 'Сначала дешёвые' },
];

function purchaseToProduct(purchase) {
  const p = purchase.product || {};

  // local_images приходит как JSON-строка — парсим
  let localImagesRaw = p.images?.local_images || [];
  if (typeof localImagesRaw === 'string') {
    try { localImagesRaw = JSON.parse(localImagesRaw); } catch { localImagesRaw = []; }
  }

  const localImages = [
    ...localImagesRaw,
    ...(p.images?.images || []),
  ].filter(Boolean);

  return {
    id: purchase.product_sku,
    attributes: {
      sku:             purchase.product_sku,
      small_desc_name: p.name || '—',
      name_ru:         '',
      price_byn:       purchase.price_byn,
      local_images:    localImages,
      variants:        [],
    },
  };
}

export default function Purchases({ products }) {
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  if (!products || products.length === 0) {
    return <EmptyState type="purchases" />;
  }

  const sorted = [...products].sort((a, b) => {
    if (sort === 'oldest')     return new Date(a.purchased_at) - new Date(b.purchased_at);
    if (sort === 'price_desc') return parseFloat(b.price_byn) - parseFloat(a.price_byn);
    if (sort === 'price_asc')  return parseFloat(a.price_byn) - parseFloat(b.price_byn);
    return new Date(b.purchased_at) - new Date(a.purchased_at);
  });

  const currentLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Сначала новые';

  return (
    <div className="orders-shopping_wrapper">
      <div className="orders-shopping">

        <div className="all-catalog-sort">
          <div className="catalog-sort" style={{ position: 'relative' }}>
            <div
              className="catalog-sort__selected"
              onClick={() => setSortOpen(v => !v)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <span className="catalog-sort__current">{currentLabel}</span>
            </div>
            {sortOpen && (
              <ul className="catalog-sort__list" style={{ position: 'absolute', zIndex: 100, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', listStyle: 'none', padding: '8px 0', margin: 0, minWidth: '180px' }}>
                {SORT_OPTIONS.map(opt => (
                  <li
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    style={{ padding: '10px 16px', cursor: 'pointer', background: sort === opt.value ? '#f5f5f5' : 'transparent' }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="shopping-cards">
          <div className="all-catalog-items">
            {sorted.map((purchase, idx) => (
              <ProductCard
                key={purchase.product_sku || idx}
                product={purchaseToProduct(purchase)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}