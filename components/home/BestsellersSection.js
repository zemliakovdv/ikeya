// components/home/BestsellersSection.js
import ProductTabsSection from '@/components/home/ProductTabsSection';

const API_BASE_URL = 'http://45.135.234.22';

async function getBestsellers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products/bestsellers?per_page=50`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Bestsellers API Error:', res.status);
      return [];
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch bestsellers error:', error);
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

export default async function BestsellersSection() {
  const bestsellersData = await getBestsellers();
  const allBestsellers = bestsellersData.map(mapProductToCard);

  const salesTabs = [
    { id: 'all', label: 'Все хиты' },
    { id: 'furniture', label: 'Мебель' },
    { id: 'lighting', label: 'Освещение' },
    { id: 'storage', label: 'Хранение' },
    { id: 'decor', label: 'Декор' }
  ];

  const salesProducts = {
    all: allBestsellers.slice(0, 15),
    furniture: allBestsellers.slice(0, 10),
    lighting: allBestsellers.slice(10, 20),
    storage: allBestsellers.slice(20, 30),
    decor: allBestsellers.slice(30, 40)
  };

  return (
    <ProductTabsSection
      title="Хиты продаж"
      tabs={salesTabs}
      tabProducts={salesProducts}
      sectionClass="bestsellers-tabs"
    />
  );
}
