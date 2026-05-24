// lib/api/content.js

import { buildApiUrl } from '@/lib/config/api';

async function fetchContentAPI(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);

  try {
    const res = await fetch(url, {
      ...options,
      next: { revalidate: 300 }, // кеш 5 минут
    });

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

/**
 * Список опубликованных правовых страниц
 * GET /content/legal_pages
 * Возвращает массив { id, type, attributes: { title, slug, updated_at, body } }
 */
export async function getLegalPages() {
  try {
    const response = await fetchContentAPI('/content/legal_pages');
    return response.data || [];
  } catch {
    return [];
  }
}

/**
 * Правовая страница по slug
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