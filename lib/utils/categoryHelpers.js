// lib/utils/categoryHelpers.js

/**
 * Поиск категории по ikea_id в плоском массиве
 */
export function findCategoryByIkeaId(categories, ikeaId) {
  // ✅ ИСПРАВЛЕНО: ikea_id теперь в корневом поле id
  return categories.find(cat => cat.id === ikeaId);
}

/**
 * Построение полной цепочки категорий от корня до текущей
 */
export function buildCategoryChain(categories, currentCategory) {
  if (!currentCategory) return [];
  
  const chain = [currentCategory];
  const parentIds = currentCategory.attributes.parent_ids || [];
  
  for (let i = parentIds.length - 1; i >= 0; i--) {
    const parentId = parentIds[i];
    const parent = findCategoryByIkeaId(categories, parentId);
    
    if (parent) {
      const exists = chain.find(c => c.id === parent.id);
      if (!exists) {
        chain.unshift(parent);
      }
    }
  }
  
  return chain;
}

/**
 * Получение дочерних категорий
 */
export function getChildCategories(categories, parentIkeaId) {
  return categories.filter(cat => {
    const parentIds = cat.attributes.parent_ids || [];
    const lastParentId = parentIds[parentIds.length - 1];
    return lastParentId === parentIkeaId;
  });
}

/**
 * Построение breadcrumbs
 */
export function buildBreadcrumbs(categoryChain) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' }
  ];
  
  let currentPath = '/catalog';
  
  categoryChain.forEach(category => {
    // ✅ ИСПРАВЛЕНО: ikea_id теперь в корневом поле id
    currentPath += `/${category.id}`;
    breadcrumbs.push({
      name: category.attributes.translated_name,
      href: currentPath
    });
  });
  
  return breadcrumbs;
}

/**
 * Преобразование дерева категорий в плоский массив
 */
export function flattenCategoriesTree(data) {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    type: item.type,
    attributes: item.attributes,
    relationships: item.relationships
  }));
}

/**
 * Рекурсивный сбор всех дочерних категорий
 */
export function getAllChildCategoryIds(categories, parentIkeaId) {
  const result = [parentIkeaId];
  
  function collectChildren(ikeaId) {
    const children = categories.filter(cat => {
      const parentIds = cat.attributes?.parent_ids || [];
      return parentIds.includes(ikeaId);
    });
    
    children.forEach(child => {
      // ✅ ИСПРАВЛЕНО: ikea_id теперь в корневом поле id
      const childIkeaId = child.id;
      if (childIkeaId && !result.includes(childIkeaId)) {
        result.push(childIkeaId);
        collectChildren(childIkeaId);
      }
    });
  }
  
  collectChildren(parentIkeaId);
  
  return result;
}
