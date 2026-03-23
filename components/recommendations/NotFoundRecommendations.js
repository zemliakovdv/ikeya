// components/recommendations/NotFoundRecommendations.js

import RecommendationsSection from '@/components/recommendations/RecommendationsSection';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

async function getRecommended() {
  try {
    const res = await fetch(`${API_BASE_URL}/products/recommended?per_page=10`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function mapProduct(item) {
  const attr = item.attributes || {};

  const images = (attr.local_images || []).map(
    (img) => `${IMAGES_BASE_URL}/${img}`
  );
  const fallback = '/assets/img/placeholder.png';

  return {
    id:          item.id,
    sku:         attr.sku,
    title:       attr.name_ru || attr.name || '',
    description: '',
    price:       parseFloat(attr.price_byn || attr.price || 0),
    images:      images.length ? images : [fallback],
    thumbs:      images.length ? images : [fallback],
    isHit:       attr.is_bestseller || false,
    promoCode:   attr.promo?.code || null,
  };
}

export default async function NotFoundRecommendations() {
  const raw = await getRecommended();
  
  console.log('raw length:', raw.length);  // ← сюда
  
  if (!raw.length) return null;

  const products = raw.map(mapProduct);
  
  console.log('mapped:', JSON.stringify(products.slice(0, 1)));  // ← и сюда
  
  return <RecommendationsSection products={products} />;
}