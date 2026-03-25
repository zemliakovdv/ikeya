// components/home/RecommendedSection.js
import { getAllRecommended, getAllCategories, IMAGES_BASE_URL } from '@/lib/api/ikea';
import ProductTabsSection from '@/components/home/ProductTabsSection';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

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
  const [allProducts, allCategoriesData] = await Promise.all([
    getAllRecommended(),
    getAllCategories()
  ]);

  if (!allProducts.length) return null;

  const allMapped = allProducts.map(mapProductToCard);

  const categoryMap = new Map();
  if (Array.isArray(allCategoriesData)) {
    allCategoriesData.forEach(cat => {
      const name = cat.attributes?.translated_name || cat.attributes?.name;
      if (name) categoryMap.set(cat.id, name);
    });
  }

  const uniqueCategoryIds = [...new Set(allMapped.map(p => p.categoryId).filter(Boolean))];
  const missingIds = uniqueCategoryIds.filter(id => !categoryMap.has(id));

  if (missingIds.length > 0) {
    await Promise.all(
      missingIds.map(async (id) => {
        try {
          const response = await getCategory(id);
          const cat = response?.data;
          if (cat) {
            const name = cat.attributes?.translated_name || cat.attributes?.name;
            if (name) categoryMap.set(cat.id, name);
          }
        } catch (e) { }
      })
    );
  }

  const groupedByCategory = {};
  allMapped.forEach(product => {
    const catId = product.categoryId;
    if (!catId || !categoryMap.has(catId)) return;

    if (!groupedByCategory[catId]) {
      groupedByCategory[catId] = { categoryName: categoryMap.get(catId), products: [] };
    }
    groupedByCategory[catId].products.push(product);
  });

  let tabs = [];
  const allTabProducts = {};

  Object.entries(groupedByCategory).forEach(([catId, { categoryName, products }]) => {
    const limited = products.slice(0, 15);
    if (!limited.length) return;
    tabs.push({ id: catId, label: categoryName });
    allTabProducts[catId] = limited;
  });

  tabs.sort((a, b) => a.label.localeCompare(b.label, 'ru'));

  const MAX_TABS = 7;
  const limitedTabs = tabs.slice(0, MAX_TABS);

  const limitedTabProducts = {};
  limitedTabs.forEach(tab => {
    limitedTabProducts[tab.id] = allTabProducts[tab.id];
  });

  if (!limitedTabs.length) return null;

  return (
    <ProductTabsSection
      title="Рекомендованные товары"
      tabs={limitedTabs}
      tabProducts={limitedTabProducts}
      sectionClass="recommended-tabs"
    />
  );
}
