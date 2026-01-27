// components/catalog/sidebar/FilterAside.js
'use client';

import { useCallback } from 'react';
import CategoryNav from './CategoryNav';
import PriceFilter from './PriceFilter';
import CollectionFilter from './CollectionFilter';
import CheckboxFilter from './CheckboxFilter';
import ColorFilter from './ColorFilter';
import FilterNotification from './FilterNotification';

export default function FilterAside({ 
  showAllFilters = false, 
  currentCategory,
  categorySlug,
  parentCategory = null,
  grandParentCategory = null,
  greatGrandParentCategory = null,
  subcategories = [],
  level = 0,
  filters = {} 
}) {
  const handleClearFilters = useCallback(() => {
    alert('Фильтры очищены! (функция будет доработана при подключении API)');
  }, []);

  return (
    <aside className="filter-aside">
      <CategoryNav 
        currentCategory={currentCategory}
        categorySlug={categorySlug}
        parentCategory={parentCategory}
        grandParentCategory={grandParentCategory}
        greatGrandParentCategory={greatGrandParentCategory}
        subcategories={subcategories}
        level={level}
      />

      <PriceFilter />
      <CollectionFilter />

      {showAllFilters && (
        <>
          <CheckboxFilter 
            title="Ширина, см"
            options={[
              { value: '0-49', label: '0 - 49 см' },
              { value: '50-99', label: '50 - 99 см' },
              { value: '100-149', label: '100 - 149 см' },
              { value: '150-199', label: '150 - 199 см' },
              { value: '200+', label: '200+ см' },
            ]}
          />

          <CheckboxFilter 
            title="Высота, см"
            options={[
              { value: '0-39', label: '0 - 39 см' },
              { value: '40-49', label: '40 - 49 см' },
              { value: '50-59', label: '50 - 59 см' },
              { value: '60-69', label: '60 - 69 см' },
              { value: '70+', label: '70+ см' },
            ]}
          />

          <CheckboxFilter 
            title="Глубина, см"
            options={[
              { value: '0-39', label: '0 - 39 см' },
              { value: '40-59', label: '40 - 59 см' },
              { value: '60-79', label: '60 - 79 см' },
              { value: '80-99', label: '80 - 99 см' },
              { value: '100+', label: '100+ см' },
            ]}
          />

          <CheckboxFilter 
            title="Длина, см"
            options={[
              { value: '0-59', label: '0 - 59 см' },
              { value: '60-79', label: '60 - 79 см' },
              { value: '80-99', label: '80 - 99 см' },
              { value: '100-119', label: '100 - 119 см' },
              { value: '120+', label: '120+ см' },
            ]}
          />

          <CheckboxFilter 
            title="Материал"
            options={[
              { value: 'wood', label: 'Дерево' },
              { value: 'metal', label: 'Металл' },
              { value: 'plastic', label: 'Пластик' },
              { value: 'rattan', label: 'Ротанг' },
              { value: 'fabric', label: 'Ткань' },
            ]}
            showMore
          />

          <ColorFilter />

          <CheckboxFilter 
            title="Количество мест"
            options={[
              { value: '1', label: '1 место' },
              { value: '2', label: '2 места' },
              { value: '2+', label: '2+ места' },
              { value: '3+', label: '3+ места' },
              { value: '4+', label: '4+ места' },
            ]}
            showMore
          />

          <CheckboxFilter 
            title="Форма"
            options={[
              { value: 'rectangular', label: 'Прямоугольная' },
              { value: 'square', label: 'Квадратная' },
              { value: 'round', label: 'Круглая' },
              { value: 'oval', label: 'Овальная' },
              { value: 'l-shaped', label: 'Г-образная' },
            ]}
            showMore
          />
        </>
      )}

      {!showAllFilters && <FilterNotification />}

      {showAllFilters && (
        <button className="apply-filters" onClick={handleClearFilters}>
          Очистить фильтры
        </button>
      )}
    </aside>
  );
}
