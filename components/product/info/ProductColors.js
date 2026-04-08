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

  const allVariants = variants.filter(v => v.item?.sku);
  if (allVariants.length === 0) return null;

  // Находим вариант текущего товара среди всех — он будет первой миниатюрой
  const baseVariant = allVariants.find(v => v.item.sku === currentSku);
  const baseImage = baseVariant?.item?.images?.[0]
    ? resolveImage(baseVariant.item.images[0])
    : resolveImage(localImages?.[0]);
  const baseColorName = baseVariant?.color || '—';

  // Остальные варианты — исключаем текущий товар чтобы не дублировать
  const otherVariants = allVariants.filter(v => v.item.sku !== currentSku);

  // Название активного цвета
  const activeVariant = allVariants.find(v => v.item.sku === selectedSku);
  const activeColorName = activeVariant?.color || baseColorName;

  const isBaseActive = selectedSku === currentSku;

  return (
    <div className="goods-color">
      <p>Цвет: <span>{activeColorName}</span></p>

      <div className="goods-color__buttons">
        {/* Миниатюра текущего товара — всегда первая, без дублирования */}
        <button
          className={`goods-color__item ${isBaseActive ? 'active' : ''}`}
          title={baseColorName}
          onClick={() => {
            setSelectedSku(currentSku);
            window.location.href = `/product/${currentSku}`;
          }}
        >
          <img src={baseImage} alt={baseColorName} />
        </button>

        {otherVariants.map((variant) => {
          const item = variant.item;
          const isActive = item.sku === selectedSku;
          const imgSrc = Array.isArray(item.images) && item.images.length > 0
            ? resolveImage(item.images[0])
            : resolveImage(localImages?.[0]);

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