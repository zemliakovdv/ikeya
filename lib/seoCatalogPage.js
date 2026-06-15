import { buildAssetUrl, SITE_URL } from '@/lib/config/api';

export function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function getSafeSlug(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getSafeText(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizeRelativeCatalogPath(path, fallbackPath) {
  const normalized = getSafeText(path);

  if (!normalized) {
    return fallbackPath;
  }

  const withLeadingSlash = normalized.startsWith('/')
    ? normalized
    : `/${normalized.replace(/^\/+/, '')}`;

  return withLeadingSlash.replace(/^\/catalog\/seo\//, '/catalog/');
}

export function normalizeSeoCatalogPath(path, slug) {
  const safeSlug = getSafeSlug(slug);
  const fallbackPath = safeSlug ? `/catalog/${safeSlug}` : '/catalog';
  const normalized = getSafeText(path);

  if (!normalized) {
    return fallbackPath;
  }

  if (/^https?:\/\//i.test(normalized)) {
    try {
      const url = new URL(normalized);
      return `${url.pathname.replace(/^\/catalog\/seo\//, '/catalog/')}${url.search}${url.hash}`;
    } catch {
      return normalizeRelativeCatalogPath(normalized, fallbackPath);
    }
  }

  return normalizeRelativeCatalogPath(normalized, fallbackPath);
}

export function getRobotsConfig(page) {
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

export function normalizeSeoCatalogProducts(page) {
  if (Array.isArray(page?.products?.data)) return page.products.data;
  if (Array.isArray(page?.products)) return page.products;
  if (Array.isArray(page?.items)) return page.items;
  return [];
}

export function getSeoCatalogUiFilters(page) {
  if (Array.isArray(page?.available_filters)) return page.available_filters;
  if (Array.isArray(page?.filters)) return page.filters;
  return [];
}

export function isPublishedSeoCatalogPage(page) {
  return !!page && page.published !== false && page.is_active !== false;
}

function hasProductsSnapshot(page) {
  return normalizeSeoCatalogProducts(page).some((product) => isPlainObject(product));
}

function getProductsCount(page) {
  const value = Number(page?.products_count);
  if (Number.isFinite(value)) return value;
  return normalizeSeoCatalogProducts(page).length;
}

export function isIndexableSeoCatalogPage(page) {
  if (!isPublishedSeoCatalogPage(page)) return false;
  if (page?.indexable !== true) return false;
  if (page?.noindex === true) return false;
  if (getRobotsConfig(page).index === false) return false;
  if (getProductsCount(page) <= 0) return false;
  if (!hasProductsSnapshot(page)) return false;
  return true;
}

export function resolveAbsoluteUrl(value) {
  const candidate = getSafeText(value);
  if (!candidate) return '';
  if (/^https?:\/\//i.test(candidate)) return candidate;
  if (candidate.startsWith('/')) return `${SITE_URL}${candidate}`;
  return `${SITE_URL}/${candidate.replace(/^\/+/, '')}`;
}

export function buildSeoCatalogCanonicalPath(page, slug) {
  const candidate =
    getSafeText(page?.canonical_path) ||
    getSafeText(page?.path) ||
    `/catalog/${getSafeSlug(slug)}`;

  return normalizeSeoCatalogPath(candidate, slug);
}

export function buildSeoCatalogCanonicalUrl(page, slug) {
  return resolveAbsoluteUrl(buildSeoCatalogCanonicalPath(page, slug));
}

export function resolveSeoCatalogUrl(page, slug) {
  const explicit = getSafeText(page?.catalog_url);
  if (explicit) {
    return normalizeSeoCatalogPath(explicit, slug);
  }

  const path = getSafeText(page?.path);
  if (path.startsWith('/catalog/')) {
    return normalizeSeoCatalogPath(path, slug);
  }

  return '/catalog';
}

export function resolveSeoCatalogOgImage(page) {
  const candidate = getSafeText(page?.og_image);
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return buildAssetUrl(candidate);
}

export function buildSeoCatalogBreadcrumbItems(page, slug) {
  const currentTitle = page?.h1 || page?.title || slug;
  const currentPath = buildSeoCatalogCanonicalPath(page, slug);

  return [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: currentTitle, href: currentPath },
  ];
}

export function buildSeoCatalogBreadcrumbJsonLd(breadcrumbs) {
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

export function buildSeoCatalogRobotsMetadata(page) {
  if (!isIndexableSeoCatalogPage(page)) {
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

export function buildSeoCatalogMetadata(page, slug) {
  const title = page.meta_title || page.title || page.h1 || 'IKEYA';
  const description = page.meta_description || page.description || '';
  const canonicalUrl = buildSeoCatalogCanonicalUrl(page, slug);
  const ogImage = resolveSeoCatalogOgImage(page);
  const robots = buildSeoCatalogRobotsMetadata(page);

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
