// lib/api/ikea.js

const API_BASE_URL = 'http://45.135.234.22/api/v1';
export const IMAGES_BASE_URL = 'http://45.135.234.22';

// In-memory кеш — обходит лимит 2MB у unstable_cache
let _categoriesCache = null;
let _categoriesCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
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
      `${API_BASE_URL}/categories?per_page=${perPage}&page=${page}`,
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

    if (sort && allowedSorts.includes(sort)) query.set('sort', sort);
    if (extraParams.min_price) query.set('min_price', extraParams.min_price);
    if (extraParams.max_price) query.set('max_price', extraParams.max_price);

    for (const [key, value] of Object.entries(extraParams)) {
      if (!key.startsWith('filters[')) continue;
      const values = Array.isArray(value) ? value : [value];
      values.forEach((v) => query.append(key, v));
    }

    const response = await fetchAPI(`/categories/${categoryIkeaId}/products?${query.toString()}`);
    const meta = response.meta || { total: 0, page: 1, per_page: perPage };

    return {
      data: response.data || [],
      meta: {
        total: meta.total,
        current_page: meta.page,
        per_page: meta.per_page,
        total_pages: Math.ceil(meta.total / meta.per_page),
        category_ikea_id: categoryIkeaId
      }
    };
  } catch (error) {
    console.error('❌ Ошибка загрузки товаров категории:', error.message);
    return {
      data: [],
      meta: { total: 0, current_page: 1, per_page: perPage, total_pages: 0 }
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

export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    per_page: params.per_page || 50,
  });
  if (params.category_id) queryParams.append('category_id', params.category_id);
  if (params.is_bestseller !== undefined) queryParams.append('is_bestseller', params.is_bestseller);
  if (params.is_popular !== undefined) queryParams.append('is_popular', params.is_popular);
  if (params.is_new !== undefined) queryParams.append('is_new', params.is_new);
  return fetchAPI(`/products?${queryParams}`);
}

export async function getProduct(sku) {
  try {
    return await fetchAPI(`/products/${sku}`);
  } catch (error) {
    console.error(`❌ Ошибка загрузки товара ${sku}:`, error.message);
    return { data: null };
  }
}

export async function getProductBySku(sku) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${sku}`);
    if (!response.ok) throw new Error(`Ошибка загрузки товара: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка getProductBySku:', error.message);
    throw error;
  }
}

export async function getPopularProducts(params = {}) {
  return getProducts({ ...params, is_popular: true });
}

export async function getBestsellers(params = {}) {
  return getProducts({ ...params, is_bestseller: true });
}

export async function getNewProducts(params = {}) {
  return getProducts({ ...params, is_new: true });
}

export async function getAllBestsellers() {
  let allProducts = [];
  let page = 1;
  const perPage = 100;
  try {
    while (true) {
      const response = await getBestsellers({ page, per_page: perPage });
      const products = response.data || [];
      allProducts = allProducts.concat(products);
      if (products.length < perPage) break;
      page++;
    }
    return allProducts;
  } catch (error) {
    console.error('Ошибка загрузки всех бестселлеров:', error.message);
    return [];
  }
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