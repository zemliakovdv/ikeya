// components/product/ProductVariants.js
'use client';

import { useState } from 'react';

import { buildAssetUrl } from '@/lib/config/api';

export default function ProductVariants({ variants, currentSku, localImages }) {
  const [selectedSku, setSelectedSku] = useState(currentSku);

  if (!variants || variants.length === 0) {
    return null;
  }

  const activeVariant = variants.find(v => v.sku === selectedSku);
  const activeColorName = activeVariant?.name || '—';

  return (
    <div className="goods-color">
      <p>Цвет: <span>{activeColorName}</span></p>

      <div className="goods-color__buttons">
        {variants.map((variant, index) => {
          const variantImg = Array.isArray(variant.images) && variant.images.length > 0
            ? variant.images[0]
            : null;
          const fallbackImg = localImages && localImages[index]
            ? buildAssetUrl(localImages[index])
            : '/assets/img/placeholder.png';
          const imgSrc = variantImg
            ? buildAssetUrl(variantImg)
            : fallbackImg;

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
              <img src={imgSrc} alt={variant.name || ''} />
            </button>
          );
        })}
      </div>
    </div>
  );
}