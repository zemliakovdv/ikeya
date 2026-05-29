// components/blog/blocks/ProductsGridBlock.js

import ProductsGridSlider from '@/components/blog/blocks/ProductsGridSlider';
import { buildApiUrl, buildAssetUrl } from '@/lib/config/api';

async function getProductBySku(sku) {
  try {
    const res = await fetch(buildApiUrl(`/products/${sku}`), {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || null;
  } catch (e) {
    return null;
  }
}

function normalizeLocalImages(images) {
  if (!Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((img) => {
      if (img.startsWith('http')) return img;
      return buildAssetUrl(img);
    });
}

function mapApiProduct(product) {
  const attr = product.attributes || {};

  return {
    id: product.id,
    sku: attr.sku,
    title: attr.small_desc_name || attr.name_ru || attr.name || 'Без названия',
    description: attr.name_ru || attr.collection || '',
    price: attr.price_byn ? `${parseFloat(String(attr.price_byn).replace(/\s/g, '')).toFixed(2)}` : '0.00',
    images: normalizeLocalImages(attr.local_images),
    variants: attr.variants || null,
    badges: [
      attr.is_bestseller && 'hit',
      attr.is_popular && 'promo',
      attr.is_new && 'new',
    ].filter(Boolean),
    url: `/product/${attr.slug || attr.sku}-${attr.sku}`,
  };
}

function mapGridProduct(product) {
  return {
    id: product.id || product.sku,
    sku: product.sku,
    title: product.small_desc_name || product.name_ru || product.name || 'Без названия',
    description: product.name_ru || '',
    price: product.price_byn ? `${parseFloat(String(product.price_byn).replace(/\s/g, '')).toFixed(2)}` : '0.00',
    images: normalizeLocalImages(product.local_images),
    variants: product.variants || null,
    badges: [
      product.is_bestseller && 'hit',
      product.is_popular && 'promo',
      product.is_new && 'new',
    ].filter(Boolean),
    url: `/product/${product.slug || product.sku}-${product.sku}`,
  };
}

export default async function ProductsGridBlock({ block }) {
  const gridProducts = Array.isArray(block.grid_products) ? block.grid_products : [];

  let mapped = gridProducts
    .filter(Boolean)
    .map(mapGridProduct)
    .filter((product) => product.sku);

  if (!mapped.length) {
    const skus = block.slider_product_skus || [];

    if (!skus.length) return null;

    const products = await Promise.all(skus.map(getProductBySku));
    mapped = products
      .filter(Boolean)
      .map(mapApiProduct)
      .filter((product) => product.sku);
  }

  if (!mapped.length) return null;

  const slides = [];
  for (let i = 0; i < mapped.length; i += 4) {
    slides.push(mapped.slice(i, i + 4));
  }

  const blockId = `grid-${block.position ?? mapped.map((product) => product.sku).join('-')}`;

  return (
    <section className="grid-of-goods">
      <ProductsGridSlider slides={slides} blockId={blockId} />
    </section>
  );
}