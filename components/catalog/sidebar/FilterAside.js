'use client';

import CategoryNav from './CategoryNav';
import PriceFilter from './PriceFilter';
import CollectionFilter from './CollectionFilter';
import CheckboxFilter from './CheckboxFilter';
import ColorFilter from './ColorFilter';

export default function FilterAside({ filters = {}, currentLevel = 0, onFilterChange }) {
  const handlePriceChange = (priceRange) => {
    onFilterChange && onFilterChange({ type: 'price', value: priceRange });
  };

  const handleCollectionChange = (collections) => {
    onFilterChange && onFilterChange({ type: 'collections', value: collections });
  };

  const handleCheckboxChange = (filterType, values) => {
    onFilterChange && onFilterChange({ type: filterType, value: values });
  };

  const handleColorChange = (colors) => {
    onFilterChange && onFilterChange({ type: 'colors', value: colors });
  };

  const handleClearFilters = () => {
    onFilterChange && onFilterChange({ type: 'clear' });
  };

  return (
    <aside className="filter-aside">
      <CategoryNav 
        categories={filters.categories || []} 
        level={currentLevel}
      />

      <PriceFilter 
        min={filters.priceMin || 19.99}
        max={filters.priceMax || 4999}
        onChange={handlePriceChange}
      />

      <CollectionFilter 
        collections={filters.collections || []}
        showMore={true}
        onChange={handleCollectionChange}
      />

      {filters.width && (
        <CheckboxFilter 
          title="Ширина"
          options={filters.width}
          onChange={(values) => handleCheckboxChange('width', values)}
        />
      )}

      {filters.height && (
        <CheckboxFilter 
          title="Высота"
          options={filters.height}
          onChange={(values) => handleCheckboxChange('height', values)}
        />
      )}

      {filters.depth && (
        <CheckboxFilter 
          title="Глубина"
          options={filters.depth}
          onChange={(values) => handleCheckboxChange('depth', values)}
        />
      )}

      {filters.length && (
        <CheckboxFilter 
          title="Длина"
          options={filters.length}
          onChange={(values) => handleCheckboxChange('length', values)}
        />
      )}

      {filters.materials && (
        <CheckboxFilter 
          title="Материал"
          options={filters.materials}
          showMore={true}
          expandLimit={9}
          onChange={(values) => handleCheckboxChange('materials', values)}
        />
      )}

      {filters.colors && (
        <ColorFilter 
          colors={filters.colors}
          showMore={true}
          onChange={handleColorChange}
        />
      )}

      {filters.seats && (
        <CheckboxFilter 
          title="Количество мест"
          options={filters.seats}
          showMore={true}
          expandLimit={7}
          onChange={(values) => handleCheckboxChange('seats', values)}
        />
      )}

      {filters.shape && (
        <CheckboxFilter 
          title="Форма"
          options={filters.shape}
          showMore={true}
          expandLimit={9}
          onChange={(values) => handleCheckboxChange('shape', values)}
        />
      )}

      <button 
        className="apply-filters"
        onClick={handleClearFilters}
      >
        Очистить фильтры
      </button>
    </aside>
  );
}
