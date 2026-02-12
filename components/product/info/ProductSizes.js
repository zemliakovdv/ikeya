// components/product/info/ProductSizes.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

export default function ProductSizes({ variants, currentPrice, productImage }) {
  // Фильтруем варианты у которых есть размеры
  const sizeVariants = variants.filter(v => v.itemMeasureReferenceText);
  
  if (sizeVariants.length === 0) {
    return null; // Скрываем если нет вариантов с размерами
  }

  // Функция создания slug для варианта
  const createVariantSlug = (variant) => {
    const name = variant.name || variant.typeName || 'product';
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9а-я]+/gi, '-')
      .replace(/^-+|-+$/g, '');
    return `/product/${slug}-${variant.itemNo}`;
  };

  // Формируем полный URL изображения
  const imageUrl = productImage 
    ? `${API_BASE_URL}/${productImage.replace(/^\//, '')}`
    : '/assets/img/catalog-card/sizes/size_1.png';

  return (
    <div className="goods-sizes">
      <h2>Варианты размеров:</h2>
      <div className="goods-sizes__card">
        {sizeVariants.map((variant, index) => {
          const variantPrice = variant.salesPrice?.numeral || 0;
          const priceDiff = variantPrice - currentPrice;
          const priceDiffAbs = Math.abs(priceDiff);
          const isPositive = priceDiff > 0;
          const isZero = priceDiff === 0;

          return (
            <Link 
              key={variant.itemNo || index} 
              href={createVariantSlug(variant)} 
              className="goods-sizes__item"
            >
              <img 
                src={imageUrl} 
                alt={variant.itemMeasureReferenceText} 
              />
              <p className="good-sizes__number">
                {variant.itemMeasureReferenceText}
              </p>
              <p className={isZero ? 'no_cost' : ''}>
                {isPositive && '+'}
                {!isZero && '-'}
                <span>{priceDiffAbs.toFixed(2)}</span> р.
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
