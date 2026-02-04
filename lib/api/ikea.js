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

// 🔥 НОВОЕ: Популярные категории (берём первые 12 из всех)
export async function getPopularCategories() {
  const data = await fetchAPI('/categories');
  
  // Фильтруем категории с is_popular: true
  const popularCategories = data.data?.filter(cat => cat.attributes.is_popular === true) || [];
  
  // Если нет популярных, берём первые 12
  if (popularCategories.length === 0) {
    return {
      data: data.data?.slice(0, 12) || []
    };
  }
  
  return {
    data: popularCategories.slice(0, 12)
  };
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
export async function getBestsellers(page = 1, per_page = 10) {
  return fetchAPI(`/products/bestsellers?page=${page}&per_page=${per_page}`);
}

// Получить популярные товары
export async function getPopularProducts(page = 1, per_page = 10) {
  return fetchAPI(`/products/popular?page=${page}&per_page=${per_page}`);
}
