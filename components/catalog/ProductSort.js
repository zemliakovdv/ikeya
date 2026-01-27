// components/catalog/ProductSort.js
'use client';

import { useState, useCallback } from 'react';

export default function ProductSort() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевле' },
    { value: 'price-desc', label: 'Сначала дороже' },
    { value: 'name-asc', label: 'По названию (А-Я)' },
  ];

  const currentLabel = sortOptions.find(opt => opt.value === selectedSort)?.label;

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelectSort = useCallback((value) => {
    setSelectedSort(value);
    setIsOpen(false);
  }, []);

  return (
    <div className="all-catalog-sort">
      <div className="catalog-sort">
        <div className="catalog-sort__selected" onClick={toggleDropdown}>
          <span className="catalog-sort__current">{currentLabel}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z" fill="#757575"/>
          </svg>
        </div>
        {isOpen && (
          <ul className="catalog-sort__dropdown">
            {sortOptions.map((option) => (
              <li
                key={option.value}
                className={`catalog-sort__option ${selectedSort === option.value ? 'active' : ''}`}
                data-sort={option.value}
                onClick={() => handleSelectSort(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
