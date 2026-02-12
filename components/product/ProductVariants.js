'use client';

import { useState } from 'react';

export default function ProductVariants({ variants, currentSku, localImages }) {
  const [selectedVariant, setSelectedVariant] = useState(currentSku);
  
  // Если нет вариантов
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="goods-color">
      <p>Цвет: <span>{variants.find(v => v.itemNo === selectedVariant)?.validDesignText || 'не выбран'}</span></p>
      
      <div className="goods-color__buttons">
        {variants.map((variant) => {
          // Если это текущий товар — берём локальное изображение
          const imageUrl = variant.itemNo === currentSku && localImages && localImages[0]
            ? `http://45.135.234.22/${localImages[0]}`
            : '/assets/img/placeholder.png'; // Заглушка для других вариантов
          
          return (
            <button
              key={variant.itemNo}
              className={`goods-color__item ${variant.itemNo === selectedVariant ? 'active' : ''}`}
              onClick={() => {
                setSelectedVariant(variant.itemNo);
                window.location.href = `/product/${variant.name.toLowerCase()}-${variant.itemNo}`;
              }}
            >
              <img 
                src={imageUrl} 
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
