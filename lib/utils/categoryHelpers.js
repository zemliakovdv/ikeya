// lib/utils/categoryHelpers.js

/**
 * Поиск категории по ikea_id (id в корне объекта)
 */
export function findCategoryByIkeaId(categories, ikeaId) {
  return categories.find(cat => cat.id === ikeaId);
}

/**
 * Поиск категории по slug
 */
export function findCategoryBySlug(categories, slug) {
  return categories.find(cat => cat.attributes.slug === slug);
}

/**
 * Строим полный URL категории из цепочки slug'ов
 */
export function buildCategoryUrl(categoryChain) {
  const slugs = categoryChain.map(cat => cat.attributes.slug);
  return `/catalog/${slugs.join('/')}`;
}

/**
 * Построение полной цепочки категорий от корня до текущей
 */
export function buildCategoryChain(categories, currentCategory) {
  if (!currentCategory) return [];

  const chain = [currentCategory];
  const parentIds = currentCategory.attributes.parent_ids || [];

  for (let i = parentIds.length - 1; i >= 0; i--) {
    const parent = findCategoryByIkeaId(categories, parentIds[i]);
    if (parent && !chain.find(c => c.id === parent.id)) {
      chain.unshift(parent);
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
    return parentIds[parentIds.length - 1] === parentIkeaId;
  });
}

/**
 * Построение breadcrumbs — теперь использует slug в URL
 */
export function buildBreadcrumbs(categoryChain) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' }
  ];

  let currentPath = '/catalog';

  categoryChain.forEach(category => {
    currentPath += `/${category.attributes.slug}`;
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
  if (!data || !Array.isArray(data)) return [];

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
    categories
      .filter(cat => (cat.attributes?.parent_ids || []).includes(ikeaId))
      .forEach(child => {
        if (child.id && !result.includes(child.id)) {
          result.push(child.id);
          collectChildren(child.id);
        }
      });
  }

  collectChildren(parentIkeaId);
  return result;
}
