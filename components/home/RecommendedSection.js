// components/home/RecommendedSection.js
import { getRecommendedProducts, getCachedCategoriesTree, IMAGES_BASE_URL } from '@/lib/api/ikea';
import { flattenCategoriesTree } from '@/lib/utils/categoryHelpers';
import ProductTabsSection from '@/components/home/ProductTabsSection';

const MAX_TABS = 7;
const PRODUCTS_PER_TAB = 15;
const FETCH_LIMIT = 100; // Увеличиваем лимит для получения достаточного кол-ва товаров для группировки

function resolveImageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function mapProductToCard(product) {
  const attr = product.attributes;

  const images = Array.isArray(attr.local_images)
    ? attr.local_images.map(resolveImageUrl).filter(Boolean)
    : [];

  const badges = [];
  if (attr.is_bestseller || true) badges.push('hit');
  if (attr.is_new) badges.push('new');
  if (attr.promo) badges.push('promo');

  return {
    id: product.id,
    sku: attr.sku || product.id,
    slug: attr.slug || null,
    title: attr.small_desc_name || 'Товар IKEA',
    description: attr.name_ru || 'Без названия',
    price: attr.price_byn || '0.00',
    images,
    url: `/product/${attr.slug}-${attr.sku}`,
    categoryId: String(attr.category_id),
    variants: attr.variants || null,
    badges: badges,
  };
}

export default async function RecommendedSection() {
  const [productsResponse, tree] = await Promise.all([
    // Используем правильный эндпоинт для рекомендаций
    getRecommendedProducts({ page: 1, per_page: FETCH_LIMIT }),
    getCachedCategoriesTree(),
  ]);

  const products = (productsResponse.data || []).map(mapProductToCard);

  if (!products.length) return null;

  const allCategories = flattenCategoriesTree(tree);
  const categoryMap = new Map();
  allCategories.forEach(cat => {
    const name = cat.attributes?.translated_name || cat.attributes?.name;
    // Сохраняем ID как строку для гарантированного совпадения
    if (name) categoryMap.set(String(cat.id), name);
  });

  const groupedByCategory = {};
  const categoryOrder = [];

  products.forEach(product => {
    const catId = product.categoryId;
    if (!catId || !categoryMap.has(catId)) return;

    if (!groupedByCategory[catId]) {
      groupedByCategory[catId] = {
        categoryName: categoryMap.get(catId),
        products: []
      };
      categoryOrder.push(catId);
    }

    if (groupedByCategory[catId].products.length < PRODUCTS_PER_TAB) {
      groupedByCategory[catId].products.push(product);
    }
  });

  const tabs = categoryOrder
    .filter(catId => groupedByCategory[catId].products.length > 0)
    .map(catId => ({ id: catId, label: groupedByCategory[catId].categoryName }))
    .slice(0, MAX_TABS);

  if (!tabs.length) return null;

  const tabProducts = {};
  tabs.forEach(tab => {
    tabProducts[tab.id] = groupedByCategory[tab.id].products;
  });

  return (
    <ProductTabsSection
      title="Рекомендованные товары"
      tabs={tabs}
      tabProducts={tabProducts}
      sectionClass="recommended-tabs"
    />
  );
}
