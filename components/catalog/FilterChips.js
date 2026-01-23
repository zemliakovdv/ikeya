'use client';

export default function FilterChips({ activeFilters = [], onRemove, onClearAll }) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="all-catalog-cheaps">
      {activeFilters.map((filter, index) => (
        <div key={index} className="catalog-cheaps-item">
          <p>
            {filter.category}: <span>{filter.value}</span>
          </p>
          <button 
            className="cheaps-item-delete"
            onClick={() => onRemove(filter)}
          >
            <img src="/assets/img/icons/close.svg" alt="Удалить" />
          </button>
        </div>
      ))}
      
      {activeFilters.length > 0 && (
        <button 
          className="catalog-cheaps-clear"
          onClick={onClearAll}
        >
          Очистить все фильтры
        </button>
      )}
    </div>
  );
}
