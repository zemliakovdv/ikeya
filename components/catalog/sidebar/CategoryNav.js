// components/catalog/sidebar/CategoryNav.js
'use client';

import Link from 'next/link';

export default function CategoryNav({ 
  currentCategory, 
  categorySlug, 
  parentCategory = null,
  grandParentCategory = null,
  greatGrandParentCategory = null,
  subcategories = [], 
  level = 0 
}) {
  // Моковые категории
  const allCategories = [
    { id: 1, name: 'Мебель для дома', slug: 'furniture' },
    { id: 2, name: 'Кухонная мебель', slug: 'kitchen' },
    { id: 3, name: 'Спальня', slug: 'bedroom' },
    { id: 4, name: 'Гостиная', slug: 'living-room' },
    { id: 5, name: 'Детская', slug: 'kids' },
    { id: 6, name: 'Ванная', slug: 'bathroom' },
    { id: 7, name: 'Офис', slug: 'office' },
    { id: 8, name: 'Хранение', slug: 'storage' },
  ];

  // Моковые подкатегории уровня 1
  const mockSubcategoriesLevel1 = [
    { id: 1, name: 'Садовая и балконная мебель', slug: 'garden-furniture' },
    { id: 2, name: 'Декор для сада', slug: 'garden-decor' },
    { id: 3, name: 'Балконная мебель', slug: 'balcony-furniture' },
    { id: 4, name: 'Текстиль для улицы', slug: 'outdoor-textile' },
    { id: 5, name: 'Освещение для сада', slug: 'garden-lighting' },
  ];

  // Моковые подкатегории уровня 2
  const mockSubcategoriesLevel2 = [
    { id: 1, name: 'Столы', slug: 'tables' },
    { id: 2, name: 'Стулья', slug: 'chairs' },
    { id: 3, name: 'Диваны', slug: 'sofas' },
    { id: 4, name: 'Кресла', slug: 'armchairs' },
    { id: 5, name: 'Скамейки', slug: 'benches' },
  ];

  // Моковые подкатегории уровня 3
  const mockSubcategoriesLevel3 = [
    { id: 1, name: 'Садовая мебель', slug: 'garden' },
    { id: 2, name: 'Балконная мебель', slug: 'balcony' },
    { id: 3, name: 'Терраса', slug: 'terrace' },
    { id: 4, name: 'Патио', slug: 'patio' },
    { id: 5, name: 'Веранда', slug: 'veranda' },
  ];

  // Моковые подкатегории уровня 4
  const mockSubcategoriesLevel4 = subcategories.length > 0 ? subcategories : [
    { id: 1, name: 'Садовые стулья и кресла', slug: 'garden-chairs' },
    { id: 2, name: 'Складные стулья', slug: 'folding-chairs' },
    { id: 3, name: 'Кресла-качалки', slug: 'rocking-chairs' },
  ];

  // Уровень 0 - главная каталога
  if (level === 0) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категории</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <ul className="category-list grand-catalog">
          {allCategories.map((category) => (
            <li key={category.id} className="category-item">
              <Link href={`/catalog/${category.slug}`} className="category-link">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Уровень 1 - категория с подкатегориями
  if (level === 1) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категории</span>
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
          <li className="category-item active has-subcotegory">
            <Link href={`/catalog/${categorySlug}`} className="category-link">
              {currentCategory}
            </Link>
            {mockSubcategoriesLevel1.length > 0 && (
              <ul className="subcategory-list">
                {mockSubcategoriesLevel1.map((sub) => (
                  <li key={sub.id} className="subcategory-item">
                    <Link 
                      href={`/catalog/${categorySlug}/${sub.slug}`} 
                      className="subcategory-link"
                    >
                      {sub.name}
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

  // Уровень 2
  if (level === 2) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категории</span>
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
          <li className="category-item">
            <Link href={`/catalog/${categorySlug}`} className="category-link">
              {currentCategory}
            </Link>
          </li>
          {parentCategory && (
            <li className="category-item active has-subcotegory">
              <Link 
                href={`/catalog/${categorySlug}/${parentCategory.slug}`} 
                className="category-link"
              >
                {parentCategory.name}
              </Link>
              {mockSubcategoriesLevel2.length > 0 && (
                <ul className="subcategory-list">
                  {mockSubcategoriesLevel2.map((sub) => (
                    <li key={sub.id} className="subcategory-item">
                      <Link 
                        href={`/catalog/${categorySlug}/${parentCategory.slug}/${sub.slug}`} 
                        className="subcategory-link"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    );
  }

  // Уровень 3
  if (level === 3) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категории</span>
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
          {grandParentCategory && (
            <li className="category-item">
              <Link href={`/catalog/${categorySlug}`} className="category-link">
                {grandParentCategory.name}
              </Link>
            </li>
          )}
          {parentCategory && (
            <li className="category-item">
              <Link 
                href={`/catalog/${categorySlug}/${parentCategory.slug}`} 
                className="category-link"
              >
                {parentCategory.name}
              </Link>
            </li>
          )}
          <li className="category-item has-subcotegory">
            <ul className="subcategory-list">
              {mockSubcategoriesLevel3.map((sub) => (
                <li 
                  key={sub.id} 
                  className={`subcategory-item ${sub.name === currentCategory ? 'active' : ''}`}
                >
                  <Link 
                    href={`/catalog/${categorySlug}/${parentCategory?.slug}/${sub.slug}`} 
                    className="subcategory-link"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    );
  }

  // Уровень 4 - все родители + текущая категория в подкатегориях
  if (level === 4) {
    return (
      <div className="filter-section">
        <div className="section-title">
          <span>Категории</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <ul className="category-list">
          {/* Все категории */}
          <li className="category-item">
            <Link href="/catalog" className="category-link">
              Все категории
            </Link>
          </li>

          {/* Прапрадед (уровень 1) */}
          {greatGrandParentCategory && (
            <li className="category-item">
              <Link href={`/catalog/${categorySlug}`} className="category-link">
                {greatGrandParentCategory.name}
              </Link>
            </li>
          )}

          {/* Дедушка (уровень 2) */}
          {grandParentCategory && (
            <li className="category-item">
              <Link 
                href={`/catalog/${categorySlug}/${grandParentCategory.slug}`} 
                className="category-link"
              >
                {grandParentCategory.name}
              </Link>
            </li>
          )}

          {/* Родитель (уровень 3) */}
          {parentCategory && (
            <li className="category-item">
              <Link 
                href={`/catalog/${categorySlug}/${grandParentCategory?.slug}/${parentCategory.slug}`} 
                className="category-link"
              >
                {parentCategory.name}
              </Link>
            </li>
          )}

          {/* Текущий уровень 4 с подкатегориями */}
          <li className="category-item has-subcotegory">
            <ul className="subcategory-list">
              {mockSubcategoriesLevel4.map((sub) => (
                <li 
                  key={sub.id} 
                  className={`subcategory-item ${sub.name === currentCategory ? 'active' : ''}`}
                >
                  <Link 
                    href={`/catalog/${categorySlug}/${grandParentCategory?.slug}/${parentCategory?.slug}/${sub.slug}`} 
                    className="subcategory-link"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    );
  }

  return null;
}
