import { notFound, redirect } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ProductStickyBar from '@/components/product/ProductStickyBar';
import ProductMobileHeader from '@/components/product/ProductMobileHeader';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import SimilarProducts from '@/components/product/SimilarProducts';
import { getCachedCategoriesTree } from '@/lib/api/ikea';
import {
  findCategoryPathByIkeaId,
  buildProductBreadcrumbs,
  normalizeFallbackBreadcrumbs,
} from '@/lib/utils/categoryHelpers';

import { buildApiUrl, SITE_URL } from '@/lib/config/api';

function cleanSkuArray(rawArray) {
  if (!rawArray || !Array.isArray(rawArray)) return [];

  if (rawArray.every((s) => typeof s === 'string' && /^[a-zA-Z0-9]+$/.test(s.trim()))) {
    return rawArray.map((s) => s.trim()).filter(Boolean);
  }

  const joined = rawArray.join(',');
  return joined
    .replace(/[\[\]\\"]/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractSKU(slug) {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  return /^\d+$/.test(last) ? last : slug;
}

function getProductTitle(attr = {}) {
  return attr.small_desc_name || attr.name_ru || attr.name || 'Товар';
}

function parsePrice(value) {
  const normalized = String(value ?? 0).replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildBreadcrumbs(tree, attr, product, productName) {
  const backCrumbs = Array.isArray(attr.breadcrumbs) && attr.breadcrumbs.length > 0
    ? attr.breadcrumbs
    : null;

  if (backCrumbs) {
    return [
      { name: 'Главная', href: '/' },
      { name: 'Каталог', href: '/catalog' },
      ...backCrumbs
        .map((b) => ({ name: b.title || b.name || '', href: b.url || null }))
        .filter((b) => b.name),
      { name: productName },
    ];
  }

  function findPath(nodes, targetId, path = []) {
    for (const node of nodes) {
      const a = node.attributes || {};
      const current = {
        name: a.translated_name || a.name || 'Категория',
        href: `/catalog/${a.slug}`,
      };

      if (String(node.id) === String(targetId)) return [...path, current];

      if (node.children?.length) {
        const found = findPath(node.children, targetId, [...path, current]);
        if (found) return found;
      }
    }

    return null;
  }

  const candidateIds = [
    product.relationships?.category?.data?.id,
    attr.category_id,
    ...((product.relationships?.categories?.data || []).map((c) => c.id)),
  ].filter(Boolean);

  let categoryPath = null;
  for (const id of candidateIds) {
    categoryPath = findPath(tree, id);
    if (categoryPath) break;
  }

  return [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    ...(categoryPath || []),
    { name: productName },
  ];
}

async function getProduct(sku) {
  try {
    const res = await fetch(buildApiUrl(`/products/${sku}`), { next: { revalidate: 60 } });
    const payload = await res.json().catch(() => null);

    if (res.ok) {
      return {
        status: res.status,
        data: payload?.data || null,
        code: null,
      };
    }

    const code =
      payload?.code ||
      payload?.error?.code ||
      payload?.errors?.[0]?.code ||
      null;

    return {
      status: res.status,
      data: null,
      code,
    };
  } catch {
    return {
      status: 500,
      data: null,
      code: null,
    };
  }
}

async function getFullProducts(skus = []) {
  if (!skus.length) return [];

  const results = await Promise.allSettled(
    skus.map((sku) =>
      fetch(buildApiUrl(`/products/${sku}`), { next: { revalidate: 60 } })
        .then((r) => (r.ok ? r.json() : null))
    )
  );

  return results
    .filter((r) => r.status === 'fulfilled' && r.value?.data)
    .map((r) => {
      const product = r.value.data;

      if (Array.isArray(product.attributes?.sku)) {
        product.attributes.sku = product.attributes.sku[0];
      }

      return product;
    });
}

function groupIncludedProducts(products, tree) {
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

async function getSimilarProducts(categoryId, excludeSku) {
  try {
    const res = await fetch(
      buildApiUrl(`/categories/${categoryId}/products?per_page=10`),
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return (data.data || []).filter((p) => p.attributes?.sku !== excludeSku);
  } catch {
    return [];
  }
}

function sanitizeLocalImages(images) {
  if (!Array.isArray(images)) return [];

  return images.filter((img) => img && (img.startsWith('/images/') || img.startsWith('http')));
}

function buildStructuredData(attr, sku) {
  const productUrl = `https://ikeya.by/product/${attr.slug ? `${attr.slug}-${sku}` : sku}`;
  const price = parsePrice(attr.price_byn);

  const structuredData = attr.structured_data
    ? { ...attr.structured_data }
    : {
        "@context": "https://schema.org",
        "@type": "Product",
        name: getProductTitle(attr),
        description: attr.seo?.description || getProductTitle(attr),
        sku,
        mpn: sku,
        image: sanitizeLocalImages(attr.local_images).map(
          (img) => img.startsWith('http') ? img : `https://ikeya.by${img}`
        ),
        url: productUrl,
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "BYN",
          price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      };

  const ratingCount = Number(attr.rating_count || 0);
  const ratingAvg = parseFloat(attr.rating_weighted ?? attr.rating_avg ?? 0);

  if (ratingCount > 0 && ratingAvg > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingAvg.toFixed(1),
      reviewCount: ratingCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return structuredData;
}

export async function generateMetadata({ params }) {
  const lastSlugPart = params?.slug?.[params.slug.length - 1];

  if (!lastSlugPart) {
    return {
      title: 'Товар | IKEYA',
      description: 'Карточка товара в интернет-магазине IKEYA.',
    };
  }

  const sku = extractSKU(lastSlugPart);
  const productResponse = await getProduct(sku);
  const isKnownProduct404Code =
    productResponse?.code === 'product_not_found' ||
    productResponse?.code === 'product_unavailable';

  // Важно: 404 должен выбрасываться на этапе metadata до stream/flush.
  // Некоторые бэкенд-ответы могут приходить с code без HTTP 404.
  if (isKnownProduct404Code) {
    notFound();
  }

  if (!productResponse?.data) {
    return {
      title: 'Товар | IKEYA',
      description: 'Карточка товара в интернет-магазине IKEYA.',
    };
  }

  const attr = productResponse.data.attributes || {};

  const productTitle = getProductTitle(attr);
  const seo = attr.seo || {};

  const title = seo.title || `${productTitle} купить в Беларуси | IKEYA`;
  const description = seo.description || `Купить ${productTitle} в интернет-магазине IKEYA. Доставка по Беларуси.`;

  const metadata = { title, description };

  if (seo.keywords) metadata.keywords = seo.keywords;
  if (seo.robots) metadata.robots = seo.robots;

  // Сначала объявляем canonicalPath
  const canonicalPath = attr.url || `/product/${attr.slug ? `${attr.slug}-${attr.sku || sku}` : sku}`;
  const canonicalUrl = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  const imageUrl = attr.local_images?.[0]
    ? `https://ikeya.by${attr.local_images[0]}`
    : 'https://ikeya.by/assets/img/og-default.jpg';

  metadata.alternates = { canonical: canonicalUrl };

  metadata.openGraph = {
    title,
    description,
    url: canonicalUrl,
    siteName: 'IKEYA',
    images: [{ url: imageUrl, width: 1200, height: 630, alt: productTitle }],
    type: 'website',
  };

  metadata.twitter = {
    card: 'summary_large_image',
    title,
    description,
    images: [imageUrl],
  };

  return metadata;
}

export default async function ProductPage({ params }) {
  const sku = extractSKU(params.slug[params.slug.length - 1]);
  const productResponse = await getProduct(sku);
  const isKnownProduct404Code =
    productResponse?.code === 'product_not_found' ||
    productResponse?.code === 'product_unavailable';

  if (isKnownProduct404Code) {
    notFound();
  }

  if (!productResponse?.data) notFound();

  const tree = await getCachedCategoriesTree();

  const product = productResponse.data;
  const attr = product.attributes;

  const currentSlugStr = params.slug[params.slug.length - 1];
  const expectedSlug = attr.slug ? `${attr.slug}-${sku}` : sku;

  if (currentSlugStr !== expectedSlug) {
    redirect(`/product/${expectedSlug}`);
  }

  const relatedSkus = (Array.isArray(attr.related_products) ? attr.related_products : [])
    .filter((s) => s !== sku && s !== String(sku))
    .slice(0, 10);

  const includedSkus = cleanSkuArray(attr.included_products).slice(0, 10);

  const categoryId = product.relationships?.category?.data?.id || attr.category_id || null;

  const [relatedProducts, includedProducts, similarProducts] = await Promise.all([
    getFullProducts(relatedSkus),
    getFullProducts(includedSkus),
    categoryId ? getSimilarProducts(categoryId, sku) : Promise.resolve([]),
  ]);

  const includedGroups = groupIncludedProducts(includedProducts, tree);
  const localImages = sanitizeLocalImages(attr.local_images);
  const productName = getProductTitle(attr);
  const candidateCategoryIds = [
    product.relationships?.category?.data?.id,
    attr.category_id,
    ...((product.relationships?.categories?.data || []).map((c) => c.id)),
  ].filter(Boolean);

  let categoryChain = [];
  for (const id of candidateCategoryIds) {
    const categoryPath = findCategoryPathByIkeaId(tree, id);
    if (categoryPath.length > 0) {
      categoryChain = categoryPath;
      break;
    }
  }

  const breadcrumbs = categoryChain.length > 0
    ? buildProductBreadcrumbs(categoryChain, productName)
    : normalizeFallbackBreadcrumbs(attr.breadcrumbs, productName);
  const structuredData = buildStructuredData(attr, sku);

  return (
    <main className="shop-card">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
