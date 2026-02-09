// components/home/PopularCategoriesSection.js
import { getPopularCategories } from '@/lib/api/ikea';
import PopularCategory from '@/components/home/PopularCategory';

const API_BASE_URL = 'http://45.135.234.22';
const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

export default async function PopularCategoriesSection() {
  const response = await getPopularCategories();
  
  console.log('📦 Популярные категории из API:', response.data.length);
  
  const categories = response.data.map(item => {
    const attr = item.attributes;
    
    // Обработка URL изображения
    let imageUrl = attr.local_image_path || attr.remote_image_url || PLACEHOLDER_IMAGE;
    
    if (imageUrl && !imageUrl.startsWith('http') && imageUrl !== PLACEHOLDER_IMAGE) {
      if (imageUrl.startsWith('/')) {
        imageUrl = `${API_BASE_URL}${imageUrl}`;
      } else {
        imageUrl = `${API_BASE_URL}/${imageUrl}`;
      }
    }
    
    return {
      id: item.id,
      name: attr.translated_name || attr.name || 'Категория',
      image: imageUrl,
      url: `/catalog/${attr.ikea_id || item.id}`
    };
  });

  console.log('✅ Обработанные категории:', categories.length, 'шт.');

  return <PopularCategory categories={categories} />;
}
