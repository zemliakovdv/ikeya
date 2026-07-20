// components/home/PopularCategoriesSection.js

import {
  getCachedCategoriesTree,
  getPopularCategories,
  IMAGES_BASE_URL,
} from '@/lib/api/ikea';
import PopularCategory from '@/components/home/PopularCategory';
import {
  buildCategoryUrl,
  findCategoryPathByIkeaId,
} from '@/lib/utils/categoryHelpers';

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

function buildFallbackCategoryUrl(item) {
  const attr = item?.attributes || {};
  const rawSegment = attr.slug || item?.id;
  const segment = ['string', 'number'].includes(typeof rawSegment)
    ? String(rawSegment).trim()
    : '';

  return segment && !['undefined', 'null'].includes(segment)
    ? `/catalog/${segment}`
    : '/catalog';
}

export default async function PopularCategoriesSection() {
  const [response, categoryTree] = await Promise.all([
    getPopularCategories(),
    getCachedCategoriesTree(),
  ]);

  const categories = (response.data || []).map((item) => {
    const attr = item?.attributes || {};
    const categoryPath = findCategoryPathByIkeaId(categoryTree, item?.id);
    return {
      id:    item?.id,
      name:  attr.translated_name || attr.name || 'Категория',
      image: resolveImageUrl(attr),
      url:   categoryPath.length > 0
        ? buildCategoryUrl(categoryPath)
        : buildFallbackCategoryUrl(item),
    };
  });

  return <PopularCategory categories={categories} />;
}
