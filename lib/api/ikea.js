// lib/api/ikea.js

import {
  buildApiUrl,
  buildAssetUrl,
  IMAGES_BASE_URL,
} from '@/lib/config/api';

export { IMAGES_BASE_URL };

/**
 * Универсальная нормализация пути к картинке.
 * Убирает лишние слеши, добавляет базовый URL.
 * Используй везде вместо ручной склейки строк.
 */
export function resolveImageUrl(path) {
  return buildAssetUrl(path);
}

// In-memory кеш — обходит лимит 2MB у unstable_cache
let _categoriesCache = null;
let _categoriesCacheTime = 0;

// Кеш дерева категорий
let _categoriesTreeCache = null;
let _categoriesTreeCacheTime = 0;
let _categoriesTreeRequestPromise = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 минут

async function fetchAPI(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  try {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 300 } // кеш 5 минут
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', endpoint, error.message);
    throw error;
  }
}

// ==================== КАТЕГОРИИ ====================

async function _fetchAllCategories() {
  const now = Date.now();
  if (_categoriesCache && (now - _categoriesCacheTime) < CACHE_TTL) {
    return _categoriesCache;
  }

  let allCategories = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      buildApiUrl(`/categories?per_page=${perPage}&page=${page}`),
      { cache: 'no-store' }
    );
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    const categories = data.data || [];
    allCategories = allCategories.concat(categories);
    if (categories.length < perPage || page >= (data.meta?.total_pages || 1)) break;
    page++;
  }

  _categoriesCache = allCategories.map((cat) => ({
    ...cat,
    attributes: {
      ...cat.attributes,
      slug: cat.attributes.slug || cat.id
    }
  }));
  _categoriesCacheTime = now;
  return _categoriesCache;
}

export async function getCachedCategories() {
  return _fetchAllCategories();
}

/**
 * Загружает дерево категорий через /categories/tree (один запрос).
 * Возвращает массив корневых категорий с вложенными children.
 * Используй flattenCategoriesTree() из categoryHelpers если нужен плоский список.
 */
export async function getCachedCategoriesTree() {
  const payload = await getCachedCategoriesTreePayload();
  return payload.categories;
}

// Рекурсивно нормализует узел дерева — гарантирует наличие slug
function normalizeTreeNode(node) {
  return {
    ...node,
    attributes: {
      ...node.attributes,
      slug: node.attributes?.slug || node.id,
    },
    children: (node.children || []).map(normalizeTreeNode),
  };
}

function extractCategoriesTreePayload(data) {
  const root = data && typeof data === 'object' ? data : {};
  const nestedData = root.data && typeof root.data === 'object' && !Array.isArray(root.data)
    ? root.data
    : null;

  const rawCategories = Array.isArray(root.categories)
    ? root.categories
    : Array.isArray(nestedData?.categories)
      ? nestedData.categories
      : Array.isArray(root.data)
        ? root.data
        : [];

  const catalogSeoCandidate = root.catalog_seo ?? nestedData?.catalog_seo ?? null;
  const catalogSeo = catalogSeoCandidate && typeof catalogSeoCandidate === 'object'
    ? catalogSeoCandidate
    : null;

  return {
    categories: rawCategories.map((cat) => normalizeTreeNode(cat)),
    catalogSeo,
  };
}

