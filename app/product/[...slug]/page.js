// app/product/[...slug]/page.js
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import SimilarProducts from '@/components/product/SimilarProducts';
import { getRelatedAndSimilarProducts } from '@/lib/utils/productHelpers';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

// Извлекаем SKU из последнего сегмента slug
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

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Получаем товары категории
async function getCategoryProducts(categoryId) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}/products`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) return [];

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

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Строим breadcrumbs из категорий — используем slug в URL
async function buildBreadcrumbs(productData) {
  const product = productData.data;
  const attr = product.attributes;

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' }
  ];

  let currentCategory = null;
  if (productData.included && productData.included.length > 0) {
    currentCategory = productData.included.find(item => item.type === 'category');
  }

  if (!currentCategory && attr.category_id) {
    currentCategory = await getCategory(attr.category_id);
  }

  if (currentCategory) {
    const parentIds = currentCategory.attributes.parent_ids || [];

    const parentCategories = [];
    for (const parentId of parentIds) {
      const parent = await getCategory(parentId);
      if (parent) parentCategories.push(parent);
    }

    // Строим путь от корня — используем slug
    let currentPath = '/catalog';
    for (const parentId of parentIds) {
      const parent = parentCategories.find(cat => cat.id === parentId);
      if (parent) {
        currentPath += `/${parent.attributes.slug}`; // ✅
        breadcrumbs.push({
          name: parent.attributes.translated_name || parent.attributes.name,
          href: currentPath
        });
      }
    }

    // Текущая категория — тоже slug
    currentPath += `/${currentCategory.attributes.slug}`; // ✅
    breadcrumbs.push({
      name: currentCategory.attributes.translated_name || currentCategory.attributes.name,
      href: currentPath
    });
  }

  // Товар — без ссылки
  breadcrumbs.push({
    name: attr.name_ru || attr.name,
    href: null
  });

  return breadcrumbs;
}

export async function generateMetadata({ params }) {
  const slugParts = params.slug; // ['slug-kategorii', 'slug-tovara-60234534']
  const productSlug = slugParts[slugParts.length - 1];
  const sku = extractSKU(productSlug);

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

export default async function ProductPage({ params }) {
  const slugParts = params.slug; // ['slug-kategorii', 'slug-tovara-60234534']
  const productSlug = slugParts[slugParts.length - 1];
  const sku = extractSKU(productSlug);

  const productData = await getProduct(sku);

  if (!productData || !productData.data) {
    notFound();
  }

  const product = productData.data;
  const attr = product.attributes;

  const categoryProducts = await getCategoryProducts(attr.category_id);
  const { relatedProducts, similarProducts } = getRelatedAndSimilarProducts(product, categoryProducts);

  let images = [];
  try {
    images = attr.local_images ? JSON.parse(attr.local_images) : [];
  } catch (e) {
    console.error('Error parsing images:', e);
  }

  const breadcrumbs = await buildBreadcrumbs(productData);

  return (
    <main className="shop-card">
      <Breadcrumbs items={breadcrumbs} />

      <section className="goods">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="goods-wrapper">
                <ProductGallery images={images} />
                <ProductInfo product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />
      <ProductTabs product={product} />
      <SimilarProducts products={similarProducts} />
    </main>
  );
}
