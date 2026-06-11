import { buildApiUrl } from '@/lib/config/api';

const SEO_PAGE_REVALIDATE = 3600;

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
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

function isIndexablePage(page) {
  if (!isPlainObject(page)) return false;
  if (page.published === false) return false;
  if (page.is_active === false) return false;
  if (page.indexable === false) return false;
  if (page.noindex === true) return false;
  if (getRobotsConfig(page).index === false) return false;
  return true;
}

function normalizePagesList(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.pages)) return response.pages;
  if (Array.isArray(response)) return response;
  return [];
}

function normalizePage(response) {
  if (isPlainObject(response?.data)) return response.data;
  if (isPlainObject(response?.page)) return response.page;
  if (isPlainObject(response)) return response;
  return null;
}

export async function getSeoCatalogPages() {
  try {
    const response = await fetch(buildApiUrl('/seo_catalog_pages'), {
      next: { revalidate: SEO_PAGE_REVALIDATE },
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    const pages = normalizePagesList(payload);

    return pages.filter((page) => {
      const slug = typeof page?.slug === 'string' ? page.slug.trim() : '';
      return slug && isIndexablePage(page);
    });
  } catch (error) {
    console.error('getSeoCatalogPages error:', error?.message || error);
    return [];
  }
}

export async function getSeoCatalogPageBySlug(slug) {
  const safeSlug = typeof slug === 'string' ? slug.trim() : '';

  if (!safeSlug) {
    return null;
  }

  try {
    const response = await fetch(buildApiUrl(`/seo_catalog_pages/${encodeURIComponent(safeSlug)}`), {
      next: { revalidate: SEO_PAGE_REVALIDATE },
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return normalizePage(payload);
  } catch (error) {
    console.error(`getSeoCatalogPageBySlug error for "${safeSlug}":`, error?.message || error);
    return null;
  }
}
