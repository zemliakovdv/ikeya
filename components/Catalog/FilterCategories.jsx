// components/Catalog/FilterCategories.jsx
'use client';

export default function FilterCategories({ 
    type = 'full',
    categories = [],
    expanded = true,
    onToggle 
}) {
    // Для catalog-search.html (плоский список)
    if (type === 'search') {
        return (
            <div className="filter-section">
                <div className="section-title">
                    <span>Категории</span>
                </div>
                <ul className="category-list grand-catalog">
                    <li className="category-item">
                        <a href="/catalog.html" className="category-link">Все товары</a>
                    </li>
                    <li className="category-item">
                        <a href="/catalog.html" className="category-link">Мебель</a>
                    </li>
                    <li className="category-item">
                        <a href="/catalog.html" className="category-link">Текстиль</a>
                    </li>
                    <li className="category-item">
                        <a href="/catalog.html" className="category-link">Декор</a>
                    </li>
                </ul>
            </div>
        );
    }

    // Для catalog-third.html и catalog-category.html (с toggle)
    const showToggle = type === 'deep';

    return (
        <div className="filter-section">
            <div className="section-title">
                <span>Категории</span>
                {showToggle && (
                    <span className="toggle-icon" onClick={onToggle}>
                        <img src="/assets/img/icons/arrow-down.svg" alt="" />
                    </span>
                )}
            </div>
            <ul className="category-list">
                {categories.map((category, index) => (
                    <li 
                        key={index}
                        className={`category-item ${category.active ? 'active' : ''} ${category.hasSubcategory ? 'has-subcotegory' : ''}`}
                    >
                        <a href={category.href} className="category-link">
                            {category.label}
                        </a>
                        
                        {category.subcategories && category.subcategories.length > 0 && (
                            <ul className="subcategory-list">
                                {category.subcategories.map((sub, subIndex) => (
                                    <li 
                                        key={subIndex}
                                        className={`subcategory-item ${sub.active ? 'active' : ''}`}
                                    >
                                        <a href={sub.href} className="subcategory-link">
                                            {sub.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
