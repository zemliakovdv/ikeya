// components/profile/Purchases.js
'use client';

import EmptyState from './EmptyState';
import ProductCard from '@/components/catalog/products/ProductCard';
import ProductSort from '@/components/catalog/ProductSort';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Сначала новые' },
  { value: 'oldest',     label: 'Сначала старые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'price_asc',  label: 'Сначала дешёвые' },
];

// Поля картинок приходят как JSON-строки — парсим безопасно
function parseImagesField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function purchaseToProduct(purchase) {
  const p = purchase.product || {};

  const localImages = [
    ...parseImagesField(p.images?.local_images),
    ...parseImagesField(p.images?.images),
  ].filter(Boolean);

  return {
    id: purchase.product_sku,
    attributes: {
      sku:             purchase.product_sku,
      name_ru:         p.name || '—',
      small_desc_name: '',
      price_byn:       purchase.price_byn, // цена на момент покупки
      local_images:    localImages,
      variants:        [],
    },
  };
}

export default function Purchases({ products, sort = 'newest', onSortChange }) {
  if (!products || products.length === 0) {
    return <EmptyState type="purchases" />;
  }

  // Сортирует сервер (sort уходит в запрос /account/purchases в Orders.js),
  // здесь только рендерим в полученном порядке.
  return (
    <div className="orders-shopping_wrapper">
      <div className="orders-shopping">

        <ProductSort
          options={SORT_OPTIONS}
          currentSort={sort}
          onSelect={(value) => onSortChange?.(value)}
        />

        <div className="shopping-cards">
          <div className="all-catalog-items">
            {products.map((purchase, idx) => (
              <ProductCard
                key={`${purchase.order_id ?? idx}-${purchase.product_sku ?? idx}`}
                product={purchaseToProduct(purchase)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}