async function getCachedCategoriesTreePayload() {
  const now = Date.now();
  if (_categoriesTreeCache && (now - _categoriesTreeCacheTime) < CACHE_TTL) {
    return _categoriesTreeCache;
  }

  if (_categoriesTreeRequestPromise) {
    return _categoriesTreeRequestPromise;
  }

  _categoriesTreeRequestPromise = (async () => {
    try {
      const response = await fetch(buildApiUrl('/categories/tree'), {
        next: { revalidate: 300 },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      const payload = extractCategoriesTreePayload(data);

      _categoriesTreeCache = payload;
      _categoriesTreeCacheTime = Date.now();
      return payload;
    } catch (error) {
      console.error('getCachedCategoriesTree error:', error.message);
      return { categories: [], catalogSeo: null };
    } finally {
      _categoriesTreeRequestPromise = null;
    }
  })();

  return _categoriesTreeRequestPromise;
}

export async function getCachedCatalogSeo() {
  const payload = await getCachedCategoriesTreePayload();
  return payload.catalogSeo;
}

export async function getCategoryWithFilters(ikeaId) {
  try {
    const response = await fetchAPI(`/categories/${ikeaId}`);
    const attrs = response.data?.attributes || {};
    return {
      data: response.data,
      available_filters: (attrs.available_filters || []).filter(
        (f) => Array.isArray(f.values) && f.values.length > 0
      ),
    };
  } catch (error) {
    console.error(`Error loading category ${ikeaId}:`, error.message);
    return { data: null, available_filters: [] };
  }
}

export async function getCategory(ikeaId) {
  try {
    return await fetchAPI(`/categories/${ikeaId}`);
  } catch (error) {
    console.error(`Error loading category ${ikeaId}:`, error.message);
    return { data: null };
  }
}

/**
 * Загрузка товаров категории с поддержкой фильтров, сортировки и пагинации.
 */
export async function getCategoryProducts(
  categoryIkeaId,
  page = 1,
  perPage = 20,
  sort = null,
  extraParams = {}
) {
  try {
    const allowedSorts = ['popular', 'newest', 'cheapest', 'expensive'];
    const query = new URLSearchParams();

    query.set('page', String(page));
    query.set('per_page', String(perPage));

    if (sort && allowedSorts.includes(sort)) {
      query.set('sort', sort);
    }

    if (extraParams.min_price) {
      query.set('min_price', extraParams.min_price);
    }

    if (extraParams.max_price) {
      query.set('max_price', extraParams.max_price);
    }

    for (const [key, value] of Object.entries(extraParams)) {
      if (!key.startsWith('filters[')) continue;

      const values = Array.isArray(value) ? value : [value];
      values.forEach((v) => query.append(key, v));
    }

    const response = await fetchAPI(`/categories/${categoryIkeaId}/products?${query.toString()}`);
    const meta = response.meta || {};

    const total = Number(meta.total) || 0;
    const currentPerPage = Number(meta.per_page) || perPage;
    const currentPage = Number(meta.page) || page;
    const totalPages = meta.total_pages
      ? Number(meta.total_pages)
      : Math.ceil(total / currentPerPage);

    return {
      data: response.data || [],
      meta: {
        total,
        current_page: currentPage,
        page: currentPage,
        per_page: currentPerPage,
        total_pages: totalPages,
        default_sort: meta.default_sort,
        category_ikea_id: categoryIkeaId,
      },
    };
  } catch (error) {
    console.error('❌ Ошибка загрузки товаров категории:', error.message);
    return {
      data: [],
      meta: {
        total: 0,
        current_page: 1,
        page: 1,
        per_page: perPage,
        total_pages: 0,
        category_ikea_id: categoryIkeaId,
      },
    };
  }
}

export async function getChildCategoriesFromList(categories, parentIkeaId) {
  return (categories || []).filter((cat) => {
    const parentIds = cat.attributes?.parent_ids || [];
    return parentIds[parentIds.length - 1] === parentIkeaId;
  });
}

export async function getCategoriesTree() {
  return fetchAPI('/categories/tree');
}

export async function getCategories(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.is_popular !== undefined) queryParams.append('is_popular', params.is_popular);
  if (params.page !== undefined) queryParams.append('page', params.page);
  if (params.per_page !== undefined) queryParams.append('per_page', params.per_page);
  const queryString = queryParams.toString();
  return fetchAPI(queryString ? `/categories?${queryString}` : '/categories');
}

export async function getPopularCategories() {
  try {
    const response = await fetchAPI('/categories/popular');
    return { data: response.data || [] };
  } catch (error) {
    console.error('Ошибка загрузки популярных категорий:', error.message);
    return { data: [] };
  }
}

export async function getTopCategories() {
  try {
    const response = await fetchAPI('/categories/top');
    const sorted = (response.data || []).sort((a, b) =>
      (a.attributes.top_position ?? 999) - (b.attributes.top_position ?? 999)
    );
    return { data: sorted };
  } catch (error) {
    console.error('Ошибка загрузки топ-категорий:', error.message);
    return { data: [] };
  }
}

export async function getAllCategories() {
  let allCategories = [];
  let page = 1;
  const perPage = 100;
  try {
    while (true) {
      const response = await getCategories({ page, per_page: perPage });
      const categories = response.data || [];
      allCategories = allCategories.concat(categories);
      if (categories.length < perPage) break;
      page++;
    }
    return allCategories;
  } catch (error) {
    console.error('Ошибка загрузки всех категорий:', error.message);
    return [];
  }
}

// ==================== ТОВАРЫ ====================

/**
 * Универсальная функция для получения списков товаров по конкретным эндпоинтам
 * (bestsellers, new_arrivals, recommended)
 */
async function fetchProductList(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    per_page: params.per_page || 10,
  });

  if (params.favorite_token) {
    queryParams.append('favorite_token', params.favorite_token);
  }

  return fetchAPI(`${endpoint}?${queryParams.toString()}`);
}

