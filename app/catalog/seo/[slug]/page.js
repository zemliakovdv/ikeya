import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import SeoProductCard from '@/components/catalog/products/SeoProductCard';
import { buildAssetUrl, SITE_URL } from '@/lib/config/api';
import { getSeoCatalogPageBySlug, getSeoCatalogPages } from '@/lib/api/seoCatalogPages';

export const revalidate = 3600;
export const dynamicParams = true;

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function getSafeSlug(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getRobotsConfig(page) {
  if (isPlainObject(page?.robots)) {
    return {
      index: page.robots.index !== false,
      follow: page.robots.follow !== false,
      raw: '',
    };
  }

  const raw = typeof page?.robots === 'string' ? page.robots.toLowerCase() : '';

  return {
    index: !raw.includes('noindex'),
    follow: !raw.includes('nofollow'),
    raw,
  };
}

function isPublishedPage(page) {
  return !!page && page.published !== false && page.is_active !== false;
}

function isIndexablePage(page) {
  if (!isPublishedPage(page)) return false;
  if (page.indexable === false) return false;
  if (page.noindex === true) return false;
  if (getRobotsConfig(page).index === false) return false;
  return true;
}

function buildCanonicalUrl(page, slug) {
  const explicit = typeof page?.canonical_url === 'string' ? page.canonical_url.trim() : '';
  if (explicit) {
    if (/^https?:\/\//i.test(explicit)) return explicit;
    if (explicit.startsWith('/')) return `${SITE_URL}${explicit}`;
  }
  return `${SITE_URL}/catalog/seo/${slug}`;
}

function resolveOgImage(page) {
  const candidate = typeof page?.og_image === 'string' ? page.og_image.trim() : '';
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return buildAssetUrl(candidate);
}

function normalizeProducts(page) {
  if (Array.isArray(page?.products?.data)) return page.products.data;
  if (Array.isArray(page?.products)) return page.products;
  if (Array.isArray(page?.items)) return page.items;
  if (Array.isArray(page?.products_data)) return page.products_data;
  return [];
}

function normalizeFilters(page) {
  const source = Array.isArray(page?.filters)
    ? page.filters
    : Array.isArray(page?.applied_filters)
      ? page.applied_filters
      : [];

  return source
    .map((filter) => {
      if (typeof filter === 'string') {
        return { key: filter, label: filter };
      }

      const title = filter?.label || filter?.name || filter?.title || '';
      const value = filter?.value;
      const label = title && value ? `${title}: ${value}` : (title || value);
      if (!label) return null;

      return {
        key: filter?.key || filter?.parameter || label,
        label: String(label),
      };
    })
    .filter(Boolean);
}

function buildBreadcrumbJsonLd(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => {
      const href = typeof item?.href === 'string' ? item.href.trim() : '';
      const absoluteUrl = href
        ? (href.startsWith('http') ? href : `${SITE_URL}${href.startsWith('/') ? href : `/${href}`}`)
        : undefined;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item?.name || item?.label || '',
        item: absoluteUrl,
      };
    }),
  };
}

function buildBreadcrumbItems(page, slug) {
  const currentTitle = page?.h1 || page?.title || slug;

  return [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: currentTitle, href: `/catalog/seo/${slug}` },
  ];
}

function buildRobotsMetadata(page) {
  if (!isIndexablePage(page)) {
    return {
      index: false,
      follow: getRobotsConfig(page).follow,
    };
  }

  const robotsConfig = getRobotsConfig(page);

  return {
    index: robotsConfig.index,
    follow: robotsConfig.follow,
  };
}

export async function generateStaticParams() {
  const pages = await getSeoCatalogPages();

  return pages
    .map((page) => getSafeSlug(page?.slug))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = getSafeSlug(resolvedParams?.slug);
  const page = await getSeoCatalogPageBySlug(slug);

  if (!page || !isPublishedPage(page)) {
    return {
      title: 'IKEYA',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = page.meta_title || page.title || page.h1 || 'IKEYA';
  const description = page.meta_description || page.description || '';
  const canonicalUrl = buildCanonicalUrl(page, slug);
  const ogImage = resolveOgImage(page);
  const robots = buildRobotsMetadata(page);

  const metadata = {
    title,
    description,
    robots,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'IKEYA',
      type: 'website',
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
    },
  };

  if (page.meta_keywords) {
    metadata.keywords = page.meta_keywords;
  }

  if (ogImage) {
    metadata.openGraph.images = [{ url: ogImage, alt: title }];
    metadata.twitter.images = [ogImage];
  }

  return metadata;
}

export default async function SeoCatalogPage({ params }) {
  const resolvedParams = await params;
  const slug = getSafeSlug(resolvedParams?.slug);
  const page = await getSeoCatalogPageBySlug(slug);

  if (!page || !isPublishedPage(page)) {
    notFound();
  }

  const title = page.h1 || page.title || 'Подборка IKEYA';
  const description = typeof page.description === 'string' ? page.description.trim() : '';
  const catalogUrl = typeof page.catalog_url === 'string' ? page.catalog_url.trim() : '';
  const products = normalizeProducts(page).filter((product) => isPlainObject(product));
  const filters = normalizeFilters(page);
  const seoText = typeof page.seo_text === 'string' ? page.seo_text.trim() : '';
  const breadcrumbs = buildBreadcrumbItems(page, slug);

  return (
    <main className="main catalog-inner">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="all-catalog">
        <div className="container">
          <h1>{title}</h1>

          {description ? (
            <div className="all-catalog-empty" style={{ marginBottom: '24px' }}>
              <p>{description}</p>
            </div>
          ) : null}

          {filters.length > 0 ? (
            <div className="catalog-page-filter-chips" style={{ marginBottom: '24px' }}>
              {filters.map((filter) => (
                <span
                  key={filter.key}
                  className="filter-chip active"
                  style={{ display: 'inline-flex', marginRight: '8px', marginBottom: '8px' }}
                >
                  {filter.label}
                </span>
              ))}
            </div>
          ) : null}

          {catalogUrl ? (
            <div style={{ marginBottom: '24px' }}>
              <a href={catalogUrl}>Открыть в каталоге</a>
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product, index) => {
                const productKey =
                  product.id ||
                  product.sku ||
                  product.attributes?.sku ||
                  product.attributes?.id ||
                  index;

                return (
                <SeoProductCard
                  key={`${productKey}-${slug}`}
                  product={product}
                />
                );
              })}
            </div>
          ) : (
            <div className="all-catalog-empty">
              <p>Товары для этой подборки пока не найдены.</p>
            </div>
          )}

          {seoText ? (
            <section className="seo">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="seo-inner">
                      <div
                        className="seo-text-content seo-text-content--expanded"
                        // Backend must return sanitized HTML for SEO text blocks.
                        dangerouslySetInnerHTML={{ __html: seoText }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
