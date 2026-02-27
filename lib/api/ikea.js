// lib/api/ikea.js (полная версия с добавленной функцией)
// Просто скопируйте и замените существующий файл

const API_BASE_URL = 'http://45.135.234.22/api/v1';
export const IMAGES_BASE_URL = 'http://45.135.234.22';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
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

export async function getCategory(ikeaId) {
  try {
    return await fetchAPI(`/categories/${ikeaId}`);
  } catch (error) {
    console.error(`Error loading category ${ikeaId}:`, error.message);
    return { data: null };
  }
}

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

export async function getCategoriesTree() {
  return fetchAPI('/categories/tree');
}

export async function getCategories(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.is_popular !== undefined) {
    queryParams.append('is_popular', params.is_popular);
  }
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/categories?${queryString}` : '/categories';
  
  return fetchAPI(endpoint);
}

export async function getPopularCategories() {
  try {
    const response = await fetchAPI('/categories/popular');
    return {
      data: response.data || [],
    };
  } catch (error) {
    console.error('Ошибка загрузки популярных категорий:', error.message);
    return { data: [] };
  }
}

export async function getTopCategories() {
  try {
    const response = await fetchAPI('/categories/top');
    const sorted = (response.data || []).sort((a, b) => {
      const posA = a.attributes.top_position ?? 999;
      const posB = b.attributes.top_position ?? 999;
      return posA - posB;
    });
    return { data: sorted };
  } catch (error) {
    console.error('Ошибка загрузки топ-категорий:', error.message);
    return { data: [] };
  }
}

// ==================== ТОВАРЫ ====================

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

export async function getPopularProducts(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    per_page: params.per_page || 10,
  });
  
  return fetchAPI(`/products/popular?${queryParams}`);
}

export async function getBestsellers(params = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      per_page: params.per_page || 10,
    });
    
    const response = await fetchAPI(`/products/bestsellers?${queryParams}`);
    return {
      data: response.data || [],
      meta: response.meta || { total: 0, page: 1, per_page: 10 }
    };
  } catch (error) {
    console.error('Ошибка загрузки хитов продаж:', error.message);
    return { data: [], meta: { total: 0, page: 1, per_page: 10 } };
  }
}

export async function getNewProducts(params = {}) {
  return getProducts({ ...params, is_new: true });
}

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

// ==================== СЛАЙДЕР ГЛАВНОЙ ====================

export async function getMainSliderBanners() {
  try {
    const response = await fetchAPI('/homepage/slider/main');
    return {
      data: response.data || [],
      meta: response.meta || { seo: {} }
    };
  } catch (error) {
    console.error('Ошибка загрузки слайдера:', error.message);
    return { data: [], meta: { seo: {} } };
  }
}

// ==================== ВСЕ БЕСТСЕЛЛЕРЫ (для группировки) ====================

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

// lib/api/ikea.js — добавить в конец

export async function getAllCategories() {
  let allCategories = [];
  let page = 1;
  const perPage = 100; // можно увеличить, если API позволяет

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