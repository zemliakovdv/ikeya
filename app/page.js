// app/page.js
import StartSlider from '@/components/home/StartSlider';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import ProductTabsSection from '@/components/home/ProductTabsSection';
import PromoBlock from '@/components/home/PromoBlock';
import AdsBanner from '@/components/home/AdsBanner';
import BlogSection from '@/components/home/BlogSection';
import SeoSection from '@/components/home/SeoSection';

const API_BASE_URL = 'http://45.135.234.22';

async function getProducts(endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}${endpoint}${queryParams ? '?' + queryParams : ''}`;
    
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      console.error('API Error:', res.status);
      return [];
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

function mapProductToCard(product) {
  const attr = product.attributes;
  
  let images = [];
  
  if (attr.local_images) {
    try {
      const localImagesArray = typeof attr.local_images === 'string' 
        ? JSON.parse(attr.local_images) 
        : attr.local_images;
      
      if (Array.isArray(localImagesArray) && localImagesArray.length > 0) {
        images = localImagesArray.map(img => `${API_BASE_URL}/${img}`);
      }
    } catch (e) {
      console.error('Ошибка парсинга local_images для:', attr.name_ru, e);
    }
  }
  
  return {
    id: product.id,
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
    url: `/catalog/${attr.sku || product.id}`,
    categoryId: attr.category_id,
    categoryName: attr.category_name
  };
}

function filterByCategoryId(products, categoryIds) {
  return products.filter(p => categoryIds.includes(p.categoryId));
}

export default async function Home() {
  
  const [popularData, newData] = await Promise.all([
    getProducts('/api/v1/products', { per_page: 150 }),
    getProducts('/api/v1/products', { is_new: true, per_page: 150 })
  ]);

  const allPopularProducts = popularData.map(mapProductToCard);
  const allNewProducts = newData.map(mapProductToCard);

  // ID категорий
  const LIGHTING_IDS = ['li001', 'li002', 'li003'];
  const SOFAS_IDS = ['fu002', 'fu004'];
  const TABLES_IDS = ['fu001', 'fu003'];
  const STORAGE_IDS = ['st001', 'st002', 'st003', 'st004', 'st007', '16202'];
  const OUTDOOR_IDS = ['od001', 'od003', '21964', '21966', '21967', 'pp001', 'pp004'];
  const KITCHEN_IDS = ['ka001', 'ka002', 'ka003', 'kt001'];
  const TEXTILES_IDS = ['tl001', 'tl002'];
  const DECOR_IDS = ['de001', 'de002', '10757'];
  const BATHROOM_IDS = ['ba001', 'ba002'];

  // РЕКОМЕНДОВАННЫЕ ТОВАРЫ - 7 табов
  const recommendedTabs = [
    { id: 'storage', label: 'Хранение' },
    { id: 'lighting', label: 'Освещение' },
    { id: 'sofas', label: 'Диваны и кресла' },
    { id: 'kitchen', label: 'Кухня' },
    { id: 'textiles', label: 'Текстиль' },
    { id: 'decor', label: 'Декор' },
    { id: 'bathroom', label: 'Ванная' }
  ];

  const recommendedProducts = {
    storage: filterByCategoryId(allPopularProducts, STORAGE_IDS).slice(0, 15),
    lighting: filterByCategoryId(allPopularProducts, LIGHTING_IDS).slice(0, 15),
    sofas: filterByCategoryId(allPopularProducts, SOFAS_IDS).slice(0, 15),
    kitchen: filterByCategoryId(allPopularProducts, KITCHEN_IDS).slice(0, 15),
    textiles: filterByCategoryId(allPopularProducts, TEXTILES_IDS).slice(0, 15),
    decor: filterByCategoryId(allPopularProducts, DECOR_IDS).slice(0, 15),
    bathroom: filterByCategoryId(allPopularProducts, BATHROOM_IDS).slice(0, 15)
  };

  // НОВИНКИ - 7 табов
  const newTabs = [
    { id: 'storage', label: 'Хранение' },
    { id: 'lighting', label: 'Освещение' },
    { id: 'tables', label: 'Столы и стулья' },
    { id: 'sofas', label: 'Диваны и кресла' },
    { id: 'outdoor', label: 'Сад и балкон' },
    { id: 'kitchen', label: 'Кухня' },
    { id: 'textiles', label: 'Текстиль' }
  ];

  const newProducts = {
    storage: filterByCategoryId(allNewProducts, STORAGE_IDS).slice(0, 15),
    lighting: filterByCategoryId(allNewProducts, LIGHTING_IDS).slice(0, 15),
    tables: filterByCategoryId(allNewProducts, TABLES_IDS).slice(0, 15),
    sofas: filterByCategoryId(allNewProducts, SOFAS_IDS).slice(0, 15),
    outdoor: filterByCategoryId(allNewProducts, OUTDOOR_IDS).slice(0, 15),
    kitchen: filterByCategoryId(allNewProducts, KITCHEN_IDS).slice(0, 15),
    textiles: filterByCategoryId(allNewProducts, TEXTILES_IDS).slice(0, 15)
  };

  return (
    <main className="main">
      <StartSlider />
      <PopularCategoriesSection />
      <BestsellersSection />
      <PromoBlock />

      <ProductTabsSection
        title="Рекомендованные товары"
        tabs={recommendedTabs}
        tabProducts={recommendedProducts}
        sectionClass="recommended-tabs"
      />

      <AdsBanner />

      <ProductTabsSection
        title="Новинки"
        tabs={newTabs}
        tabProducts={newProducts}
        sectionClass="new-tabs"
        showNewBadge={true}
      />

      <BlogSection />
      <SeoSection />
    </main>
  );
}
