// components/Catalog/ProductGrid.jsx
'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import AppliedFilters from './AppliedFilters';
import Pagination from './Pagination';

export default function ProductGrid({ 
    products = [],
    appliedFilters = [],
    showFilters = true,
    currentPage = 1,
    totalPages = 16
}) {
    const [sortOpen, setSortOpen] = useState(false);
    const [currentSort, setCurrentSort] = useState('По популярности');

    const sortOptions = [
        { label: 'По популярности', value: 'popular' },
        { label: 'Цена: по возрастанию', value: 'price-asc' },
        { label: 'Цена: по убыванию', value: 'price-desc' },
        { label: 'Название: А-Я', value: 'name-asc' }
    ];

    return (
        <div className="all-catalog-cards">
            {/* Сортировка */}
            <div className="all-catalog-sort">
                <div className="catalog-sort">
                    <div 
                        className="catalog-sortselected"
                        onClick={() => setSortOpen(!sortOpen)}
                    >
                        <span className="catalog-sortcurrent">{currentSort}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z" fill="#757575"/>
                        </svg>
                    </div>
                    {sortOpen && (
                        <ul className="catalog-sortdropdown">
                            {sortOptions.map((option, index) => (
                                <li 
                                    key={index}
                                    className={`catalog-sortoption ${currentSort === option.label ? 'active' : ''}`}
                                    data-sort={option.value}
                                    onClick={() => {
                                        setCurrentSort(option.label);
                                        setSortOpen(false);
                                    }}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Примененные фильтры */}
            <AppliedFilters filters={appliedFilters} show={showFilters} />

            {/* Сетка товаров */}
            <div className="all-catalog-items">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>

            {/* Пагинация */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages}
                show={totalPages > 1}
            />
        </div>
    );
}
