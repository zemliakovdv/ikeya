// components/product/info/ProductColors.js
'use client';

import { useState } from 'react';

const API_BASE_URL = 'http://45.135.234.22';

// Нормализует любой путь к картинке — убирает двойные слеши
function resolveImage(path) {
  if (!path) return '/assets/img/placeholder.png';
  if (path.startsWith('http')) return path;
  const clean = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/${clean}`;
}

export default function ProductColors({ variants, currentSku, localImages }) {
  const [selectedSku, setSelectedSku] = useState(currentSku);

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

          const imgSrc = Array.isArray(item.images) && item.images.length > 0
            ? resolveImage(item.images[0])
            : resolveImage(localImages?.[index]);

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