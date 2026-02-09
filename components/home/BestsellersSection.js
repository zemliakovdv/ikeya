// components/home/BestsellersSection.js
import ProductTabsSection from '@/components/home/ProductTabsSection';

const API_BASE_URL = 'http://45.135.234.22';

async function getBestsellers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products/bestsellers?per_page=100`, {
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

export default async function BestsellersSection() {
  const bestsellersData = await getBestsellers();
  const allBestsellers = bestsellersData.map(mapProductToCard);

  // ID категорий
  const STORAGE_IDS = ['st001', 'st002', 'st003', 'st004', 'st007', '16202'];
  const LIGHTING_IDS = ['li001', 'li002', 'li003'];
  const FURNITURE_IDS = ['fu001', 'fu002', 'fu003', 'fu004'];
  const DECOR_IDS = ['de001', 'de002', '10757'];
  const TEXTILES_IDS = ['tl001', 'tl002'];
  const KITCHEN_IDS = ['kt001', 'ka001', 'ka002'];
  const BATHROOM_IDS = ['ba001', 'ba002'];

  const salesProducts = {
    storage: filterByCategoryId(allBestsellers, STORAGE_IDS).slice(0, 15),
    lighting: filterByCategoryId(allBestsellers, LIGHTING_IDS).slice(0, 15),
    furniture: filterByCategoryId(allBestsellers, FURNITURE_IDS).slice(0, 15),
    decor: filterByCategoryId(allBestsellers, DECOR_IDS).slice(0, 15),
    textiles: filterByCategoryId(allBestsellers, TEXTILES_IDS).slice(0, 15),
    kitchen: filterByCategoryId(allBestsellers, KITCHEN_IDS).slice(0, 15),
    bathroom: filterByCategoryId(allBestsellers, BATHROOM_IDS).slice(0, 15)
  };

  const salesTabs = [
    { id: 'storage', label: 'Хранение' },
    { id: 'lighting', label: 'Освещение' },
    { id: 'furniture', label: 'Мебель' },
    { id: 'decor', label: 'Декор' },
    { id: 'textiles', label: 'Текстиль' },
    { id: 'kitchen', label: 'Кухня' },
    { id: 'bathroom', label: 'Ванная' }
  ];

  return (
    <ProductTabsSection
      title="Хиты продаж"
      tabs={salesTabs}
      tabProducts={salesProducts}
      sectionClass="bestsellers-tabs"
    />
  );
}
