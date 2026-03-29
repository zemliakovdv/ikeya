// components/home/RecommendedSection.js
import { getProducts, getCachedCategoriesTree, IMAGES_BASE_URL } from '@/lib/api/ikea';
import { flattenCategoriesTree } from '@/lib/utils/categoryHelpers';
import ProductTabsSection from '@/components/home/ProductTabsSection';

const MAX_TABS = 7;
const PRODUCTS_PER_TAB = 15;
const FETCH_LIMIT = MAX_TABS * PRODUCTS_PER_TAB * 3;

function mapProductToCard(product) {
  const attr = product.attributes;

  let images = [];
  if (Array.isArray(attr.local_images) && attr.local_images.length > 0) {
    images = attr.local_images.map(img =>
      `${IMAGES_BASE_URL}${img.startsWith('/') ? img : '/' + img}`
    );
  }

  return {
    id: product.id,
    sku: attr.sku || product.id,
    title: attr.name_ru || attr.name || 'Без названия',
    description: attr.collection || attr.name_ru || 'Описание скоро появится',
    price: attr.price ? `${parseFloat(attr.price).toFixed(2)}` : '0.00',
    images,
    badges: ['hit'].filter(Boolean),
    url: `/product/${attr.slug}-${attr.sku}`,
    categoryId: attr.category_id,
  };
}

export default async function RecommendedSection() {
  const [productsResponse, tree] = await Promise.all([
    getProducts({ page: 1, per_page: FETCH_LIMIT, is_popular: true }),
    getCachedCategoriesTree(),
  ]);

  const products = (productsResponse.data || []).map(mapProductToCard);

  if (!products.length) return null;

  // categoryMap из закешированного дерева
  const allCategories = flattenCategoriesTree(tree);
  const categoryMap = new Map();
  allCategories.forEach(cat => {
    const name = cat.attributes?.translated_name || cat.attributes?.name;
    if (name) categoryMap.set(cat.id, name);
  });

  // Группируем по категориям
  const groupedByCategory = {};
  products.forEach(product => {
    const catId = product.categoryId;
    if (!catId || !categoryMap.has(catId)) return;

    if (!groupedByCategory[catId]) {
      groupedByCategory[catId] = {
        categoryName: categoryMap.get(catId),
        products: []
      };
    }
    groupedByCategory[catId].products.push(product);
  });

  // Формируем табы
  let tabs = [];
  const allTabProducts = {};

  Object.entries(groupedByCategory).forEach(([catId, { categoryName, products }]) => {
    const limited = products.slice(0, PRODUCTS_PER_TAB);
    if (!limited.length) return;
    tabs.push({ id: catId, label: categoryName });
    allTabProducts[catId] = limited;
  });

  tabs.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
  tabs = tabs.slice(0, MAX_TABS);

  const limitedTabProducts = {};
  tabs.forEach(tab => {
    limitedTabProducts[tab.id] = allTabProducts[tab.id];
  });

  if (!tabs.length) return null;

  return (
    <ProductTabsSection
      title="Рекомендованные товары"
      tabs={tabs}
      tabProducts={limitedTabProducts}
      sectionClass="recommended-tabs"
    />
  );
}