// components/home/BestsellersSection.js
import { getBestsellers, getCachedCategoriesTree, IMAGES_BASE_URL } from '@/lib/api/ikea';
import { flattenCategoriesTree } from '@/lib/utils/categoryHelpers';
import ProductTabsSection from '@/components/home/ProductTabsSection';

const MAX_TABS = 7;
const PRODUCTS_PER_TAB = 15;

function resolveImageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function mapProductToCard(product) {
  const attr = product.attributes || {};

  const images = Array.isArray(attr.local_images)
    ? attr.local_images.map(resolveImageUrl).filter(Boolean)
    : [];

  const badges = ['hit'];

  if (attr.is_new) badges.push('new');
  if (attr.promo) badges.push('promo');

  const sku = attr.sku || product.id;
  const slug = attr.slug;

  return {
    id: product.id,
    sku,
    slug: slug || null,
    title: attr.small_desc_name || 'Товар IKEA',
    description: attr.name_ru || 'Без названия',
    price: attr.price_byn || '0.00',
    images,
    url: slug && sku ? `/product/${slug}-${sku}` : '#',
    categoryId: attr.category_id ? String(attr.category_id) : null,
    variants: attr.variants || null,
    badges,
  };
}

export default async function BestsellersSection() {
  const [productsResponse, tree] = await Promise.all([
    getBestsellers({ page: 1, per_page: 100 }),
    getCachedCategoriesTree(),
  ]);

  const products = (productsResponse.data || []).map(mapProductToCard);

  if (products.length === 0) return null;

  const allCategories = flattenCategoriesTree(tree);
  const categoryMap = new Map();

  allCategories.forEach(cat => {
    const name = cat.attributes?.translated_name || cat.attributes?.name;
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
        products: [],
      };
      categoryOrder.push(catId);
    }

    if (groupedByCategory[catId].products.length < PRODUCTS_PER_TAB) {
      groupedByCategory[catId].products.push(product);
    }
  });

  const tabs = categoryOrder
    .filter(catId => groupedByCategory[catId].products.length > 0)
    .map(catId => ({
      id: catId,
      label: groupedByCategory[catId].categoryName,
    }))
    .slice(0, MAX_TABS);

  if (tabs.length === 0) return null;

  const tabProducts = {};

  tabs.forEach(tab => {
    tabProducts[tab.id] = groupedByCategory[tab.id].products;
  });

  return (
    <ProductTabsSection
      title="Хиты продаж"
      tabs={tabs}
      tabProducts={tabProducts}
      sectionClass="bestsellers-tabs"
    />
  );
}
