// components/product/info/ProductColors.js
'use client';

import { useState } from 'react';

const API_BASE_URL = 'http://45.135.234.22';

export default function ProductColors({ variants, currentSku, localImages }) {
  const [selectedSku, setSelectedSku] = useState(currentSku);

  // variants приходит как массив { color, item } из API
  // Фильтруем только те, у которых есть item.sku
  const colorVariants = variants.filter(v => v.item?.sku);

  if (colorVariants.length === 0) {
    return null;
  }

  const activeVariant = colorVariants.find(v => v.item.sku === selectedSku) || colorVariants[0];
  const activeColorName = activeVariant?.color || '—';

  return (
    <div className="goods-color">
      <p>Цвет: <span>{activeColorName}</span></p>

      <div className="goods-color__buttons">
        {colorVariants.map((variant, index) => {
          const item = variant.item;
          const isActive = item.sku === selectedSku;

          // Берём изображение из item.images, иначе fallback из localImages
          const variantImg = Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : null;
          const fallbackImg = localImages && localImages[index]
            ? `${API_BASE_URL}/${localImages[index]}`
            : '/assets/img/placeholder.png';
          const imgSrc = variantImg
            ? (variantImg.startsWith('http') ? variantImg : `${API_BASE_URL}/${variantImg}`)
            : fallbackImg;

          return (
            <button
              key={item.sku}
              className={`goods-color__item ${isActive ? 'active' : ''}`}
              title={variant.color}
              onClick={() => {
                setSelectedSku(item.sku);
                window.location.href = `/product/${item.sku}`;
              }}
            >
              <img src={imgSrc} alt={variant.color || ''} />
            </button>
          );
        })}
      </div>
    </div>
  );
}