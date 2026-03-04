// lib/utils/categoryHelpers.js

/**
 * Поиск категории по id (в корне объекта)
 */
export function findCategoryByIkeaId(categories, ikeaId) {
  return (categories || []).find((cat) => cat?.id === ikeaId);
}

/**
 * Поиск категории по slug (безопасно)
 */
export function findCategoryBySlug(categories, slug) {
  if (!slug) return undefined;
  return (categories || []).find((cat) => cat?.attributes?.slug === slug);
}

/**
 * Строим полный URL категории из цепочки slug'ов
 */
export function buildCategoryUrl(categoryChain) {
  const slugs = (categoryChain || [])
    .map((cat) => cat?.attributes?.slug)
    .filter(Boolean);

  return slugs.length ? `/catalog/${slugs.join('/')}` : '/catalog';
}

/**
 * Построение цепочки категорий от корня до текущей
 * parent_ids: массив id родителей от корня к текущей
 */
export function buildCategoryChain(categories, currentCategory) {
  if (!currentCategory) return [];

  const chain = [currentCategory];
  const parentIds = currentCategory.attributes?.parent_ids || [];

  for (let i = 0; i < parentIds.length; i++) {
    const parent = findCategoryByIkeaId(categories, parentIds[i]);
    if (parent && !chain.find((c) => c.id === parent.id)) {
      chain.unshift(parent);
    }
  }

  return chain;
}

/**
 * Получение дочерних категорий (по последнему parent_id)
 */
export function getChildCategories(categories, parentIkeaId) {
  return (categories || []).filter((cat) => {
    const parentIds = cat?.attributes?.parent_ids || [];
    return parentIds[parentIds.length - 1] === parentIkeaId;
  });
}

/**
 * Breadcrumbs по slug-цепочке
 */
export function buildBreadcrumbs(categoryChain) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
  ];

  let currentPath = '/catalog';

  (categoryChain || []).forEach((category) => {
    const slug = category?.attributes?.slug;
    const name = category?.attributes?.translated_name;
    if (!slug || !name) return;

    currentPath += `/${slug}`;

    breadcrumbs.push({
      name,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * ✅ ВАЖНО: разворачиваем /categories/tree в плоский массив ВСЕХ нод
 * В дереве обычно есть children / subcategories (название может отличаться)
 */
export function flattenCategoriesTree(treeData) {
  const result = [];

  const walk = (nodeOrList) => {
    if (!nodeOrList) return;

    if (Array.isArray(nodeOrList)) {
      nodeOrList.forEach(walk);
      return;
    }

    const node = nodeOrList;

    if (node?.id && node?.attributes) {
      result.push({
        id: node.id,
        type: node.type,
        attributes: node.attributes,
        relationships: node.relationships,
      });
    }

    // поддержим разные ключи детей (часто: children)
    const children =
      node.children ||
      node.subcategories ||
      node.items ||
      node.nodes ||
      [];

    if (Array.isArray(children) && children.length > 0) {
      children.forEach(walk);
    }
  };

  walk(treeData);
  return result;
}

/**
 * Рекурсивный сбор всех дочерних категорий (если нужен)
 */
export function getAllChildCategoryIds(categories, parentIkeaId) {
  const result = [parentIkeaId];

  function collectChildren(ikeaId) {
    (categories || [])
      .filter((cat) => (cat?.attributes?.parent_ids || []).includes(ikeaId))
      .forEach((child) => {
        if (child?.id && !result.includes(child.id)) {
          result.push(child.id);
          collectChildren(child.id);
        }
      });
  }

  collectChildren(parentIkeaId);
  return result;
}