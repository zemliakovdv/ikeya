import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ProductStickyBar from '@/components/product/ProductStickyBar';
import ProductMobileHeader from '@/components/product/ProductMobileHeader';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import SimilarProducts from '@/components/product/SimilarProducts';
import { getCachedCategoriesTree } from '@/lib/api/ikea';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

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
function buildBreadcrumbs(tree, attr, product, productName) {
  // Приоритет: готовые крошки от бэка
  const backCrumbs = Array.isArray(attr.breadcrumbs) && attr.breadcrumbs.length > 0
    ? attr.breadcrumbs : null;

  if (backCrumbs) {
    return [
      { name: 'Главная', href: '/' },
      ...backCrumbs.map(b => ({ name: b.title || b.name || '', href: b.url || null })).filter(b => b.name),
      { name: productName },
    ];
  }

  // Рекурсивный поиск пути в дереве
  function findPath(nodes, targetId, path = []) {
    for (const node of nodes) {
      const a = node.attributes || {};
      const current = { name: a.translated_name || a.name || 'Категория', href: `/catalog/${a.slug}` };
      if (String(node.id) === String(targetId)) return [...path, current];
      if (node.children?.length) {
        const found = findPath(node.children, targetId, [...path, current]);
        if (found) return found;
      }
    }
    return null;
  }

  // Собираем все возможные id категорий: основной + из relationships.categories
  const candidateIds = [
    product.relationships?.category?.data?.id,
    attr.category_id,
    ...((product.relationships?.categories?.data || []).map(c => c.id)),
  ].filter(Boolean);

  // Берём первый id для которого нашёлся путь в дереве
  let categoryPath = null;
  for (const id of candidateIds) {
    categoryPath = findPath(tree, id);
    if (categoryPath) break;
  }

  return [
    { name: 'Главная', href: '/' },
    ...(categoryPath || []),
    { name: productName },
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
    .map(r => {
      const product = r.value.data;
      // Бэк иногда отдаёт sku как массив — нормализуем до строки
      if (Array.isArray(product.attributes?.sku)) {
        product.attributes.sku = product.attributes.sku[0];
      }
      return product;
    });
}

// Группируем included_products по category_id, название группы — из дерева категорий
function groupIncludedProducts(products, tree) {
  // Ищем название категории в дереве по id
  function findCategoryName(nodes, targetId) {
    for (const node of nodes) {
      if (node.id === targetId) {
        return node.attributes?.translated_name || node.attributes?.name || null;
      }
      if (node.children?.length) {
        const found = findCategoryName(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  // Группируем по category_id
  const groupMap = new Map();
  for (const product of products) {
    const catId = product.attributes?.category_id;
    if (!catId) continue;
    if (!groupMap.has(catId)) {
      const name = findCategoryName(tree, catId) || 'Комплектующие';
      groupMap.set(catId, { groupName: name, products: [] });
    }
    groupMap.get(catId).products.push(product);
  }
  return Array.from(groupMap.values());
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

// Фильтруем local_images — убираем абсолютные пути файловой системы сервера
function sanitizeLocalImages(images) {
  if (!Array.isArray(images)) return [];
  return images.filter(img => img && (img.startsWith('/images/') || img.startsWith('http')));
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

  // Фильтруем текущий SKU из related — бэк иногда включает сам товар в список
  const relatedSkus = (Array.isArray(attr.related_products) ? attr.related_products : [])
    .filter(s => s !== sku && s !== String(sku))
    .slice(0, 10);

  // SKU для «Товары в комплекте» — иногда приходит в кривом формате
  const includedSkus = cleanSkuArray(attr.included_products).slice(0, 10);

  // Похожие товары грузим только если есть category_id
  const categoryId = product.relationships?.category?.data?.id || attr.category_id || null;

  // Параллельно грузим все три блока
  const [relatedProducts, includedProducts, similarProducts] = await Promise.all([
    getFullProducts(relatedSkus),
    getFullProducts(includedSkus),
    categoryId ? getSimilarProducts(categoryId, sku) : Promise.resolve([]),
  ]);

  const includedGroups = groupIncludedProducts(includedProducts, tree);

  // Фильтруем local_images — убираем пути файловой системы сервера
  const localImages = sanitizeLocalImages(attr.local_images);

  const breadcrumbs = buildBreadcrumbs(
    tree,
    attr,
    product,
    attr.small_desc_name || attr.name_ru || 'Товар'
  );

  return (
    <main className="shop-card">
      <Breadcrumbs items={breadcrumbs} />
      <ProductStickyBar product={product} />
      <ProductMobileHeader product={product} />

      <section className="goods">
        <div className="container">
          <div className="goods-wrapper">
            <ProductGallery images={localImages} />
            <ProductInfo product={product} includedGroups={includedGroups} />
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />
      <ProductTabs product={product} includedProducts={includedProducts} />
      <SimilarProducts products={similarProducts} />
    </main>
  );
}