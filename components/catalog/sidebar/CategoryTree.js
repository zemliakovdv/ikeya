// components/catalog/sidebar/CategoryTree.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CategoryTree({ 
  // Старые пропсы (из FilterAside)
  currentCategory = null,
  parentCategory = null,
  grandParentCategory = null,
  greatGrandParentCategory = null,
  subcategories = [],
  rootCategories = [],
  level = 0,
  // Новые пропсы (прямая передача)
  categoryChain = null,
  childCategories = null
}) {
  const pathname = usePathname();
  
  // Если переданы новые пропсы (прямая передача) — используем их
  if (categoryChain && categoryChain.length > 0) {
    const breadcrumb = [
      { name: 'Все категории', href: '/catalog', ikea_id: null },
      ...categoryChain.map((cat, index) => ({
        name: cat.attributes.translated_name,
        href: `/catalog/${cat.attributes.ikea_id}`,
        ikea_id: cat.attributes.ikea_id,
        level: index + 1
      }))
    ];
    
    const children = childCategories || [];
    
    return (
      <div className="category-sidebar">
        <h3 className="category-sidebar__title">Категория</h3>
        
        <nav className="category-tree">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            
            // Пропускаем "Все категории" на главной (level 0)
            if (index === 0 && breadcrumb.length === 1) {
              return null;
            }
            
            return (
              <div 
                key={item.ikea_id || 'all'} 
                className={`category-tree__item level-${index}`}
              >
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
              {children.map(child => {
                const childHref = `/catalog/${child.attributes.ikea_id}`;
                const isActive = pathname === childHref;
                
                return (
                  <Link
                    key={child.id}
                    href={childHref}
                    className={`category-tree__child ${isActive ? 'active' : ''}`}
                  >
                    {child.attributes.translated_name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    );
  }
  
  // Старая логика (из FilterAside) — строим цепочку из отдельных категорий
  const categoryChainFromProps = [];
  
  if (greatGrandParentCategory) categoryChainFromProps.push(greatGrandParentCategory);
  if (grandParentCategory) categoryChainFromProps.push(grandParentCategory);
  if (parentCategory) categoryChainFromProps.push(parentCategory);
  if (currentCategory) categoryChainFromProps.push(currentCategory);
  
  // ✅ Если level === 0 (главная страница каталога) — используем category-tree__root
  if (categoryChainFromProps.length === 0 && level === 0) {
    return (
      <div className="category-sidebar">
        <h3 className="category-sidebar__title">Категория</h3>
        <nav className="category-tree">
          {rootCategories.length > 0 && (
            <div className="category-tree__root">
              {rootCategories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/catalog/${cat.ikea_id}`}
                  className="category-tree__link"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </div>
    );
  }
  
  const breadcrumb = [
    { name: 'Все категории', href: '/catalog', ikea_id: null },
    ...categoryChainFromProps.map((cat, index) => ({
      name: cat.attributes.translated_name,
      href: `/catalog/${cat.attributes.ikea_id}`,
      ikea_id: cat.attributes.ikea_id,
      level: index + 1
    }))
  ];
  
  return (
    <div className="category-sidebar">
      <h3 className="category-sidebar__title">Категория</h3>
      
      <nav className="category-tree">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          
          return (
            <div 
              key={item.ikea_id || 'all'} 
              className={`category-tree__item level-${index}`}
            >
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
        
        {subcategories.length > 0 && (
          <div className="category-tree__children">
            {subcategories.map(child => {
              const childHref = `/catalog/${child.attributes.ikea_id}`;
              const isActive = pathname === childHref;
              
              return (
                <Link
                  key={child.id}
                  href={childHref}
                  className={`category-tree__child ${isActive ? 'active' : ''}`}
                >
                  {child.attributes.translated_name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
