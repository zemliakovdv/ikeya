'use client';

import { buildAssetUrl } from '@/lib/config/api';

const REVIEW_PRODUCT_PLACEHOLDER = '/assets/img/placeholder.png';

function parseValueToList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => parseValueToList(item));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'))
    ) {
      try {
        return parseValueToList(JSON.parse(trimmed));
      } catch {
        return [trimmed];
      }
    }

    return [trimmed];
  }

  if (typeof value === 'object') {
    return [
      ...parseValueToList(value.local_images),
      ...parseValueToList(value.images),
      ...parseValueToList(value.image_url),
      ...parseValueToList(value.preview_image),
      ...parseValueToList(value.url),
    ];
  }

  return [];
}

function isUsableImageValue(value) {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();

  if (!trimmed) return false;
  if (trimmed.startsWith('as:')) return false;
  if (trimmed === '[object Object]') return false;

  return true;
}

function isUsableImageUrl(url) {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();

  if (!trimmed) return false;
  if (trimmed.includes('/as:')) return false;
  if (trimmed.includes('[object Object]')) return false;

  return true;
}

function normalizeImageCandidate(candidate, { rawAbsolute = false } = {}) {
  if (!isUsableImageValue(candidate)) return null;

  const trimmed = candidate.trim();

  if (rawAbsolute && /^https?:\/\//i.test(trimmed)) {
    return isUsableImageUrl(trimmed) ? trimmed : null;
  }

  const imageUrl = buildAssetUrl(trimmed);
  return isUsableImageUrl(imageUrl) ? imageUrl : null;
}

export function getReviewProductName(product, fallbackSku = null) {
  return (
    product?.name_ru ||
    product?.translated_name ||
    product?.name ||
    product?.product_name ||
    fallbackSku ||
    product?.sku ||
    '—'
  );
}

export function getReviewProductSku(product, review = null) {
  return product?.sku || review?.product_sku || review?.sku || null;
}

export function getReviewProductSlug(product, fallbackSku = null) {
  return product?.slug || product?.product_slug || fallbackSku || product?.sku || null;
}

export function getReviewProductImage(product, options = {}) {
  const { preferLegacyImages = false } = options;

  const candidateGroups = preferLegacyImages
    ? [
        {
          values: parseValueToList(product?.local_images),
          rawAbsolute: false,
        },
        {
          values: parseValueToList(product?.images),
          rawAbsolute: true,
        },
        {
          values: parseValueToList(product?.images?.local_images),
          rawAbsolute: false,
        },
        {
          values: parseValueToList(product?.images?.images),
          rawAbsolute: true,
        },
        {
          values: parseValueToList(product?.image_url),
          rawAbsolute: false,
        },
        {
          values: parseValueToList(product?.preview_image),
          rawAbsolute: false,
        },
      ]
    : [
        {
          values: parseValueToList(product?.local_images),
          rawAbsolute: false,
        },
        {
          values: parseValueToList(product?.images?.local_images),
          rawAbsolute: false,
        },
        {
          values: parseValueToList(product?.images?.images),
          rawAbsolute: true,
        },
        {
          values: parseValueToList(product?.images),
          rawAbsolute: true,
        },
        {
          values: parseValueToList(product?.image_url),
          rawAbsolute: false,
        },
        {
          values: parseValueToList(product?.preview_image),
          rawAbsolute: false,
        },
      ];

  for (const group of candidateGroups) {
    for (const candidate of group.values) {
      const imageUrl = normalizeImageCandidate(candidate, {
        rawAbsolute: group.rawAbsolute,
      });

      if (imageUrl) return imageUrl;
    }
  }

  return REVIEW_PRODUCT_PLACEHOLDER;
}
