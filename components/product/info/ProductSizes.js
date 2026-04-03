// components/product/info/ProductSizes.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

function resolveImage(path) {
  if (!path) return '/assets/img/no-image.jpg';
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${clean}`;
}

export default function ProductSizes({ variants, currentPrice, productImage }) {
  if (!variants || variants.length === 0) {
    return null;
  }

  const imageUrl = productImage ? resolveImage(productImage) : '/assets/img/no-image.jpg';

  return (
    <div className="goods-sizes">
      <h2>Варианты:</h2>
      <div className="goods-sizes__card">
        {variants.map((variant, index) => {
          const variantPrice = parseFloat(String(variant.price || 0).replace(/\s/g, '')) || 0;
          const basePrice = parseFloat(String(currentPrice || 0).replace(/\s/g, '')) || 0;
          const priceDiff = variantPrice - basePrice;
          const priceDiffAbs = Math.abs(priceDiff).toFixed(2);
          const isPositive = priceDiff > 0;
          const isZero = Math.abs(priceDiff) < 0.01;

          const variantImg = Array.isArray(variant.images) && variant.images.length > 0
            ? resolveImage(variant.images[0])
            : imageUrl;

          const label = variant.name_ru || variant.small_desc_name || `Вариант ${index + 1}`;

          return (
            <Link
              key={variant.sku || index}
              href={`/product/${variant.sku}`}
              className="goods-sizes__item"
            >
              <img src={variantImg} alt={label} />
              <p className="good-sizes__number">{label}</p>
              {!isZero && (
                <p>
                  {isPositive ? '+' : '-'}
                  <span>{priceDiffAbs}</span> р.
                </p>
              )}
              {isZero && <p className="no_cost">Текущий</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}