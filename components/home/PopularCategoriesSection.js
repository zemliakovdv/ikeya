// components/home/PopularCategoriesSection.js
import { getPopularCategories } from '@/lib/api/ikea';
import PopularCategory from '@/components/home/PopularCategory';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

export default async function PopularCategoriesSection() {
  const response = await getPopularCategories();
  
  console.log('📦 Популярные категории из API:', response.data.length);
  
  const categories = response.data.map(item => {
    const attr = item.attributes;
    
    // Формируем URL изображения из icon_url
    let imageUrl = attr.icon_url || PLACEHOLDER_IMAGE;
    
    // Если icon_url относительный и не равен плейсхолдеру, добавляем базовый URL
    if (imageUrl && !imageUrl.startsWith('http') && imageUrl !== PLACEHOLDER_IMAGE) {
      // icon_url уже должен начинаться с /, но на всякий случай проверяем
      imageUrl = `${IMAGES_BASE_URL}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return {
      id: item.id,
      name: attr.translated_name || attr.name || 'Категория',
      image: imageUrl,
      // Используем slug для ЧПУ
      url: `/catalog/${attr.slug}`,
    };
  });

  console.log('✅ Обработанные категории:', categories.length, 'шт.');

  return <PopularCategory categories={categories} />;
}