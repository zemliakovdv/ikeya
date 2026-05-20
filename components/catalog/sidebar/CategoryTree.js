// components/catalog/sidebar/CategoryTree.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { findNodeInTree } from '@/lib/utils/categoryHelpers';

function getNodeName(node) {
  return (
    node?.attributes?.translated_name ||
    node?.attributes?.name ||
    'Категория'
  );
}

function getNodeSlug(node) {
  return node?.attributes?.slug || node?.id || '';
}

function buildUrl(slugs) {
  return slugs.length ? `/catalog/${slugs.join('/')}` : '/catalog';
}

function buildUrlFromNodes(nodes) {
  const slugs = (nodes || [])
    .map(getNodeSlug)
    .filter(Boolean);

  return buildUrl(slugs);
}

export default function CategoryTree({ treeData = [], slugChain = [] }) {
  const pathname = usePathname();
  const roots = Array.isArray(treeData) ? treeData : [];
  const currentSlugChain = Array.isArray(slugChain) ? slugChain : [];

  if (currentSlugChain.length === 0) {
    return (
      <div className="category-sidebar">
        <h3 className="category-sidebar__title">Категория</h3>

        <nav className="category-tree">
          {roots.map((cat) => {
            const slug = getNodeSlug(cat);
            if (!slug) return null;

            const href = `/catalog/${slug}`;
            const isActive = pathname === href;

            return (
              <Link
                key={cat.id || slug}
                href={href}
                className={`category-tree__link ${isActive ? 'active' : ''}`}
              >
                {getNodeName(cat)}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  const { node, ancestors, siblings } = findNodeInTree(roots, currentSlugChain);

  if (!node) {
    return (
      <div className="category-sidebar">
        <h3 className="category-sidebar__title">Категория</h3>

        <nav className="category-tree">
          <Link href="/catalog" className="category-tree__back">
            ‹ Все категории
          </Link>
        </nav>
      </div>
    );
  }

  const safeAncestors = Array.isArray(ancestors) ? ancestors : [];
  const safeSiblings = Array.isArray(siblings) ? siblings : [];
  const children = Array.isArray(node.children) ? node.children : [];

  const hasChildren = children.length > 0;
  const subItems = hasChildren
    ? children
    : safeSiblings.filter((s) => s.id !== node.id);

  const subItemsBaseSlugs = hasChildren
    ? currentSlugChain
    : currentSlugChain.slice(0, -1);

  return (
    <div className="category-sidebar">
      <h3 className="category-sidebar__title">Категория</h3>

      <nav className="category-tree">
        <Link href="/catalog" className="category-tree__back">
          ‹ Все категории
        </Link>

        {safeAncestors.map((ancestor, index) => {
          const ancestorHref = buildUrlFromNodes(safeAncestors.slice(0, index + 1));

          return (
            <Link
              key={ancestor.id || ancestorHref}
              href={ancestorHref}
              className="category-tree__parent"
            >
              ‹ {getNodeName(ancestor)}
            </Link>
          );
        })}

        <div className="category-tree__current">
          {getNodeName(node)}
        </div>

        {subItems.length > 0 && (
          <div className="category-tree__children">
            {subItems.map((item) => {
              const itemSlug = getNodeSlug(item);
              if (!itemSlug) return null;

              const itemHref = buildUrl([...subItemsBaseSlugs, itemSlug]);
              const isActive = pathname === itemHref;

              return (
                <Link
                  key={item.id || itemSlug}
                  href={itemHref}
                  className={`category-tree__child ${isActive ? 'active' : ''}`}
                >
                  {getNodeName(item)}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}