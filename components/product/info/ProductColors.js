// components/product/info/ProductColors.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/lib/api/ikea';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

function buildProductPath(item) {
  const sku = item?.sku;

  if (!sku) return '#';

  return item?.slug
    ? `/product/${item.slug}-${sku}`
    : `/product/${sku}`;
}

// Берём первую локальную картинку из массива images варианта.
// Если локальных нет — fallback на localImages основного товара, затем плейсхолдер.
function resolveVariantImage(images, localImages) {
  if (Array.isArray(images) && images.length > 0) {
    const local = images.find((image) => image && !image.startsWith('http'));

    if (local) {
      return resolveImageUrl(local) || PLACEHOLDER_IMAGE;
    }

    const firstImage = images.find(Boolean);

    if (firstImage) {
      return resolveImageUrl(firstImage) || PLACEHOLDER_IMAGE;
    }
  }

  if (Array.isArray(localImages) && localImages.length > 0) {
    return resolveImageUrl(localImages[0]) || PLACEHOLDER_IMAGE;
  }

  return PLACEHOLDER_IMAGE;
}

export default function ProductColors({ variants = [], currentSku, localImages = [] }) {
  const router = useRouter();
  const [selectedSku, setSelectedSku] = useState(currentSku);

  useEffect(() => {
    setSelectedSku(currentSku);
  }, [currentSku]);

  const allVariants = Array.isArray(variants)
    ? variants.filter((variant) => variant.item?.sku)
    : [];

  if (allVariants.length === 0) return null;

  const baseVariant = allVariants.find((variant) => variant.item.sku === currentSku);
  const baseItem = baseVariant?.item || { sku: currentSku };
  const baseImage = resolveVariantImage(baseItem.images, localImages);
  const baseColorName = baseVariant?.color || '—';

  const otherVariants = allVariants.filter((variant) => variant.item.sku !== currentSku);

  const activeVariant = allVariants.find((variant) => variant.item.sku === selectedSku);
  const activeColorName = activeVariant?.color || baseColorName;

  const isBaseActive = selectedSku === currentSku;

  const handleNavigate = (item) => {
    const path = buildProductPath(item);
    if (path === '#') return;

    setSelectedSku(item.sku);
    router.push(path);
  };

  return (
    <div className="goods-color">
      <p>Цвет: <span>{activeColorName}</span></p>

     <div className="goods-color__buttons">
        {otherVariants.map((variant) => {
          const item = variant.item;
          const isActive = item.sku === selectedSku;
          const imgSrc = resolveVariantImage(item.images, localImages);

          return (
            <button
              key={item.sku}
              className={`goods-color__item ${isActive ? 'active' : ''}`}
              title={variant.color}
              onClick={() => handleNavigate(item)}
              type="button"
            >
              <img
                src={imgSrc}
                alt={variant.color || ''}
                onError={(event) => {
                  event.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}