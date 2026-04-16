// components/recommendations/NotFoundRecommendations.js

import RecommendationsSection from '@/components/recommendations/RecommendationsSection';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

async function getRecommended() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/recommendations?per_page=10`, {
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

  // Нормализуем local_images — добавляем полный URL
  const local_images = (attr.local_images || []).map((img) => {
    const clean = img.startsWith('/') ? img.slice(1) : img;
    return `/${clean}`; // ProductCard сам добавит API_BASE_URL
  });

  // Возвращаем структуру которую ожидает ProductCard: { id, attributes }
  return {
    id: item.id,
    attributes: {
      ...attr,
      local_images,
    },
  };
}

export default async function NotFoundRecommendations() {
  const raw = await getRecommended();
  
  if (!raw.length) return null;

  const products = raw.map(mapProduct);

  return <RecommendationsSection products={products} />;
}