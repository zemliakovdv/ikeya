// lib/api/ikea.js

const API_BASE_URL = 'http://45.135.234.22/api/v1';

// ✅ Кеш для всех товаров с временем жизни
let productsCache = {
  data: null,
  timestamp: null,
  ttl: 10 * 60 * 1000 // 10 минут (600 секунд)
};

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

// ✅ Получить все товары (с кешем + TTL)
async function getAllProducts() {
  const now = Date.now();
  
  // Проверяем свежесть кеша
  if (productsCache.data && productsCache.timestamp && (now - productsCache.timestamp) < productsCache.ttl) {
    const age = Math.round((now - productsCache.timestamp) / 1000);
    console.log(`📦 Используем кеш товаров (возраст: ${age}с)`);
    return productsCache.data;
  }
  
  console.log('⬇️ Загружаем все товары...');
  const response = await fetchAPI('/products?per_page=10829');
  
  productsCache.data = response.data || [];
  productsCache.timestamp = now;
  
  console.log(`✅ Загружено товаров: ${productsCache.data.length}`);
  
  return productsCache.data;
}

// ✅ Получить конкретную категорию
export async function getCategory(ikeaId) {
  try {
    return await fetchAPI(`/categories/${ikeaId}`);
  } catch (error) {
    console.error(`Error loading category ${ikeaId}:`, error.message);
    return { data: null };
  }
}

// ✅ Получить товары категории (через фильтрацию всех товаров)
export async function getCategoryProducts(categoryIkeaId, page = 1, perPage = 20) {
  try {
    // 1. Получаем категорию
    const categoryResponse = await getCategory(categoryIkeaId);
    const category = categoryResponse.data;
    
    if (!category) {
      console.warn(`⚠️ Категория ${categoryIkeaId} не найдена`);
      return { data: [], meta: { total: 0 } };
    }
    
    // 2. Берем ID товаров из relationships
    const neededProductIds = category.relationships?.products?.data?.map(p => p.id) || [];
    
    if (neededProductIds.length === 0) {
      console.log(`📭 В категории ${categoryIkeaId} нет товаров`);
      return { data: [], meta: { total: 0 } };
    }
    
    console.log(`🔍 Категория ${categoryIkeaId}: ищем ${neededProductIds.length} товаров`);
    
    // 3. Загружаем все товары (из кеша или свежие)
    const allProducts = await getAllProducts();
    
    // 4. Фильтруем только нужные товары по ID
    const filteredProducts = allProducts.filter(product => 
      neededProductIds.includes(product.id)
    );
    
    console.log(`✅ Найдено товаров: ${filteredProducts.length} из ${neededProductIds.length}`);
    
    // 5. Пагинация на клиенте
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      data: pageProducts,
      meta: {
        total: filteredProducts.length,
        current_page: page,
        per_page: perPage,
        total_pages: Math.ceil(filteredProducts.length / perPage),
        category_ikea_id: categoryIkeaId
      }
    };
    
  } catch (error) {
    console.error('❌ Ошибка загрузки товаров категории:', error.message);
    return { data: [], meta: { total: 0 } };
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

// Остальные функции
export async function getProducts(params = {}) {
  return fetchAPI('/products');
}

export async function getProduct(id) {
  // API не поддерживает /products/{id}, используем фильтрацию
  const allProducts = await getAllProducts();
  const product = allProducts.find(p => p.id === id);
  return { data: product || null };
}

export async function getCategoriesTree() {
  return fetchAPI('/categories/tree');
}

export async function getCategories(params = {}) {
  return fetchAPI('/categories');
}

export async function getPopularCategories() {
  try {
    const allCategories = await fetchAPI('/categories');
    return {
      data: allCategories.data.slice(0, 24)
    };
  } catch (error) {
    return { data: [] };
  }
}

export async function getCategoriesMap() {
  return fetchAPI('/categories/map');
}

export async function getBestsellers(params = {}) {
  return fetchAPI('/products/bestsellers');
}

export async function getPopularProducts(params = {}) {
  return fetchAPI('/products/popular');
}

export async function getNewProducts(params = {}) {
  return getProducts({ ...params, is_new: true });
}
