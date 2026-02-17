// components/product/info/ProductColors.js
'use client';

import { useState } from 'react';

const API_BASE_URL = 'http://45.135.234.22';

export default function ProductColors({ variants, currentSku, localImages }) {
  // По умолчанию активен первый вариант
  const [selectedVariant, setSelectedVariant] = useState(variants && variants.length > 0 ? variants[0].itemNo : currentSku);
  
  if (!variants || variants.length === 0) {
    return null;
  }

  // Находим активный вариант (по selectedVariant)
  const activeVariant = variants.find(v => v.itemNo === selectedVariant) || variants[0];
  const activeColorName = activeVariant?.validDesignText || 'не выбран';

  return (
    <div className="goods-color">
      <p>Цвет: <span>{activeColorName}</span></p>
      
      <div className="goods-color__buttons">
        {variants.map((variant, index) => {
          const localImage = localImages && localImages[index]
            ? `${API_BASE_URL}/${localImages[index]}`
            : '/assets/img/placeholder.png';
          
          // Проверяем активен ли этот вариант
          const isActive = variant.itemNo === selectedVariant;
          
          return (
            <button
              key={variant.itemNo}
              className={`goods-color__item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setSelectedVariant(variant.itemNo);
                const name = variant.name || variant.typeName || 'product';
                const slug = name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-');
                window.location.href = `/product/${slug}-${variant.itemNo}`;
              }}
            >
              <img 
                src={localImage}
                alt={variant.validDesignText}
                title={variant.validDesignText}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
