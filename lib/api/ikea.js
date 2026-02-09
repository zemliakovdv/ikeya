// lib/api/ikea.js

const API_BASE_URL = 'http://45.135.234.22/api/v1';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store', // Пока отключаем кеш для разработки
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('❌ API ошибка:', endpoint, error);
    throw error;
  }
}

// Получить товары
export async function getProducts(params = {}) {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page);
  if (params.per_page) searchParams.set('per_page', params.per_page);
  if (params.category_id) searchParams.set('category_id', params.category_id);
  if (params.is_bestseller) searchParams.set('is_bestseller', 'true');
  if (params.is_popular) searchParams.set('is_popular', 'true');
  if (params.is_new) searchParams.set('is_new', 'true');

  const query = searchParams.toString();
  const endpoint = `/products${query ? `?${query}` : ''}`;

  return fetchAPI(endpoint);
}

// Получить категории
export async function getCategories(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.is_popular) searchParams.set('is_popular', 'true');
  
  const query = searchParams.toString();
  const endpoint = `/categories${query ? `?${query}` : ''}`;
  
  return fetchAPI(endpoint);
}

// ✅ Популярные категории
export async function getPopularCategories() {
  try {
    const data = await fetchAPI('/categories/popular');
    
    // ✅ Если меньше 12 категорий, берём все
    if (data.data.length < 12) {
      console.warn('⚠️ Мало популярных категорий, загружаем все...');
      const allCategories = await fetchAPI('/categories');
      return {
        data: allCategories.data.slice(0, 24) // Берём первые 24
      };
    }
    
    return data;
  } catch (error) {
    console.error('❌ Ошибка популярных категорий:', error);
    
    // Fallback на все категории
    try {
      const allCategories = await fetchAPI('/categories');
      return {
        data: allCategories.data.slice(0, 24)
      };
    } catch (fallbackError) {
      console.error('❌ Fallback тоже не сработал:', fallbackError);
      return { data: [] };
    }
  }
}

// Получить категорию по ID
export async function getCategory(id) {
  return fetchAPI(`/categories/${id}`);
}

// Получить дерево категорий
export async function getCategoriesTree() {
  return fetchAPI('/categories/tree');
}

// Получить товар по SKU
export async function getProduct(sku) {
  return fetchAPI(`/products/${sku}`);
}

// Получить бестселлеры
export async function getBestsellers(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page);
  if (params.per_page) searchParams.set('per_page', params.per_page);
  
  const query = searchParams.toString();
  return fetchAPI(`/products/bestsellers${query ? `?${query}` : ''}`);
}

// Получить популярные товары
export async function getPopularProducts(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page);
  if (params.per_page) searchParams.set('per_page', params.per_page);
  
  const query = searchParams.toString();
  return fetchAPI(`/products/popular${query ? `?${query}` : ''}`);
}

// ✅ Получить новинки
export async function getNewProducts(params = {}) {
  return getProducts({ ...params, is_new: true });
}
