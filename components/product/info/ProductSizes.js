// components/product/info/ProductSizes.js
'use client';

import Link from 'next/link';
import { resolveImageUrl } from '@/lib/api/ikea';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

function parsePrice(value) {
  const normalized = String(value ?? 0)
    .replace(/\s/g, '')
    .replace(',', '.');

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildProductPath(item) {
  const sku = item?.sku;

  if (!sku) return '#';

  return item?.slug
    ? `/product/${item.slug}-${sku}`
    : `/product/${sku}`;
}

function resolveVariantImage(image, fallbackImage) {
  return resolveImageUrl(image || fallbackImage) || PLACEHOLDER_IMAGE;
}

export default function ProductSizes({ variants = [], currentSku, productImage }) {
  const sizeVariants = Array.isArray(variants)
    ? variants.filter((variant) => variant.item?.sku && variant.item.sku !== currentSku)
    : [];

  if (sizeVariants.length === 0) return null;

  const fallbackImageUrl = resolveImageUrl(productImage) || PLACEHOLDER_IMAGE;

  return (
    <div className="goods-sizes">
      <h2>Варианты размеров:</h2>

      <div className="goods-sizes__card">
        {sizeVariants.map((variant, index) => {
          const item = variant.item;

          const label = (variant.size || item.small_desc_name || `Вариант ${index + 1}`)
            .replace(/^ширина:\s*/i, '');

          const variantPrice = parsePrice(item.price_byn);
          const priceInt = Math.floor(variantPrice).toLocaleString('ru-RU');
          const priceDec = (variantPrice % 1).toFixed(2).slice(2);

          const isCurrent = item.sku === currentSku;

          const variantImg = Array.isArray(item.images) && item.images.length > 0
            ? resolveVariantImage(item.images[0], productImage)
            : fallbackImageUrl;

          return (
            <Link
              key={item.sku}
              href={buildProductPath(item)}
              className={`goods-sizes__item${isCurrent ? ' goods-sizes__item--active' : ''}`}
            >
              <img
                src={variantImg}
                alt={label}
                onError={(event) => {
                  event.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />

              <p className="good-sizes__number">{label}</p>

              {isCurrent ? (
                <p className="goods-sizes__current">Текущий</p>
              ) : (
                <p className="goods-sizes__price">
                  {priceInt}<span>.{priceDec} р.</span>
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}