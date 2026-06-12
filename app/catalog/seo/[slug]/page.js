import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import SeoCatalogClient from '@/components/catalog/seo/SeoCatalogClient';
import SeoSection from '@/components/home/SeoSection';
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

function getSafeText(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function getRobotsConfig(page) {
  if (isPlainObject(page?.robots)) {
    return {
      index: page.robots.index !== false,
      follow: page.robots.follow !== false,
    };
  }

  const raw = getSafeText(page?.robots).toLowerCase();

  return {
    index: !raw.includes('noindex'),
    follow: !raw.includes('nofollow'),
  };
}

function normalizeProducts(page) {
  if (Array.isArray(page?.products?.data)) return page.products.data;
  if (Array.isArray(page?.products)) return page.products;
  if (Array.isArray(page?.items)) return page.items;
  return [];
}

function getUiFilters(page) {
  if (Array.isArray(page?.available_filters)) return page.available_filters;
  if (Array.isArray(page?.filters)) return page.filters;
  return [];
}

function isPublishedPage(page) {
  return !!page && page.published !== false && page.is_active !== false;
}

function hasProductsSnapshot(page) {
  return normalizeProducts(page).some((product) => isPlainObject(product));
}

function getProductsCount(page) {
  const value = Number(page?.products_count);
  if (Number.isFinite(value)) return value;
  return normalizeProducts(page).length;
}

function isIndexablePage(page) {
  if (!isPublishedPage(page)) return false;
  if (page?.indexable !== true) return false;
  if (page?.noindex === true) return false;
  if (getRobotsConfig(page).index === false) return false;
  if (getProductsCount(page) <= 0) return false;
  if (!hasProductsSnapshot(page)) return false;
  return true;
}

function resolveAbsoluteUrl(value) {
  const candidate = getSafeText(value);
  if (!candidate) return '';
  if (/^https?:\/\//i.test(candidate)) return candidate;
  if (candidate.startsWith('/')) return `${SITE_URL}${candidate}`;
  return `${SITE_URL}/${candidate.replace(/^\/+/, '')}`;
}

function buildCanonicalUrl(page, slug) {
  const candidate =
    getSafeText(page?.canonical_path) ||
    getSafeText(page?.path) ||
    `/catalog/seo/${slug}`;

  return resolveAbsoluteUrl(candidate);
}

function resolveCatalogUrl(page) {
  const explicit = getSafeText(page?.catalog_url);
  if (explicit) return explicit;

  const path = getSafeText(page?.path);
  if (path.startsWith('/catalog/') && !path.startsWith('/catalog/seo/')) {
    return path;
  }

  return '/catalog';
}

function resolveOgImage(page) {
  const candidate = getSafeText(page?.og_image);
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return buildAssetUrl(candidate);
}

function buildBreadcrumbJsonLd(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => {
      const href = getSafeText(item?.href);
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
      follow: true,
    };
  }

  return {
    index: true,
    follow: getRobotsConfig(page).follow,
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
  const description = getSafeText(page.description);
  const breadcrumbs = buildBreadcrumbItems(page, slug);
  const seoText = getSafeText(page.seo_text);
  const products = normalizeProducts(page).filter((product) => isPlainObject(product));
  const filters = getUiFilters(page);
  const catalogUrl = resolveCatalogUrl(page);

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

          <SeoCatalogClient
            initialProducts={products}
            filters={filters}
            catalogUrl={catalogUrl}
          />

          {seoText ? <SeoSection seoText={seoText} /> : null}
        </div>
      </section>
    </main>
  );
}
