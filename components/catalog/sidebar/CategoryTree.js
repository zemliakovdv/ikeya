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

function buildUrl(slugs) {
  return slugs.length ? `/catalog/${slugs.join('/')}` : '/catalog';
}

export default function CategoryTree({ treeData = [], slugChain = [] }) {
  const pathname = usePathname();
  const roots = Array.isArray(treeData) ? treeData : [];

  // ── Уровень 0: /catalog ──────────────────────────────────────────────────
  if (!slugChain || slugChain.length === 0) {
    return (
      <div className="category-sidebar">
        <h3 className="category-sidebar__title">Категория</h3>
        <nav className="category-tree">
          {roots.map((cat) => {
            const slug = cat?.attributes?.slug;
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

  // ── Уровень 1+: ищем узел в дереве по slugChain ──────────────────────────
  const { node, ancestors, siblings } = findNodeInTree(roots, slugChain);

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

  const children = node.children || [];
  const hasChildren = children.length > 0;

  // Список для вывода под текущей:
  // есть дети — показываем детей, нет — показываем siblings
  const subItems = hasChildren ? children : siblings.filter((s) => s.id !== node.id);
  // URL для subItems строится относительно slugChain (дети) или его родителя (siblings)
  const subItemsBaseSlugs = hasChildren ? slugChain : slugChain.slice(0, -1);

  return (
    <div className="category-sidebar">
      <h3 className="category-sidebar__title">Категория</h3>
      <nav className="category-tree">

        {/* Кнопка возврата на уровень 0 */}
        <Link href="/catalog" className="category-tree__back">
          ‹ Все категории
        </Link>

        {/* Вся цепочка предков — каждый со ссылкой назад */}
        {ancestors.map((ancestor, index) => {
          const ancestorHref = buildUrl(slugChain.slice(0, index + 1));
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

        {/* Текущая категория — выделена */}
        <div className="category-tree__current">
          {getNodeName(node)}
        </div>

        {/* Дети (если есть) или siblings (если детей нет) */}
        {subItems.length > 0 && (
          <div className="category-tree__children">
            {subItems.map((item) => {
              const itemSlug = item?.attributes?.slug;
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