// components/catalog/sidebar/FilterAside.js
'use client';

import { useCallback } from 'react';
import CategoryNav from './CategoryTree';
import PriceFilter from './PriceFilter';
import CollectionFilter from './CollectionFilter';
import CheckboxFilter from './CheckboxFilter';
import ColorFilter from './ColorFilter';
import FilterNotification from './FilterNotification';

export default function FilterAside({ 
  showAllFilters = false,
  currentCategory = null,
  categoryData = null,
  rootCategories = [],
  level = 0,
  filters = {},
  priceRange = { min: 0, max: 10000 },
  availableCollections = [],
  onPriceChange,
  onCollectionToggle,
  onColorToggle,
  onCheckboxToggle,
  onClearFilters
}) {
  const handleClearFilters = useCallback(() => {
    if (onClearFilters) {
      onClearFilters();
    }
  }, [onClearFilters]);

  // Извлекаем данные из categoryData если он передан
  const {
    parentCategory = null,
    grandParentCategory = null,
    greatGrandParentCategory = null,
    subcategories = [],
  } = categoryData || {};

  return (
    <aside 
      className="filter-aside" 
      style={{
        position: 'sticky',
        top: '0',
        alignSelf: 'flex-start',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <CategoryNav 
        currentCategory={currentCategory}
        parentCategory={parentCategory}
        grandParentCategory={grandParentCategory}
        greatGrandParentCategory={greatGrandParentCategory}
        subcategories={subcategories}
        rootCategories={rootCategories}
        level={level}
      />

      <PriceFilter 
        min={priceRange.min}
        max={priceRange.max}
        currentMin={filters.priceMin}
        currentMax={filters.priceMax}
        onChange={onPriceChange}
      />
      
      <CollectionFilter 
        collections={availableCollections}
        selectedCollections={filters.collections || []}
        onToggle={onCollectionToggle}
      />

      {showAllFilters && (
        <>
          <CheckboxFilter 
            title="Ширина, см"
            filterKey="widths"
            selectedOptions={filters.widths || []}
            onToggle={onCheckboxToggle}
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
            filterKey="heights"
            selectedOptions={filters.heights || []}
            onToggle={onCheckboxToggle}
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
            filterKey="depths"
            selectedOptions={filters.depths || []}
            onToggle={onCheckboxToggle}
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
            filterKey="lengths"
            selectedOptions={filters.lengths || []}
            onToggle={onCheckboxToggle}
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
            filterKey="materials"
            selectedOptions={filters.materials || []}
            onToggle={onCheckboxToggle}
            options={[
              { value: 'wood', label: 'Дерево' },
              { value: 'metal', label: 'Металл' },
              { value: 'plastic', label: 'Пластик' },
              { value: 'rattan', label: 'Ротанг' },
              { value: 'fabric', label: 'Ткань' },
            ]}
            showMore
          />

          <ColorFilter 
            selectedColors={filters.colors || []}
            onToggle={onColorToggle}
          />

          <CheckboxFilter 
            title="Количество мест"
            filterKey="seats"
            selectedOptions={filters.seats || []}
            onToggle={onCheckboxToggle}
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
            filterKey="shapes"
            selectedOptions={filters.shapes || []}
            onToggle={onCheckboxToggle}
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
