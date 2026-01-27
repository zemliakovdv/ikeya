// components/catalog/FilterChips.js
'use client';

import { useCallback } from 'react';

export default function FilterChips({ filters = {} }) {
  // Моковые активные фильтры (замени на реальные из props)
  const activeFilters = [
    { id: 1, type: 'collection', label: 'SEGERN', value: 'segern' },
    { id: 2, type: 'price', label: 'Цена: 100 ₽ — 10 000 ₽', value: 'price-range' },
    { id: 3, type: 'color', label: 'Бежевый', value: 'beige' },
  ];

  const handleRemoveFilter = useCallback((filterId) => {
    // TODO: Логика удаления фильтра
    console.log('Remove filter:', filterId);
  }, []);

  const handleClearAll = useCallback(() => {
    // TODO: Очистить все фильтры
    console.log('Clear all filters');
  }, []);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="all-catalog-cheaps">
      {activeFilters.map((filter) => (
        <div key={filter.id} className="catalog-cheaps-item">
          <p>
            <span>{filter.label}</span>
          </p>
          <button
            className="cheaps-item-delete"
            onClick={() => handleRemoveFilter(filter.id)}
            aria-label={`Удалить фильтр ${filter.label}`}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.2083 10.6683C10.0883 10.6683 9.975 10.6217 9.88833 10.535L5.335 5.98167L0.781667 10.535C0.601667 10.715 0.315 10.715 0.135 10.535C-0.045 10.355 -0.045 10.0683 0.135 9.88833L4.68833 5.335L0.135 0.781667C-0.045 0.601667 -0.045 0.315 0.135 0.135C0.315 -0.045 0.601667 -0.045 0.781667 0.135L5.335 4.68833L9.88833 0.135C10.0683 -0.045 10.355 -0.045 10.535 0.135C10.715 0.315 10.715 0.601667 10.535 0.781667L5.98167 5.335L10.535 9.88833C10.715 10.0683 10.715 10.355 10.535 10.535C10.4483 10.6217 10.3283 10.6683 10.215 10.6683H10.2083Z" fill="#757575"/>
            </svg>
          </button>
        </div>
      ))}
      {/* Раскомментируй если нужна кнопка "Очистить всё" */}
      {/* <button className="cheaps-clean" onClick={handleClearAll}>
        Очистить всё
      </button> */}
    </div>
  );
}
