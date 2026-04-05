// app/product/[...slug]/page.js
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ProductStickyBar from '@/components/product/ProductStickyBar';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import SimilarProducts from '@/components/product/SimilarProducts';
import { getCachedCategoriesTree } from '@/lib/api/ikea';


const API_BASE_URL = 'http://45.135.234.22/api/v1';

// Извлекаем SKU из последнего сегмента slug
// Если slug — чистое число (например "20530664"), возвращаем его как есть
// Если slug содержит дефисы (например "lvdalen-20530664"), берём последний сегмент
function extractSKU(slug) {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  // Если последний сегмент — число, это SKU
  if (/^\d+$/.test(last)) return last;
  // Если весь slug — число (передали SKU напрямую)
  if (/^\d+$/.test(slug)) return slug;
  // Иначе возвращаем как есть (fallback)
  return slug;
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

// Строим breadcrumbs из дерева категорий
function buildProductBreadcrumbs(treeData, categoryId, attr) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
  ];

  // Ищем категорию рекурсивно по id в оригинальном дереве
  function findById(nodeList, id) {
    for (const node of nodeList) {
      if (node?.id === String(id)) return { node, ancestors: [] };
      const children = node.children || [];
      if (children.length) {
        const result = findById(children, id);
        if (result) return { node: result.node, ancestors: [node, ...result.ancestors] };
      }
    }
    return null;
  }

  const roots = Array.isArray(treeData) ? treeData : [];
  const found = findById(roots, categoryId);

  if (found) {
    // ancestors идут от корня к родителю
    const chain = [...found.ancestors, found.node];
    let currentPath = '/catalog';
    chain.forEach(c => {
      const slug = c.attributes?.slug;
      const name = c.attributes?.translated_name || c.attributes?.name;
      if (slug && name) {
        currentPath += `/${slug}`;
        breadcrumbs.push({ name, href: currentPath });
      }
    });
  }

  breadcrumbs.push({
    name: attr.small_desc_name || attr.name_ru || attr.name,
    href: null,
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

  const [productData, tree] = await Promise.all([
    getProduct(sku),
    getCachedCategoriesTree(),
  ]);

  if (!productData || !productData.data) {
    notFound();
  }

  const product = productData.data;
  const attr = product.attributes;

  // included_products — "К этому товару подходят" (приходит как массив JSON-строк)
  const includedSkus = (() => {
    const raw = attr.included_products || [];
    try {
      const parsed = typeof raw[0] === 'string' && raw[0].startsWith('[')
        ? JSON.parse(raw[0])
        : raw;
      return parsed.slice(0, 10);
    } catch {
      return raw.slice(0, 10);
    }
  })();

  // related_products — "Похожие товары"
  const relatedSkus = (Array.isArray(attr.related_products) ? attr.related_products : []).slice(0, 10);

  const [relatedProducts, similarProducts] = await Promise.all([
    getProductsBySKUs(includedSkus),
    getProductsBySKUs(relatedSkus),
  ]);

  // Изображения
  const images = Array.isArray(attr.local_images) ? attr.local_images : [];

  const breadcrumbs = buildProductBreadcrumbs(tree, attr.category_id, attr);

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