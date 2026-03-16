// components/product/info/ProductSizes.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

export default function ProductSizes({ variants, currentPrice, productImage }) {
  // В API варианты имеют: sku, name, price, images, quantity
  // Показываем все варианты с ценой отличной от текущей как "другие размеры/варианты"
  if (!variants || variants.length === 0) {
    return null;
  }

  const imageUrl = productImage
    ? `${API_BASE_URL}/${productImage.replace(/^\//, '')}`
    : '/assets/img/catalog-card/sizes/size_1.png';

  return (
    <div className="goods-sizes">
      <h2>Варианты:</h2>
      <div className="goods-sizes__card">
        {variants.map((variant, index) => {
          const variantPrice = parseFloat(variant.price) || 0;
          const priceDiff = variantPrice - currentPrice;
          const priceDiffAbs = Math.abs(priceDiff).toFixed(2);
          const isPositive = priceDiff > 0;
          const isZero = Math.abs(priceDiff) < 0.01;

          // Изображение варианта
          const variantImg = Array.isArray(variant.images) && variant.images.length > 0
            ? (variant.images[0].startsWith('http') ? variant.images[0] : `${API_BASE_URL}/${variant.images[0]}`)
            : imageUrl;

          const slug = `${(variant.name || 'product').toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-')}-${variant.sku}`;

          return (
            <Link
              key={variant.sku || index}
              href={`/product/${slug}`}
              className="goods-sizes__item"
            >
              <img src={variantImg} alt={variant.name || `Вариант ${index + 1}`} />
              <p className="good-sizes__number">{variant.name || `Вариант ${index + 1}`}</p>
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