// components/blog/blocks/ProductsGridBlock.js
import ProductsGridSlider from '@/components/blog/blocks/ProductsGridSlider';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

async function getProductBySku(sku) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${sku}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (e) {
    return null;
  }
}

function mapProduct(product) {
  const attr = product.attributes;
  console.log('local_images:', attr.sku, attr.local_images);
  return {
    id: product.id,
    title: attr.name_ru || attr.name || 'Без названия',
    description: attr.collection || '',
    price: attr.price ? `${parseFloat(attr.price).toFixed(2)}` : '0.00',
    images: (Array.isArray(attr.local_images) ? attr.local_images : []).map(img =>
      `${IMAGES_BASE_URL}${img.startsWith('/') ? img : '/' + img}`
    ),
    badges: [
      attr.is_bestseller && 'hit',
      attr.is_popular && 'promo',
      attr.is_new && 'new',
    ].filter(Boolean),
    url: `/product/${attr.slug || attr.sku}-${attr.sku}`,
  };
}

export default async function ProductsGridBlock({ block }) {
  const skus = block.slider_product_skus || [];
  if (!skus.length) return null;

  const products = await Promise.all(skus.map(getProductBySku));
  const mapped = products.filter(Boolean).map(mapProduct);

  if (!mapped.length) return null;

  // По 4 на слайд
  const slides = [];
  for (let i = 0; i < mapped.length; i += 4) {
    slides.push(mapped.slice(i, i + 4));
  }

  const blockId = `grid-${block.position ?? Math.random().toString(36).slice(2)}`;

  return (
    <section className="grid-of-goods">
      <ProductsGridSlider slides={slides} blockId={blockId} />
    </section>
  );
}
