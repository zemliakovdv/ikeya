// components/home/BestsellersSection.js
import { getBestsellers, getCachedCategoriesTree, IMAGES_BASE_URL } from '@/lib/api/ikea';
import { flattenCategoriesTree } from '@/lib/utils/categoryHelpers';
import ProductTabsSection from '@/components/home/ProductTabsSection';

const MAX_TABS = 7;
const PRODUCTS_PER_TAB = 15;

function mapProductToCard(product) {
  const attr = product.attributes;

  let images = [];
  if (Array.isArray(attr.local_images) && attr.local_images.length > 0) {
    images = attr.local_images.map(img =>
      `${IMAGES_BASE_URL}${img.startsWith('/') ? img : '/' + img}`
    );
  }

  // Формируем массив бейджей, который ожидает ProductTabsSection
  const badges = [];
  if (attr.is_bestseller || true) badges.push('hit'); // Добавляем 'hit', чтобы сработало product.badges?.includes('hit')
  if (attr.is_new) badges.push('new');
  if (attr.promo) badges.push('promo');

  return {
    id: product.id,
    sku: attr.sku || product.id,
    // 1. Заголовок из small_desc_name
    title: attr.small_desc_name || 'Товар IKEA', 
    // 2. Описание из name_ru
    description: attr.name_ru || 'Без названия', 
    // 3. Цена из price_byn
    price: attr.price_byn || '0.00', 
    images,
    url: `/product/${attr.slug}-${attr.sku}`,
    categoryId: String(attr.category_id),
    
    // Передаем именно badges, так как ProductTabsSection ищет их
    badges: badges, 
  };
}

export default async function BestsellersSection() {
  // Загружаем ВСЕ хиты одним запросом (указываем большой per_page)
  const [productsResponse, tree] = await Promise.all([
    getBestsellers({ page: 1, per_page: 100 }),
    getCachedCategoriesTree(),
  ]);

  const products = (productsResponse.data || []).map(mapProductToCard);

  if (products.length === 0) return null;

  // Создаём Map категорий для быстрого доступа к названиям
  const allCategories = flattenCategoriesTree(tree);
  const categoryMap = new Map();
  allCategories.forEach(cat => {
    const name = cat.attributes?.translated_name || cat.attributes?.name;
    if (name) categoryMap.set(cat.id, name);
  });

  // Группируем товары по категориям
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
    
    // Добавляем товар только если в категории меньше PRODUCTS_PER_TAB товаров
    if (groupedByCategory[catId].products.length < PRODUCTS_PER_TAB) {
      groupedByCategory[catId].products.push(product);
    }
  });

  // Формируем табы: сортируем по алфавиту и берём первые MAX_TABS
  let tabs = Object.entries(groupedByCategory)
    .filter(([_, { products }]) => products.length > 0)
    .map(([catId, { categoryName }]) => ({
      id: catId,
      label: categoryName
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'ru'))
    .slice(0, MAX_TABS);

  if (tabs.length === 0) return null;

  // Формируем объект с товарами для каждого таба
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