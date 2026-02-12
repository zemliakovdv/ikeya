// app/product/[slug]/page.js
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductTabs from '@/components/product/ProductTabs';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

// Извлекаем SKU из slug
function extractSKU(slug) {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

// Получаем данные товара
async function getProduct(sku) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${sku}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Получаем категорию по ID
async function getCategory(categoryId) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Строим breadcrumbs из категорий
async function buildBreadcrumbs(productData) {
  const product = productData.data;
  const attr = product.attributes;
  
  const breadcrumbs = [
    { name: 'Главная', href: '/' }
  ];
  
  // Проверяем есть ли категория в included
  let currentCategory = null;
  if (productData.included && productData.included.length > 0) {
    currentCategory = productData.included.find(item => item.type === 'category');
  }
  
  // Если категории нет в included, загружаем её
  if (!currentCategory && attr.category_id) {
    currentCategory = await getCategory(attr.category_id);
  }
  
  if (currentCategory) {
    const parentIds = currentCategory.attributes.parent_ids || [];
    
    // Загружаем все родительские категории
    const parentCategories = [];
    for (const parentId of parentIds) {
      const parent = await getCategory(parentId);
      if (parent) {
        parentCategories.push(parent);
      }
    }
    
    // Сортируем категории по иерархии (от корня к листу)
    // parent_ids идут от корня к листу, поэтому просто добавляем в том же порядке
    for (const parentId of parentIds) {
      const parent = parentCategories.find(cat => cat.id === parentId);
      if (parent) {
        breadcrumbs.push({
          name: parent.attributes.translated_name || parent.attributes.name,
          href: `/catalog/${parent.id}`
        });
      }
    }
    
    // Добавляем текущую категорию
    breadcrumbs.push({
      name: currentCategory.attributes.translated_name || currentCategory.attributes.name,
      href: `/catalog/${currentCategory.id}`
    });
  }
  
  // Добавляем товар (без ссылки)
  breadcrumbs.push({
    name: attr.name_ru || attr.seo_h1 || attr.name,
    href: null
  });
  
  return breadcrumbs;
}

// Получаем похожие товары (временно пустой массив)
async function getRelatedProducts(categoryId) {
  // TODO: Сделать API запрос для похожих товаров
  return [];
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const sku = extractSKU(slug);
  
  const productData = await getProduct(sku);
  
  if (!productData || !productData.data) {
    notFound();
  }
  
  const product = productData.data;
  const attr = product.attributes;
  
  // Парсим изображения
  let images = [];
  try {
    images = attr.local_images ? JSON.parse(attr.local_images) : [];
  } catch (e) {
    console.error('Error parsing images:', e);
  }
  
  // Получаем похожие товары
  const relatedProducts = await getRelatedProducts(attr.category_id);
  
  // Строим breadcrumbs
  const breadcrumbs = await buildBreadcrumbs(productData);
  
  return (
    <main className="shop-card">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Основной контент товара */}
      <section className="goods">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="goods-wrapper">
                
                {/* Галерея изображений */}
                <ProductGallery images={images} />
                
                {/* Информация о товаре */}
                <ProductInfo product={product} />
                
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Похожие товары */}
      <RelatedProducts products={relatedProducts} />
      
      {/* Табы: Описание, Характеристики, Отзывы */}
      <ProductTabs product={product} />
      
    </main>
  );
}
