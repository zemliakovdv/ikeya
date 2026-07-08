'use client';

import { useEffect, useState } from 'react';
import { getHomepageRecommendations } from '@/lib/api/ikea';
import RecommendationsSection from '@/components/recommendations/RecommendationsSection';

function mapProduct(item) {
  const attr = item.attributes || {};

  const local_images = (attr.local_images || []).map((img) => {
    const clean = img.startsWith('/') ? img.slice(1) : img;
    return `/${clean}`;
  });

  return {
    id: item.id,
    attributes: {
      ...attr,
      local_images,
    },
  };
}

export default function CartRecommendationsClient() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        const data = await getHomepageRecommendations({ page: 1, per_page: 10 });
        const nextProducts = (data.data || []).map(mapProduct);

        if (!cancelled) {
          setProducts(nextProducts);
        }
      } catch (error) {
        console.error('Cart recommendations fetch failed:', error);
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!products.length) return null;

  return <RecommendationsSection products={products} />;
}
