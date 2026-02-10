// components/catalog/sidebar/CategoryNav.js
'use client';

import Link from 'next/link';

export default function CategoryNav({ 
  currentCategory = null,
  parentCategory = null,
  grandParentCategory = null,
  greatGrandParentCategory = null,
  subcategories = [],
  rootCategories = [],
  level = 0 
}) {
  // Построение URL для категории
  const buildCategoryUrl = (categoryChain) => {
    const slugs = categoryChain
      .filter(Boolean)
      .map(cat => cat.attributes.ikea_id);
    return `/catalog/${slugs.join('/')}`;
  };

  // Уровень 0 - главная страница каталога (показываем корневые категории)
  if (level === 0) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категория</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <ul className="category-list grand-catalog">
          {rootCategories.map((category) => (
            <li key={category.id} className="category-item">
              <Link 
                href={`/catalog/${category.ikea_id}`}
                className="category-link"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Если нет текущей категории - не показываем навигацию
  if (!currentCategory) {
    return null;
  }

  // Уровень 1 - показываем текущую категорию с подкатегориями
  if (level === 1) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категория</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <ul className="category-list">
          {/* Возврат ко всем категориям */}
          <li className="category-item">
            <Link href="/catalog" className="category-link">
              <span className="category-back-icon">←</span> Все категории
            </Link>
          </li>
          
          {/* Текущая категория с подкатегориями */}
          <li className="category-item active">
            <Link 
              href={buildCategoryUrl([currentCategory])} 
              className="category-link active-link"
            >
              {currentCategory.attributes.translated_name}
            </Link>
            
            {subcategories.length > 0 && (
              <ul className="subcategory-list">
                {subcategories.map((sub) => (
                  <li key={sub.id} className="subcategory-item">
                    <Link 
                      href={buildCategoryUrl([currentCategory, sub])}
                      className="subcategory-link"
                    >
                      {sub.attributes.translated_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    );
  }

  // Уровень 2 - показываем родителя и текущую категорию с подкатегориями
  if (level === 2) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категория</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <ul className="category-list">
          {/* Возврат ко всем категориям */}
          <li className="category-item">
            <Link href="/catalog" className="category-link">
              <span className="category-back-icon">←</span> Все категории
            </Link>
          </li>
          
          {/* Родительская категория */}
          {parentCategory && (
            <li className="category-item">
              <Link 
                href={buildCategoryUrl([parentCategory])}
                className="category-link"
              >
                <span className="category-back-icon">←</span> {parentCategory.attributes.translated_name}
              </Link>
            </li>
          )}
          
          {/* Текущая категория с подкатегориями */}
          <li className="category-item active">
            <Link 
              href={buildCategoryUrl([parentCategory, currentCategory].filter(Boolean))}
              className="category-link active-link"
            >
              {currentCategory.attributes.translated_name}
            </Link>
            
            {subcategories.length > 0 && (
              <ul className="subcategory-list">
                {subcategories.map((sub) => (
                  <li key={sub.id} className="subcategory-item">
                    <Link 
                      href={buildCategoryUrl([parentCategory, currentCategory, sub].filter(Boolean))}
                      className="subcategory-link"
                    >
                      {sub.attributes.translated_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    );
  }

  // Уровень 3 - показываем дедушку, родителя и текущую с подкатегориями
  if (level === 3) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категория</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <ul className="category-list">
          {/* Возврат ко всем категориям */}
          <li className="category-item">
            <Link href="/catalog" className="category-link">
              <span className="category-back-icon">←</span> Все категории
            </Link>
          </li>
          
          {/* Дедушка */}
          {grandParentCategory && (
            <li className="category-item">
              <Link 
                href={buildCategoryUrl([grandParentCategory])}
                className="category-link"
              >
                <span className="category-back-icon">←</span> {grandParentCategory.attributes.translated_name}
              </Link>
            </li>
          )}
          
          {/* Родитель */}
          {parentCategory && (
            <li className="category-item">
              <Link 
                href={buildCategoryUrl([grandParentCategory, parentCategory].filter(Boolean))}
                className="category-link"
              >
                <span className="category-back-icon">←</span> {parentCategory.attributes.translated_name}
              </Link>
            </li>
          )}
          
          {/* Текущая категория с подкатегориями */}
          <li className="category-item active">
            <Link 
              href={buildCategoryUrl([grandParentCategory, parentCategory, currentCategory].filter(Boolean))}
              className="category-link active-link"
            >
              {currentCategory.attributes.translated_name}
            </Link>
            
            {subcategories.length > 0 && (
              <ul className="subcategory-list">
                {subcategories.map((sub) => (
                  <li key={sub.id} className="subcategory-item">
                    <Link 
                      href={buildCategoryUrl([grandParentCategory, parentCategory, currentCategory, sub].filter(Boolean))}
                      className="subcategory-link"
                    >
                      {sub.attributes.translated_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    );
  }

  // Уровень 4+ - полная иерархия
  if (level >= 4) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категория</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <ul className="category-list">
          {/* Возврат ко всем категориям */}
          <li className="category-item">
            <Link href="/catalog" className="category-link">
              <span className="category-back-icon">←</span> Все категории
            </Link>
          </li>
          
          {/* Прапрадедушка */}
          {greatGrandParentCategory && (
            <li className="category-item">
              <Link 
                href={buildCategoryUrl([greatGrandParentCategory])}
                className="category-link"
              >
                <span className="category-back-icon">←</span> {greatGrandParentCategory.attributes.translated_name}
              </Link>
            </li>
          )}
          
          {/* Дедушка */}
          {grandParentCategory && (
            <li className="category-item">
              <Link 
                href={buildCategoryUrl([greatGrandParentCategory, grandParentCategory].filter(Boolean))}
                className="category-link"
              >
                <span className="category-back-icon">←</span> {grandParentCategory.attributes.translated_name}
              </Link>
            </li>
          )}
          
          {/* Родитель */}
          {parentCategory && (
            <li className="category-item">
              <Link 
                href={buildCategoryUrl([greatGrandParentCategory, grandParentCategory, parentCategory].filter(Boolean))}
                className="category-link"
              >
                <span className="category-back-icon">←</span> {parentCategory.attributes.translated_name}
              </Link>
            </li>
          )}
          
          {/* Текущая категория с подкатегориями */}
          <li className="category-item active">
            <Link 
              href={buildCategoryUrl([greatGrandParentCategory, grandParentCategory, parentCategory, currentCategory].filter(Boolean))}
              className="category-link active-link"
            >
              {currentCategory.attributes.translated_name}
            </Link>
            
            {subcategories.length > 0 && (
              <ul className="subcategory-list">
                {subcategories.map((sub) => (
                  <li key={sub.id} className="subcategory-item">
                    <Link 
                      href={buildCategoryUrl([greatGrandParentCategory, grandParentCategory, parentCategory, currentCategory, sub].filter(Boolean))}
                      className="subcategory-link"
                    >
                      {sub.attributes.translated_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    );
  }

  return null;
}
