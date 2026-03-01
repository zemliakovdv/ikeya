// components/home/BestsellersSection.js
import { getAllBestsellers, getAllCategories, getCategory, IMAGES_BASE_URL } from '@/lib/api/ikea';
import ProductTabsSection from '@/components/home/ProductTabsSection';

function mapProductToCard(product) {
  const attr = product.attributes;

  let images = [];
  if (Array.isArray(attr.local_images) && attr.local_images.length > 0) {
    images = attr.local_images.map(img => `${IMAGES_BASE_URL}${img.startsWith('/') ? img : '/' + img}`);
  }

  return {
    id: product.id,
    sku: attr.sku || product.id,
    title: attr.name_ru || attr.name || 'Без названия',
    description: attr.short_description_ru
      || attr.content_ru
      || attr.collection
      || attr.name_ru
      || 'Описание скоро появится',
    price: attr.price ? `${parseFloat(attr.price).toFixed(2)}` : '0.00',
    images: images,
    badges: [
      attr.is_bestseller && 'hit',
      attr.is_popular && 'promo'
    ].filter(Boolean),
    url: `/product/${attr.slug}-${attr.sku}`,
    categoryId: attr.category_id,
  };
}

export default async function BestsellersSection() {
  const [allProducts, allCategoriesData] = await Promise.all([
    getAllBestsellers(),
    getAllCategories()
  ]);

  const allBestsellers = allProducts.map(mapProductToCard);

  // Строим categoryMap из плоского списка
  const categoryMap = new Map();
  if (Array.isArray(allCategoriesData)) {
    allCategoriesData.forEach(cat => {
      const name = cat.attributes?.translated_name || cat.attributes?.name;
      if (name) categoryMap.set(cat.id, name);
    });
  }

  // Собираем уникальные category_id из товаров
  const uniqueCategoryIds = [...new Set(allBestsellers.map(p => p.categoryId).filter(Boolean))];

  // Догружаем категории которых нет в списке (корневые и т.д.)
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
        } catch (e) {
          // категория недоступна — пропускаем
        }
      })
    );
  }

  // Группируем товары по categoryId
  const groupedByCategory = {};

  allBestsellers.forEach(product => {
    const catId = product.categoryId;
    if (!catId) return;

    if (!groupedByCategory[catId]) {
      groupedByCategory[catId] = {
        categoryName: categoryMap.get(catId) || null,
        products: []
      };
    }
    groupedByCategory[catId].products.push(product);
  });

  // Формируем табы — пропускаем категории без названия
  let tabs = [];
  const allTabProducts = {};

  Object.entries(groupedByCategory).forEach(([catId, { categoryName, products }]) => {
    if (!categoryName) return;
    const limitedProducts = products.slice(0, 15);
    if (limitedProducts.length === 0) return;

    tabs.push({ id: catId, label: categoryName });
    allTabProducts[catId] = limitedProducts;
  });

  tabs.sort((a, b) => a.label.localeCompare(b.label, 'ru'));

  const MAX_TABS = 7;
  const limitedTabs = tabs.slice(0, MAX_TABS);

  const limitedTabProducts = {};
  limitedTabs.forEach(tab => {
    limitedTabProducts[tab.id] = allTabProducts[tab.id];
  });

  if (limitedTabs.length === 0) return null;

  return (
    <ProductTabsSection
      title="Хиты продаж"
      tabs={limitedTabs}
      tabProducts={limitedTabProducts}
      sectionClass="bestsellers-tabs"
    />
  );
}
