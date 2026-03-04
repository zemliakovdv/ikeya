// components/catalog/sidebar/CategoryTree.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function buildPathFromChain(chain) {
  const slugs = (chain || [])
    .map((c) => c?.attributes?.slug)
    .filter(Boolean);

  return slugs.length ? `/catalog/${slugs.join('/')}` : '/catalog';
}

function getRootItemHref(item) {
  // формат 1: { slug, name }
  if (item?.slug) return `/catalog/${item.slug}`;

  // формат 2: api node { id, attributes }
  const slug = item?.attributes?.slug;
  if (slug) return `/catalog/${slug}`;

  return '/catalog';
}

function getRootItemName(item) {
  if (item?.name) return item.name;
  return item?.attributes?.translated_name || item?.attributes?.name || 'Категория';
}

export default function CategoryTree({
  currentCategory = null,
  parentCategory = null,
  grandParentCategory = null,
  greatGrandParentCategory = null,
  subcategories = [],
  rootCategories = [],
  level = 0,
  categoryChain = null,
  childCategories = null
}) {
  const pathname = usePathname();

// ✅ ЖЁСТКО: если мы на /catalog (нет текущей категории) — всегда показываем корневые категории
if (!currentCategory) {
  console.log('CategoryTree root mode, rootCategories:', rootCategories.length);
  
  return (
    <div className="category-sidebar">
      <h3 className="category-sidebar__title">Категория</h3>

      <nav className="category-tree">
        <div className="category-tree__root">
          {(rootCategories || []).map((cat, idx) => {
            const href = getRootItemHref(cat);
            const name = getRootItemName(cat);
            const key = cat?.slug || cat?.id || `${href}-${idx}`;

            return (
              <Link
                key={key}
                href={href}
                className={`category-tree__link ${pathname === href ? 'active' : ''}`}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}


  // 1) если пришла цепочка категорий — используем её
  const chain =
    Array.isArray(categoryChain) && categoryChain.length > 0
      ? categoryChain
      : (() => {
          const arr = [];
          if (greatGrandParentCategory) arr.push(greatGrandParentCategory);
          if (grandParentCategory) arr.push(grandParentCategory);
          if (parentCategory) arr.push(parentCategory);
          if (currentCategory) arr.push(currentCategory);
          return arr;
        })();

  const children = childCategories || subcategories || [];

  const breadcrumb = [
    { name: 'Все категории', href: '/catalog', key: 'all' },
    ...chain.map((cat, index) => {
      const partialChain = chain.slice(0, index + 1);
      const href = buildPathFromChain(partialChain);
      return {
        name: cat?.attributes?.translated_name || cat?.attributes?.name || 'Категория',
        href,
        key: cat?.id || href
      };
    })
  ];

  const basePath = buildPathFromChain(chain);

  return (
    <div className="category-sidebar">
      <h3 className="category-sidebar__title">Категория</h3>

      <nav className="category-tree">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;

          return (
            <div key={item.key} className={`category-tree__item level-${index}`}>
              <Link
                href={item.href}
                className={`category-tree__link ${isLast ? 'current' : ''}`}
              >
                <span className="chevron">‹</span>
                {item.name}
              </Link>
            </div>
          );
        })}

        {children.length > 0 && (
          <div className="category-tree__children">
            {children.map((child) => {
              const childSlug = child?.attributes?.slug;
              if (!childSlug) return null;

              const childHref =
                basePath === '/catalog'
                  ? `/catalog/${childSlug}`
                  : `${basePath}/${childSlug}`;

              const isActive = pathname === childHref;

              return (
                <Link
                  key={child.id || childHref}
                  href={childHref}
                  className={`category-tree__child ${isActive ? 'active' : ''}`}
                >
                  {child?.attributes?.translated_name || child?.attributes?.name || 'Категория'}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}