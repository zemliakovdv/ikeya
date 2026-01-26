'use client';

import Link from 'next/link';

export default function CategoryNav({ categories = [], level = 0 }) {
  const renderSubcategories = (subcategories) => {
    if (!subcategories || subcategories.length === 0) return null;
    
    return (
      <ul className="subcategory-list">
        {subcategories.map(subcat => (
          <li 
            key={subcat.id}
            className={`subcategory-item ${subcat.active ? 'active' : ''}`}
          >
            <Link href={subcat.url} className="subcategory-link">
              {subcat.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>Категория</span>
        <span className="toggle-icon">
          <img src="/assets/img/icons/arrow-down.svg" alt="" />
        </span>
      </div>
      
      <ul className="category-list">
        <li className="category-item">
          <Link href="/catalog" className="category-link">
            Все категории
          </Link>
        </li>
        
        {categories.map(category => (
          <li 
            key={category.id}
            className={`category-item ${category.hasSubcategories ? 'has-subcotegory' : ''} ${category.active && !category.subcategories ? 'active' : ''}`}
          >
            {category.url && (
              <Link href={category.url} className="category-link">
                {category.name}
              </Link>
            )}
            {category.subcategories && renderSubcategories(category.subcategories)}
          </li>
        ))}
      </ul>
    </div>
  );
}
