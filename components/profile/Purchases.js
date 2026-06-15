// components/profile/Purchases.js
'use client';

import EmptyState from './EmptyState';
import ProductCard from '@/components/catalog/products/ProductCard';
import ProductSort from '@/components/catalog/ProductSort';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'price_asc', label: 'Сначала дешёвые' },
];

function parseImagesField(value) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return [];
      }
    }

    return [trimmed];
  }

  return [];
}

function normalizeProductImages(product = {}) {
  return [
    ...parseImagesField(product.local_images),
    ...parseImagesField(product.images?.local_images),
    ...parseImagesField(product.images?.images),
    ...parseImagesField(product.image_url),
    ...parseImagesField(product.preview_image),
  ].filter(Boolean);
}

function pickPriceValue(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== '') {
      return value;
    }
  }

  return null;
}

function pickNonEmptyArray(...values) {
  return values.find((value) => Array.isArray(value) && value.length > 0) || [];
}

function purchaseToProduct(purchase) {
  const p = purchase.product || {};
  const sku =
    p.sku ||
    purchase.product_sku ||
    purchase.sku ||
    '';
  const purchasePrice = pickPriceValue(
    purchase.price_byn,
    purchase.price,
    purchase.unit_price_byn,
    purchase.unit_price,
    purchase.final_price_byn,
    purchase.final_price,
    purchase.product_price_byn,
    purchase.product_price,
  );
  const productCurrentPrice = pickPriceValue(
    p.price_byn,
    p.price,
    p.new_price,
    p.price_new,
  );
  const displayPrice = purchasePrice ?? productCurrentPrice ?? '0';

  return {
    id: purchase.product_sku || sku,
    attributes: {
      ...p,
      sku,
      slug:
        p.slug ||
        p.product_slug ||
        purchase.slug ||
        purchase.product_slug ||
        sku,
      name_ru:
        p.name_ru ||
        p.translated_name ||
        p.name ||
        purchase.name ||
        purchase.product_name ||
        sku ||
        '—',
      small_desc_name:
        p.small_desc_name ||
        p.description ||
        p.short_description ||
        p.subtitle ||
        purchase.small_desc_name ||
        purchase.description ||
        purchase.short_description ||
        purchase.subtitle ||
        '',
      price_byn: displayPrice,
      price: displayPrice,
      local_images: normalizeProductImages(p),
      variants: pickNonEmptyArray(
        p.variants,
        p.product_variants,
        purchase.variants,
        purchase.product_variants,
      ),
      is_bestseller: p.is_bestseller || p.isBestseller || false,
      is_popular: p.is_popular || p.isPopular || false,
      is_new: p.is_new || p.isNew || false,
    },
  };
}

export default function Purchases({ products, sort = 'newest', onSortChange }) {
  if (!products || products.length === 0) {
    return <EmptyState type="purchases" />;
  }

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
