// components/product/info/ProductColors.js
'use client';

import { useState } from 'react';

const API_BASE_URL = 'https://test.ikeya.by';

// Нормализует любой путь к картинке — убирает двойные слеши
function resolveImage(path) {
  if (!path) return '/assets/img/placeholder.png';
  if (path.startsWith('http')) return path;
  const clean = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/${clean}`;
}

// Берём первую локальную картинку из массива images варианта.
// Бэк всегда кладёт ikea.com ссылку первой — её пропускаем.
// Если локальных нет — fallback на localImages основного товара, затем плейсхолдер.
function resolveVariantImage(images, localImages) {
  if (Array.isArray(images) && images.length > 0) {
    const local = images.find(img => !img.startsWith('http'));
    if (local) return resolveImage(local);
  }
  if (Array.isArray(localImages) && localImages.length > 0) {
    return resolveImage(localImages[0]);
  }
  return '/assets/img/placeholder.png';
}

export default function ProductColors({ variants, currentSku, localImages }) {
  const [selectedSku, setSelectedSku] = useState(currentSku);

  const allVariants = variants.filter(v => v.item?.sku);
  if (allVariants.length === 0) return null;

  // Находим вариант текущего товара среди всех — он будет первой миниатюрой
  const baseVariant = allVariants.find(v => v.item.sku === currentSku);
  const baseImage = resolveVariantImage(baseVariant?.item?.images, localImages);
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
          const imgSrc = resolveVariantImage(item.images, localImages);

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