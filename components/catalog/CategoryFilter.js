import Link from 'next/link';

const collections = [
  'SEGERÖN', 'LACKÖ', 'VARMANSO', 'TARNO', 'TORPARÖ',
  'SEGERÖN', 'LACKÖ', 'VARMANSO', 'TARNO', 'TORPARÖ'
];

export default function CategoryFilter({ 
  level = 1, // 1, 2, 3 или 4
  breadcrumbCategories = [], // [{label: 'Сад и балкон', href: '/...'}]
  activeCategory = '', // Активная категория
  subcategories = [] // [{label: '...', href: '...', active: false}]
}) {
  const showToggleIcon = level >= 3;

  return (
    <aside className="filter-aside">
      {/* Категории */}
      <div className="filter-section">
        <div className="section-title">
          <span>Категория</span>
          {showToggleIcon && (
            <span className="toggle-icon">
              <img src="/assets/img/icons/arrow-down.svg" alt="" />
            </span>
          )}
        </div>
        <ul className="category-list">
          {/* Все категории */}
          <li className="category-item">
            <Link href="/catalog" className="category-link">
              Все категории
            </Link>
          </li>
          
          {/* Breadcrumb категорий */}
          {breadcrumbCategories.map((cat, index) => (
            <li key={index} className="category-item">
              <Link href={cat.href} className="category-link">
                {cat.label}
              </Link>
            </li>
          ))}
          
          {/* Активная категория */}
          {level === 1 && activeCategory && (
            <li className="category-item active">
              <Link href="#" className="category-link">
                {activeCategory}
              </Link>
            </li>
          )}
          
          {level === 2 && activeCategory && (
            <li className="category-item active">
              <Link href="#" className="category-link">
                {activeCategory}
              </Link>
            </li>
          )}
          
          {/* Подкатегории */}
          {subcategories.length > 0 && (
            <li className="category-item has-subcotegory">
              <ul className="subcategory-list">
                {subcategories.map((subcat, index) => (
                  <li 
                    key={index} 
                    className={`subcategory-item ${subcat.active ? 'active' : ''}`}
                  >
                    <Link href={subcat.href} className="subcategory-link">
                      {subcat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>

      {/* Цена */}
      <div className="filter-section">
        <div className="section-title">
          <span>Цена</span>
        </div>
        <div className="price-slider">
          <div className="price-slider-fill"></div>
          <div className="slider-handle handle-min"></div>
          <div className="slider-handle handle-max"></div>
        </div>
        <div className="price-range">
          <input type="number" className="price-input" placeholder="от" defaultValue="19.99" />
          <input type="number" className="price-input" placeholder="до" defaultValue="4999" />
        </div>
      </div>

      {/* Коллекции */}
      <div className="filter-section">
        <div className="section-title">
          <span>Коллекции</span>
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </div>
        <div className="filter-search active">
          <div className="filter-search-inner">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.2 12.54L10.52 9.86C11.4133 8.81333 11.96 7.46 11.96 5.98C11.9533 2.68 9.27333 0 5.98 0C2.68667 0 0 2.68 0 5.98C0 9.28 2.68 11.96 5.98 11.96C7.46 11.96 8.81333 11.4133 9.86 10.52L12.54 13.2C12.6333 13.2933 12.7467 13.3333 12.8667 13.3333C12.9867 13.3333 13.1067 13.2867 13.1933 13.2C13.3733 13.02 13.3733 12.7267 13.1933 12.54H13.2ZM5.98 11.0267C3.2 11.0267 0.933333 8.76 0.933333 5.98C0.933333 3.2 3.19333 0.933333 5.98 0.933333C8.76667 0.933333 11.0267 3.2 11.0267 5.98C11.0267 8.76 8.76 11.0267 5.98 11.0267Z" fill="#757575"/>
            </svg>
            <input className="filter-search-input" type="search" placeholder="Поиск" aria-label="Поиск" id="collection-search" />
          </div>
        </div>
        <div className="brand-grid">
          {collections.map((collection, index) => (
            <label key={index} className="brand-checkbox">
              <input type="checkbox" />
              <span className="custom-checkbox"></span>
              <span>{collection}</span>
            </label>
          ))}
        </div>
        <button className="show-more">
          Еще 75 <span className="toggle-icon"><img src="/assets/img/icons/arrow-down.svg" alt="" /></span>
        </button>
      </div>

      <p className="filter-notification">
        Для просмотра всех фильтров выберите конечную ветку категории
      </p>

      <button className="apply-filters" style={{display: 'none'}}>
        Очистить фильтры
      </button>
    </aside>
  );
}
