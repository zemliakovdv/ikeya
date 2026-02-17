// components/product/ProductVariants.js
'use client';

import { useState, useEffect } from 'react';

export default function ProductVariants({ variants, currentSku, localImages }) {
  const [selectedVariant, setSelectedVariant] = useState(currentSku);
  
  // ОТЛАДКА через alert
  useEffect(() => {
    alert('ProductVariants загружен!\ncurrentSku: ' + currentSku + '\nКол-во вариантов: ' + (variants ? variants.length : 0));
    
    if (variants && variants.length > 0) {
      alert('Первый вариант:\n' + JSON.stringify(variants[0], null, 2).substring(0, 500));
    }
  }, []);
  
  // Если нет вариантов
  if (!variants || variants.length === 0) {
    return null;
  }

  // Находим текущий активный вариант
  const activeVariant = variants.find(v => v.itemNo === currentSku);
  const activeColorName = activeVariant?.validDesignText || 'не выбран';

  return (
    <div className="goods-color">
      <p>Цвет: <span>{activeColorName}</span></p>
      
      <div className="goods-color__buttons">
        {variants.map((variant) => {
          // Берём изображение варианта из API
          const variantImage = variant.mainImageUrl || 
                              variant.allProductImage?.[0]?.url || 
                              variant.imageUrl;
          
          const imageUrl = variantImage || '/assets/img/placeholder.png';
          
          // Проверяем активен ли этот вариант
          const isActive = variant.itemNo === currentSku;
          
          return (
            <button
              key={variant.itemNo}
              className={`goods-color__item ${isActive ? 'active' : ''}`}
              onClick={() => {
                alert('Клик по варианту: ' + variant.validDesignText + '\nitemNo: ' + variant.itemNo);
                setSelectedVariant(variant.itemNo);
                // Переход на страницу варианта
                const slug = `${variant.name || 'product'}-${variant.itemNo}`.toLowerCase();
                window.location.href = `/product/${slug}`;
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
