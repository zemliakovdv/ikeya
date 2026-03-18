// app/product/[...slug]/page.js
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ProductStickyBar from '@/components/product/ProductStickyBar';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import SimilarProducts from '@/components/product/SimilarProducts';


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

// Загружаем товары по массиву SKU (related_products)
async function getProductsBySKUs(skus = []) {
  if (!skus.length) return [];
  try {
    const results = await Promise.allSettled(
      skus.map(sku =>
        fetch(`${API_BASE_URL}/products/${sku}`, { next: { revalidate: 300 } })
          .then(r => r.ok ? r.json() : null)
          .then(data => data?.data || null)
      )
    );
    return results
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => r.value);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Получаем похожие товары из той же категории
async function getCategoryProducts(categoryId, excludeSku) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories/${categoryId}/products?per_page=10`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).filter(p => p.attributes?.sku !== excludeSku);
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

// Строим breadcrumbs из данных API
function buildBreadcrumbs(attr) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
  ];

  // Используем breadcrumbs из API если есть
  if (Array.isArray(attr.breadcrumbs) && attr.breadcrumbs.length > 0) {
    attr.breadcrumbs.forEach(crumb => {
      if (crumb.title && crumb.url) {
        breadcrumbs.push({ name: crumb.title, href: crumb.url });
      }
    });
  }

  // Добавляем сам товар в конец
  breadcrumbs.push({
    name: attr.name_ru || attr.name,
    href: null
  });

  return breadcrumbs;
}

export async function generateMetadata({ params }) {
  const slugParts = params.slug;
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
    return {};
  }
}

export default async function ProductPage({ params }) {
  const slugParts = params.slug;
  const productSlug = slugParts[slugParts.length - 1];
  const sku = extractSKU(productSlug);

  const productData = await getProduct(sku);

  if (!productData || !productData.data) {
    notFound();
  }

  const product = productData.data;
  const attr = product.attributes;

  // Загружаем related и similar параллельно
  const relatedSkus = Array.isArray(attr.related_products) ? attr.related_products : [];

  const [relatedProducts, similarProducts] = await Promise.all([
    getProductsBySKUs(relatedSkus),
    getCategoryProducts(attr.category_id, attr.sku),
  ]);

  // Изображения
  const images = Array.isArray(attr.local_images) ? attr.local_images : [];

  // Breadcrumbs из API
  const breadcrumbs = buildBreadcrumbs(attr);

  return (
    <main className="shop-card">
      <Breadcrumbs items={breadcrumbs} />
      <ProductStickyBar product={product} />

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