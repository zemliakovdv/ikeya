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
  
  // ✅ ТОЛЬКО local_images, внешние не берём!
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
  
  // Если нет локальных изображений — пустой массив (заглушка сработает в ProductCard)
  
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
    url: `/catalog/${attr.sku || product.id}`
  };
}


export default async function Home() {
  
  // Загружаем данные для рекомендаций и новинок
  const [popularData, newData] = await Promise.all([
    getProducts('/api/v1/products', { per_page: 50 }),
    getProducts('/api/v1/products', { is_new: true, per_page: 50 })
  ]);

  const allPopularProducts = popularData.map(mapProductToCard);
  const allNewProducts = newData.map(mapProductToCard);

  // Табы для рекомендаций
  const recommendedTabs = [
    { id: 'all', label: 'Все товары' },
    { id: 'lighting', label: 'Освещение' },
    { id: 'sofas', label: 'Диваны и кресла' },
    { id: 'shkafy', label: 'Шкафы' },
    { id: 'komody', label: 'Комоды и тумбочки' },
    { id: 'storage', label: 'Системы хранения' },
    { id: 'outdoor', label: 'Сад и балкон' }
  ];

  const recommendedProducts = {
    all: allPopularProducts.slice(0, 15),
    lighting: allPopularProducts.slice(0, 10),
    sofas: allPopularProducts.slice(10, 20),
    shkafy: allPopularProducts.slice(20, 30),
    komody: allPopularProducts.slice(30, 40),
    storage: allPopularProducts.slice(0, 10),
    outdoor: allPopularProducts.slice(10, 20)
  };

  // Табы для новинок
  const newTabs = [
    { id: 'all', label: 'Все новинки' },
    { id: 'stoly', label: 'Столы и стулья' },
    { id: 'divany', label: 'Диваны и кресла' },
    { id: 'svet', label: 'Освещение' },
    { id: 'shkaf', label: 'Шкафы' },
    { id: 'tumba', label: 'Комоды и тумбочки' },
    { id: 'hron', label: 'Системы хранения' },
    { id: 'balkon', label: 'Сад и балкон' }
  ];

  const newProducts = {
    all: allNewProducts.slice(0, 15),
    stoly: allNewProducts.slice(0, 10),
    divany: allNewProducts.slice(10, 20),
    svet: allNewProducts.slice(20, 30),
    shkaf: allNewProducts.slice(30, 40),
    tumba: allNewProducts.slice(0, 10),
    hron: allNewProducts.slice(10, 20),
    balkon: allNewProducts.slice(20, 30)
  };

  return (
    <main className="main">
      <StartSlider />
      <PopularCategoriesSection />

      {/* Хиты продаж - отдельный компонент */}
      <BestsellersSection />

      <PromoBlock />

      {/* Рекомендованные товары */}
      <ProductTabsSection
        title="Рекомендованные товары"
        tabs={recommendedTabs}
        tabProducts={recommendedProducts}
        sectionClass="recommended-tabs"
      />

      <AdsBanner />

      {/* Новинки */}
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
