// components/product/info/ProductColors.js
'use client';

import { useState } from 'react';

const API_BASE_URL = 'http://45.135.234.22';

export default function ProductColors({ variants, currentSku, localImages }) {
  const [selectedSku, setSelectedSku] = useState(currentSku);

  // Варианты у которых есть имя (название цвета/варианта)
  const colorVariants = variants.filter(v => v.sku && v.name);

  if (colorVariants.length === 0) {
    return null;
  }

  const activeVariant = colorVariants.find(v => v.sku === selectedSku) || colorVariants[0];

  return (
    <div className="goods-color">
      <p>Вариант: <span>{activeVariant?.name || '—'}</span></p>

      <div className="goods-color__buttons">
        {colorVariants.map((variant, index) => {
          // Берём изображение: сначала из самого варианта, потом из localImages по индексу
          const variantImg = Array.isArray(variant.images) && variant.images.length > 0
            ? variant.images[0]
            : null
          const fallbackImg = localImages && localImages[index]
            ? `${API_BASE_URL}/${localImages[index]}`
            : '/assets/img/placeholder.png'
          const imgSrc = variantImg
            ? (variantImg.startsWith('http') ? variantImg : `${API_BASE_URL}/${variantImg}`)
            : fallbackImg

          const isActive = variant.sku === selectedSku;

          return (
            <button
              key={variant.sku}
              className={`goods-color__item ${isActive ? 'active' : ''}`}
              title={variant.name}
              onClick={() => {
                setSelectedSku(variant.sku);
                const slug = `${(variant.name || 'product').toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-')}-${variant.sku}`;
                window.location.href = `/product/${slug}`;
              }}
            >
              <img
                src={imgSrc}
                alt={variant.name}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}