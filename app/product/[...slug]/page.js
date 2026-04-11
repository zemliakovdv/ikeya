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

// Очистка артикулов — обрабатывает два формата:
// 1. Нормальный: ["60489549", "00417621", ...] → возвращаем как есть
// 2. Кривой:     ["[\"60489549,00417621\""]   → парсим через join+split
function cleanSkuArray(rawArray) {
  if (!rawArray || !Array.isArray(rawArray)) return [];
  // Если все элементы — чистые SKU (только буквы и цифры) → нормальный формат
  if (rawArray.every(s => typeof s === 'string' && /^[a-zA-Z0-9]+$/.test(s.trim()))) {
    return rawArray.map(s => s.trim()).filter(Boolean);
  }
  // Кривой формат — склеиваем через запятую и разбиваем обратно
  const joined = rawArray.join(',');
  return joined.replace(/[\[\]\\"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
}

function extractSKU(slug) {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  return /^\d+$/.test(last) ? last : slug;
}

// Строим хлебные крошки из дерева категорий по category_id
function buildBreadcrumbs(tree, categoryId, productName) {
  // Рекурсивно ищем путь до нужной категории
  function findPath(nodes, targetId, path = []) {
    for (const node of nodes) {
      const a = node.attributes || {};
      const current = { name: a.translated_name || a.name || 'Категория', href: `/catalog/${a.slug}` };
      if (node.id === targetId) return [...path, current];
      if (node.children?.length) {
        const found = findPath(node.children, targetId, [...path, current]);
        if (found) return found;
      }
    }
    return null;
  }

  const categoryPath = findPath(tree, categoryId) || [];

  return [
    { name: 'Главная', href: '/' },
    ...categoryPath,
    { name: productName }, // последний элемент без ссылки
  ];
}

// Загрузка одного товара по SKU
async function getProduct(sku) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${sku}`, { next: { revalidate: 60 } });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// Загрузка нескольких товаров по массиву SKU (параллельно)
// Используется для related_products и included_products
async function getFullProducts(skus = []) {
  if (!skus.length) return [];
  const results = await Promise.allSettled(
    skus.map(sku =>
      fetch(`${API_BASE_URL}/products/${sku}`, { next: { revalidate: 60 } })
        .then(r => r.ok ? r.json() : null)
    )
  );
  return results
    .filter(r => r.status === 'fulfilled' && r.value?.data)
    .map(r => r.value.data);
}

// Похожие товары: берём из той же категории, исключаем текущий товар
async function getSimilarProducts(categoryId, excludeSku) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories/${categoryId}/products?per_page=10`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).filter(p => p.attributes?.sku !== excludeSku);
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }) {
  const sku = extractSKU(params.slug[params.slug.length - 1]);

  const [productData, tree] = await Promise.all([
    getProduct(sku),
    getCachedCategoriesTree(),
  ]);

  if (!productData?.data) notFound();

  const product = productData.data;
  const attr = product.attributes;

  // SKU для «С этим товаром покупают» — attr.related_products[]
  const relatedSkus = Array.isArray(attr.related_products)
    ? attr.related_products.slice(0, 10)
    : [];

  // SKU для «Товары в комплекте» — attr.included_products[] (иногда приходит в кривом формате)
  const includedSkus = cleanSkuArray(attr.included_products).slice(0, 10);

  // Параллельно грузим все три блока
  const [relatedProducts, includedProducts, similarProducts] = await Promise.all([
    getFullProducts(relatedSkus),                       // С этим товаром покупают
    getFullProducts(includedSkus),                      // Товары в комплекте (для ItemsTab)
    getSimilarProducts(attr.category_id, sku),          // Похожие товары
  ]);

  const breadcrumbs = buildBreadcrumbs(
    tree,
    product.relationships?.category?.data?.id || attr.category_id,
    attr.small_desc_name || attr.name_ru || 'Товар'
  );

  return (
    <main className="shop-card">
      <Breadcrumbs items={breadcrumbs} />
      <ProductStickyBar product={product} />

      <section className="goods">
        <div className="container">
          <div className="goods-wrapper">
            <ProductGallery images={attr.local_images || []} />
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      {/* С этим товаром покупают — attr.related_products[] */}
      <RelatedProducts products={relatedProducts} />

      {/* Табы товара, внутри таба «Предметы» — attr.included_products[] */}
      <ProductTabs product={product} includedProducts={includedProducts} />

      {/* Похожие товары — 10 товаров из той же категории */}
      <SimilarProducts products={similarProducts} />
    </main>
  );
}