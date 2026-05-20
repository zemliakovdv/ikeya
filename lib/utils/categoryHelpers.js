// lib/utils/categoryHelpers.js

function getCategorySlug(category) {
  return category?.attributes?.slug || category?.id || '';
}

function getCategoryName(category) {
  return (
    category?.attributes?.translated_name ||
    category?.attributes?.name ||
    'Категория'
  );
}

function getNodeChildren(node) {
  const children =
    node?.children ||
    node?.subcategories ||
    node?.items ||
    node?.nodes ||
    [];

  return Array.isArray(children) ? children : [];
}

/**
 * Поиск категории по id.
 */
export function findCategoryByIkeaId(categories, ikeaId) {
  return (categories || []).find((cat) => cat?.id === ikeaId);
}

/**
 * Поиск категории по slug.
 */
export function findCategoryBySlug(categories, slug) {
  if (!slug) return undefined;

  return (categories || []).find((cat) => getCategorySlug(cat) === slug);
}

/**
 * Строим полный URL категории из цепочки категорий.
 */
export function buildCategoryUrl(categoryChain) {
  const slugs = (categoryChain || [])
    .map(getCategorySlug)
    .filter(Boolean);

  return slugs.length ? `/catalog/${slugs.join('/')}` : '/catalog';
}

/**
 * Построение цепочки категорий от корня до текущей.
 * parent_ids: массив id родителей от корня к текущей.
 */
export function buildCategoryChain(categories, currentCategory) {
  if (!currentCategory) return [];

  const chain = [currentCategory];
  const parentIds = Array.isArray(currentCategory.attributes?.parent_ids)
    ? currentCategory.attributes.parent_ids
    : [];

  parentIds.forEach((parentId) => {
    const parent = findCategoryByIkeaId(categories, parentId);

    if (parent && !chain.some((c) => c.id === parent.id)) {
      chain.unshift(parent);
    }
  });

  return chain;
}

/**
 * Получение дочерних категорий по последнему parent_id.
 */
export function getChildCategories(categories, parentIkeaId) {
  return (categories || []).filter((cat) => {
    const parentIds = Array.isArray(cat?.attributes?.parent_ids)
      ? cat.attributes.parent_ids
      : [];

    return parentIds[parentIds.length - 1] === parentIkeaId;
  });
}

/**
 * Breadcrumbs по цепочке категорий.
 */
export function buildBreadcrumbs(categoryChain) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
  ];

  let currentPath = '/catalog';

  (categoryChain || []).forEach((category) => {
    const slug = getCategorySlug(category);
    const name = getCategoryName(category);

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
 * Разворачиваем /categories/tree в плоский массив всех нод.
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

    getNodeChildren(node).forEach(walk);
  };

  walk(treeData);

  return result;
}

/**
 * Поиск узла в оригинальном дереве по цепочке slug'ов.
 *
 * Возвращает:
 * {
 *   node,
 *   ancestors,
 *   siblings,
 * }
 */
export function findNodeInTree(treeData, slugChain) {
  const roots = Array.isArray(treeData) ? treeData : [];
  const chain = Array.isArray(slugChain) ? slugChain.filter(Boolean) : [];

  if (!roots.length || !chain.length) {
    return { node: null, ancestors: [], siblings: [] };
  }

  let currentList = roots;
  const ancestors = [];
  let node = null;

  for (let i = 0; i < chain.length; i++) {
    const slug = chain[i];
    const found = currentList.find((n) => getCategorySlug(n) === slug);

    if (!found) {
      node = null;
      break;
    }

    if (i < chain.length - 1) {
      ancestors.push(found);
    }

    node = found;
    currentList = getNodeChildren(found);
  }

  if (node && getCategorySlug(node) === chain[chain.length - 1]) {
    const directParent = ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
    const siblings = directParent ? getNodeChildren(directParent) : roots;

    return { node, ancestors, siblings };
  }

  const targetSlug = chain[chain.length - 1];

  function searchInTree(nodeList, parentChain = []) {
    for (const n of nodeList) {
      if (!getCategorySlug(n)) continue;

      if (getCategorySlug(n) === targetSlug) {
        return { node: n, ancestors: parentChain };
      }

      const children = getNodeChildren(n);

      if (children.length > 0) {
        const result = searchInTree(children, [...parentChain, n]);
        if (result) return result;
      }
    }

    return null;
  }

  const found = searchInTree(roots, []);

  if (found) {
    const directParent = found.ancestors.length > 0
      ? found.ancestors[found.ancestors.length - 1]
      : null;

    const siblings = directParent ? getNodeChildren(directParent) : roots;

    return {
      node: found.node,
      ancestors: found.ancestors,
      siblings,
    };
  }

  return { node: null, ancestors: [], siblings: [] };
}

/**
 * Рекурсивный сбор всех дочерних категорий.
 */
export function getAllChildCategoryIds(categories, parentIkeaId) {
  const result = [parentIkeaId];

  function collectChildren(ikeaId) {
    (categories || [])
      .filter((cat) => {
        const parentIds = Array.isArray(cat?.attributes?.parent_ids)
          ? cat.attributes.parent_ids
          : [];

        return parentIds.includes(ikeaId);
      })
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

/**
 * Строим breadcrumbs из дерева категорий по цепочке slug'ов.
 */
export function buildBreadcrumbsFromTree(treeData, slugChain) {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
  ];

  const { node, ancestors } = findNodeInTree(treeData, slugChain);

  if (!node) return breadcrumbs;

  let currentPath = '/catalog';

  ancestors.forEach((ancestor) => {
    const slug = getCategorySlug(ancestor);
    const name = getCategoryName(ancestor);

    if (!slug || !name) return;

    currentPath += `/${slug}`;
    breadcrumbs.push({ name, href: currentPath });
  });

  const currentSlug = getCategorySlug(node);
  const currentName = getCategoryName(node);

  if (currentSlug && currentName) {
    currentPath += `/${currentSlug}`;
    breadcrumbs.push({ name: currentName, href: currentPath });
  }

  return breadcrumbs;
}