export async function getProducts(params = {}) {
  const perPage = params.per_page || 20;
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    per_page: perPage,
  });
  if (params.category_id) queryParams.append('category_id', params.category_id);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.is_bestseller !== undefined) queryParams.append('is_bestseller', params.is_bestseller);
  if (params.is_popular !== undefined) queryParams.append('is_popular', params.is_popular);
  if (params.is_new !== undefined) queryParams.append('is_new', params.is_new);

  const response = await fetchAPI(`/products?${queryParams}`);
  const meta = response.meta || {};

  // Бэк возвращает page и per_page как строки, total_pages может отсутствовать —
  // нормализуем вручную, как в getCategoryProducts
  const total = Number(meta.total) || 0;
  const currentPerPage = Number(meta.per_page) || perPage;
  const currentPage = Number(meta.page) || 1;
  const totalPages = meta.total_pages
    ? Number(meta.total_pages)
    : Math.ceil(total / currentPerPage);

  return {
    data: response.data || [],
    meta: {
      total,
      current_page: currentPage,
      per_page: currentPerPage,
      total_pages: totalPages,
    }
  };
}

export async function getProduct(sku) {
  try {
    return await fetchAPI(`/products/${sku}`);
  } catch (error) {
    console.error(`❌ Ошибка загрузки товара ${sku}:`, error.message);
    return { data: null };
  }
}

// ПЕРЕХОД НА СПЕЦИАЛЬНЫЕ ЭНДПОИНТЫ

export async function getBestsellers(params = {}) {
  // Используем /products/bestsellers вместо /products?is_bestseller=true
  return fetchProductList('/products/bestsellers', params);
}

export async function getNewProducts(params = {}) {
  // Используем /products/new_arrivals вместо /products?is_new=true
  return fetchProductList('/products/new_arrivals', params);
}

export async function getHomepageRecommendations(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.per_page) queryParams.set('per_page', params.per_page);
  if (params.page) queryParams.set('page', params.page);
  const qs = queryParams.toString();
  return fetchAPI(`/homepage/recommendations${qs ? '?' + qs : ''}`);
}

export async function getCartRecommendations(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.per_page) queryParams.set('per_page', params.per_page);
  if (params.page) queryParams.set('page', params.page);
  const qs = queryParams.toString();
  return fetchAPI(`/cart/recommendations${qs ? '?' + qs : ''}`);
}

export async function getRecommendedProducts(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.per_page) queryParams.set('per_page', params.per_page);
  if (params.page) queryParams.set('page', params.page);
  const qs = queryParams.toString();
  return fetchAPI(`/products/recommended${qs ? '?' + qs : ''}`);
}

// Совместимость с текущими функциями кеширования и "GetAll"
export async function getAllBestsellers() {
  // Вызываем обновленную функцию
  const response = await getBestsellers({ page: 1, per_page: 100 });
  return response.data || [];
}

export async function getAllNewArrivals() {
  const response = await getNewProducts({ page: 1, per_page: 50 });
  return response.data || [];
}

export async function getAllRecommended() {
  const response = await getRecommendedProducts({ page: 1, per_page: 50 });
  return response.data || [];
}

// ==================== СЛАЙДЕР ГЛАВНОЙ ====================

export async function getMainSliderBanners() {
  try {
    const response = await fetchAPI('/homepage/slider/main');
    return { data: response.data || [], meta: response.meta || { seo: {} } };
  } catch (error) {
    console.error('Ошибка загрузки слайдера:', error.message);
    return { data: [], meta: { seo: {} } };
  }
}

export async function getHorizontalBanners() {
  try {
    const response = await fetchAPI('/homepage/slider/horizontal');
    return { data: response.data || [], meta: response.meta || {} };
  } catch (error) {
    console.error('Error loading horizontal banners:', error.message);
    return { data: [], meta: {} };
  }
}

export async function getAdvertisingBanners() {
  try {
    const response = await fetchAPI('/homepage/slider/advertising');
    return { data: response.data || [], meta: response.meta || {} };
  } catch (error) {
    console.error('Error loading advertising banners:', error.message);
    return { data: [], meta: {} };
  }
}

export const getProductBySku = getProduct;
export const getPopularProducts = getProducts;
