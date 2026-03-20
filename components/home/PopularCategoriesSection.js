// components/home/PopularCategoriesSection.js

import { getPopularCategories, IMAGES_BASE_URL } from '@/lib/api/ikea';
import PopularCategory from '@/components/home/PopularCategory';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

function resolveImageUrl(attr) {
  const candidates = [
    attr.icon_url,
    attr.background_image_url,
    attr.local_image_path,
    attr.remote_image_url,
  ];

  for (const url of candidates) {
    if (!url) continue;
    if (url.startsWith('http')) return url;
    return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  }

  return PLACEHOLDER_IMAGE;
}

export default async function PopularCategoriesSection() {
  const response = await getPopularCategories();

  const categories = (response.data || []).map((item) => {
    const attr = item.attributes;
    return {
      id:    item.id,
      name:  attr.translated_name || attr.name || 'Категория',
      image: resolveImageUrl(attr),
      url:   `/catalog/${attr.slug}`,
    };
  });

  return <PopularCategory categories={categories} />;
}