// components/home/PopularCategoriesSection.js
import { getPopularCategories } from '@/lib/api/ikea';
import PopularCategory from '@/components/home/PopularCategory';

export default async function PopularCategoriesSection() {
  const response = await getPopularCategories();
  
  const categories = response.data.map(item => {
    const attr = item.attributes;
    
    let imageUrl = attr.local_image_path || attr.remote_image_url || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
      if (imageUrl.startsWith('/')) {
        imageUrl = `http://45.135.234.22${imageUrl}`;
      } else {
        imageUrl = `http://45.135.234.22/${imageUrl}`;
      }
    }
    
    return {
      id: item.id,
      name: attr.translated_name || attr.name,
      image: imageUrl,
      url: `/catalog/${attr.ikea_id || item.id}`
    };
  });

  return <PopularCategory categories={categories} />;
}
