// components/product/info/ProductSizes.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

function resolveImage(path) {
  if (!path) return '/assets/img/no-image.jpg';
  if (path.startsWith('http')) return path;
  const clean = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/${clean}`;
}

export default function ProductSizes({ variants, currentSku, productImage }) {
  const sizeVariants = (variants || []).filter(v => v.item?.sku);

  if (sizeVariants.length === 0) return null;

  const imageUrl = resolveImage(productImage);

  return (
    <div className="goods-sizes">
      <h2>Варианты размеров:</h2>
      <div className="goods-sizes__card">
        {sizeVariants.map((variant, index) => {
          const item = variant.item;

          const label = (variant.size || item.small_desc_name || `Вариант ${index + 1}`)
            .replace(/^ширина:\s*/i, '');

          // Показываем цену варианта напрямую в BYN — без разницы
          const variantPrice = parseFloat(String(item.price_byn || 0).replace(/\s/g, '')) || 0;
          const priceInt = Math.floor(variantPrice).toLocaleString('ru-RU');
          const priceDec = (variantPrice % 1).toFixed(2).slice(2);

          const isCurrent = item.sku === currentSku;

          const variantImg = Array.isArray(item.images) && item.images.length > 0
            ? resolveImage(item.images[0])
            : imageUrl;

          return (
            <Link
              key={item.sku}
              href={`/product/${item.sku}`}
              className={`goods-sizes__item${isCurrent ? ' goods-sizes__item--active' : ''}`}
            >
              <img src={variantImg} alt={label} />
              <p className="good-sizes__number">{label}</p>
              {isCurrent ? (
                <p className="goods-sizes__current">Текущий</p>
              ) : (
                <p className="goods-sizes__price">
                  {priceInt}<span>.{priceDec} р.</span>
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}