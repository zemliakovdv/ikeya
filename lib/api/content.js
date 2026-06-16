// lib/api/content.js

import { buildApiUrl } from '@/lib/config/api';

const LEGAL_PAGES_ENDPOINT = '/content/legal_pages';

function buildContentFetchOptions(options = {}) {
  const fetchOptions = { ...options };

  if (!fetchOptions.cache && !fetchOptions.next) {
    fetchOptions.next = { revalidate: 300 };
  }

  return fetchOptions;
}

async function fetchContentAPI(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  const fetchOptions = buildContentFetchOptions(options);

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      const err = new Error(`API Error: ${res.status}`);
      err.status = res.status;
      throw err;
    }

    return await res.json();
  } catch (error) {
    console.error('Content API Error:', endpoint, error.message);
    throw error;
  }
}

function normalizeLegalPagesResponse(response) {
  const candidates = [
    response?.data,
    response?.data?.data,
    response?.items,
    response,
  ];

  const pages = candidates.find(Array.isArray) || [];

  return pages.filter((page) => page?.attributes?.slug && page?.attributes?.title);
}

/**
 * Список опубликованных правовых страниц.
 * GET /content/legal_pages
 * Возвращает массив { id, type, attributes: { title, slug, updated_at, body } }
 */
export async function getLegalPages() {
  try {
    const response = await fetchContentAPI(LEGAL_PAGES_ENDPOINT);
    const pages = normalizeLegalPagesResponse(response);

    if (pages.length > 0) return pages;
  } catch {
    // Retry below without ISR cache.
  }

  try {
    const response = await fetchContentAPI(LEGAL_PAGES_ENDPOINT, { cache: 'no-store' });
    return normalizeLegalPagesResponse(response);
  } catch {
    return [];
  }
}

/**
 * Правовая страница по slug.
 * GET /content/legal_pages/{slug}
 * Возвращает { id, type, attributes: { title, slug, updated_at, body } } или null при 404
 */
export async function getLegalPageBySlug(slug) {
  try {
    const response = await fetchContentAPI(`/content/legal_pages/${slug}`);
    return response.data || null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}
