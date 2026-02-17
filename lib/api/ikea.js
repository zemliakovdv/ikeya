// lib/api/ikea.js

const API_BASE_URL = 'http://45.135.234.22/api/v1';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      // ✅ Кешировать запросы на 5 минут
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('API Error:', endpoint, error.message);
    throw error;
  }
}

// ==================== КАТЕГОРИИ ====================

// ✅ Получить конкретную категорию
export async function getCategory(ikeaId) {
  try {
    return await fetchAPI(`/categories/${ikeaId}`);
  } catch (error) {
    console.error(`Error loading category ${ikeaId}:`, error.message);
    return { data: null };
  }
}

// ✅ НОВАЯ ВЕРСИЯ: Получить товары категории через серверный endpoint
export async function getCategoryProducts(categoryIkeaId, page = 1, perPage = 20) {
  try {
    console.log(`🔍 Загружаем товары категории ${categoryIkeaId} (стр. ${page})`);
    
    const response = await fetchAPI(
      `/categories/${categoryIkeaId}/products?page=${page}&per_page=${perPage}`
    );
    
    const products = response.data || [];
    const meta = response.meta || { total: 0, page: 1, per_page: perPage };
    
    console.log(`✅ Загружено товаров: ${products.length} из ${meta.total}`);
    
    return {
      data: products,
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

// ✅ Получить дочерние категории
export async function getChildCategories(parentIkeaId) {
  try {
    const allCategories = await fetchAPI('/categories');
    const children = allCategories.data.filter(cat => {
      const parentIds = cat.attributes.parent_ids || [];
      const lastParentId = parentIds[parentIds.length - 1];
      return lastParentId === parentIkeaId;
    });
    
    return { data: children };
    
  } catch (error) {
    console.error('Error loading child categories:', error);
    return { data: [] };
  }
}

// ==================== ТОВАРЫ ====================

// ✅ Получить список товаров с фильтрацией
export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    per_page: params.per_page || 50,
  });

  if (params.category_id) {
    queryParams.append('category_id', params.category_id);
  }
  if (params.is_bestseller !== undefined) {
    queryParams.append('is_bestseller', params.is_bestseller);
  }
  if (params.is_popular !== undefined) {
    queryParams.append('is_popular', params.is_popular);
  }

  return fetchAPI(`/products?${queryParams}`);
}

// ✅ НОВАЯ ВЕРСИЯ: Получить один товар по SKU
export async function getProduct(sku) {
  try {
    console.log(`🔍 Загружаем товар: ${sku}`);
    const response = await fetchAPI(`/products/${sku}`);
    console.log(`✅ Товар загружен: ${response.data?.attributes?.name || 'без имени'}`);
    return response;
  } catch (error) {
    console.error(`❌ Ошибка загрузки товара ${sku}:`, error.message);
    return { data: null };
  }
}

// ✅ Получить дерево категорий
export async function getCategoriesTree() {
  return fetchAPI('/categories/tree');
}

// ✅ Получить плоский список категорий
export async function getCategories(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.is_popular !== undefined) {
    queryParams.append('is_popular', params.is_popular);
  }
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/categories?${queryString}` : '/categories';
  
  return fetchAPI(endpoint);
}

// ✅ Получить популярные категории
export async function getPopularCategories() {
  try {
    return await getCategories({ is_popular: true });
  } catch (error) {
    console.error('Error loading popular categories:', error);
    return { data: [] };
  }
}

// ✅ Получить популярные товары
export async function getPopularProducts(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    per_page: params.per_page || 10,
  });
  
  return fetchAPI(`/products/popular?${queryParams}`);
}

// ✅ Получить бестселлеры (через фильтр is_bestseller)
export async function getBestsellers(params = {}) {
  return getProducts({ ...params, is_bestseller: true });
}

// ✅ Получить новые товары (если API поддерживает)
export async function getNewProducts(params = {}) {
  return getProducts({ ...params, is_new: true });
}


/**
 * Получить товар по SKU
 */
export async function getProductBySku(sku) {
    const url = `${API_BASE_URL}/products/${sku}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки товара: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка getProductBySku:', error.message);
        throw error;
    }
}

/**
 * Получить категории для верхнего меню (хедер)
 */
export async function getHeaderMenuCategories() {
  try {
    const response = await fetchAPI('/categories/header_menu');
    // Сортируем по позиции
    const sorted = (response.data || []).sort((a, b) => {
      const posA = a.attributes.header_menu_position || 999;
      const posB = b.attributes.header_menu_position || 999;
      return posA - posB;
    });
    return { data: sorted };
  } catch (error) {
    console.error('Ошибка загрузки меню категорий:', error.message);
    return { data: [] };
  }
}
