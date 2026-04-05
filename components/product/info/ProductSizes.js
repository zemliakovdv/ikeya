// components/product/info/ProductSizes.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

// Нормализует любой путь к картинке — убирает двойные слеши
function resolveImage(path) {
  if (!path) return '/assets/img/no-image.jpg';
  if (path.startsWith('http')) return path;
  const clean = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/${clean}`;
}

export default function ProductSizes({ variants, currentPrice, productImage }) {
  const sizeVariants = variants.filter(v => v.item?.sku);

  if (sizeVariants.length === 0) {
    return null;
  }

  const imageUrl = resolveImage(productImage);

  return (
    <div className="goods-sizes">
      <h2>Варианты:</h2>
      <div className="goods-sizes__card">
        {sizeVariants.map((variant, index) => {
          const item = variant.item;
          const label = variant.size || item.small_desc_name || item.name_ru || `Вариант ${index + 1}`;

          const variantPrice = parseFloat(String(item.price || 0).replace(/\s/g, '')) || 0;
          const basePrice = parseFloat(String(currentPrice || 0).replace(/\s/g, '')) || 0;
          const priceDiff = variantPrice - basePrice;
          const priceDiffAbs = Math.abs(priceDiff).toFixed(2);
          const isPositive = priceDiff > 0;
          const isZero = Math.abs(priceDiff) < 0.01;

          const variantImg = Array.isArray(item.images) && item.images.length > 0
            ? resolveImage(item.images[0])
            : imageUrl;

          return (
            <Link
              key={item.sku}
              href={`/product/${item.sku}`}
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