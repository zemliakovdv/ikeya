import { SITE_URL } from '@/lib/config/api';
import { getSeoCatalogPages } from '@/lib/api/seoCatalogPages';
import { normalizeSeoCatalogPath } from '@/lib/seoCatalogPage';

function normalizeDate(value) {
  if (!value) return undefined;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function shouldIncludeSeoPage(page) {
  const hasProductsCount = page?.products_count !== undefined && page?.products_count !== null;
  const productsCount = Number(page?.products_count);

  if (hasProductsCount && productsCount === 0 && page?.indexable !== true) {
    return false;
  }

  return true;
}

function buildSeoPageEntry(page) {
  const slug = typeof page?.slug === 'string' ? page.slug.trim() : '';
  if (!slug) return null;

  const lastModified = normalizeDate(page?.updated_at) || normalizeDate(page?.generated_at);
  const path = normalizeSeoCatalogPath(page?.canonical_path || page?.path, slug);

  return {
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency: 'weekly',
    priority: 0.8,
  };
}

export default async function sitemap() {
  const seoPages = await getSeoCatalogPages({ sitemap: true });

  const staticEntries = [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/catalog` },
  ];

  const seoEntries = seoPages
    .filter(shouldIncludeSeoPage)
    .map(buildSeoPageEntry)
    .filter(Boolean);

  return [...staticEntries, ...seoEntries];
}
