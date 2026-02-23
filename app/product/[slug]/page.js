// app/product/[slug]/page.js
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import SimilarProducts from '@/components/product/SimilarProducts'; // Новая секция
import { getRelatedAndSimilarProducts } from '@/lib/utils/productHelpers';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const sku = extractSKU(slug);
  
  try {
    const productData = await getProduct(sku);
    if (!productData?.data?.attributes?.seo) return {};
    
    const seo = productData.data.attributes.seo;
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      robots: seo.robots,
    };
  } catch (error) {
    console.error('generateMetadata product error:', error);
    return {};
  }
}


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

// Получаем товары категории (новая функция)
async function getCategoryProducts(categoryId) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}/products`, {
      next: { revalidate: 300 }
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
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

export default async function ProductPage({ params }) {
  const { slug } = params;
  const sku = extractSKU(slug);
  
  const productData = await getProduct(sku);
  
  if (!productData || !productData.data) {
    notFound();
  }
  
  const product = productData.data;
  const attr = product.attributes;
  
  // Загружаем товары категории для рекомендаций
  const categoryProducts = await getCategoryProducts(attr.category_id);
  
  // Формируем рекомендации
  const { relatedProducts, similarProducts } = getRelatedAndSimilarProducts(product, categoryProducts);
  
  // Парсим изображения
  let images = [];
  try {
    images = attr.local_images ? JSON.parse(attr.local_images) : [];
  } catch (e) {
    console.error('Error parsing images:', e);
  }
  
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
      
      {/* 1. К этому товару подходят (НАД табами) */}
      <RelatedProducts products={relatedProducts} />
      
      {/* Табы: Описание, Характеристики, Отзывы */}
      <ProductTabs product={product} />
      
      {/* 2. Похожие товары (В КОНЦЕ) */}
      <SimilarProducts products={similarProducts} />
      
    </main>
  );
}
