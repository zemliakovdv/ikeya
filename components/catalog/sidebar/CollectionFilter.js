// components/catalog/sidebar/CollectionFilter.js
'use client';

import { useState, useCallback } from 'react';

export default function CollectionFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState([]);

  // Моковые данные коллекций
  const collections = [
    'SEGERN', 'LACK', 'VARMANSÖ', 'TARNO', 'TORPAR',
    'HEMNES', 'BILLY', 'KALLAX', 'MALM', 'PAX',
    'LISABO', 'EKTORP', 'BRIMNES', 'NORDLI', 'TRYSIL'
  ];

  const visibleCollections = showAll ? collections : collections.slice(0, 10);

  const filteredCollections = visibleCollections.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCollection = useCallback((collection) => {
    setSelectedCollections((prev) =>
      prev.includes(collection)
        ? prev.filter((c) => c !== collection)
        : [...prev, collection]
    );
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>Коллекция</span>
        <span className="toggle-icon">
          <img src="/assets/img/icons/arrow-down.svg" alt="" />
        </span>
      </div>

      {/* Поиск по коллекциям */}
      <div className="filter-search active">
        <div className="filter-search-inner">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.2 12.54L10.52 9.86C11.4133 8.81333 11.96 7.46 11.96 5.98C11.9533 2.68 9.27333 0 5.98 0C2.68667 0 0 2.68 0 5.98C0 9.28 2.68 11.96 5.98 11.96C7.46 11.96 8.81333 11.4133 9.86 10.52L12.54 13.2C12.6333 13.2933 12.7467 13.3333 12.8667 13.3333C12.9867 13.3333 13.1067 13.2867 13.1933 13.2C13.3733 13.02 13.3733 12.7267 13.1933 12.54H13.2ZM5.98 11.0267C3.2 11.0267 0.933333 8.76 0.933333 5.98C0.933333 3.2 3.19333 0.933333 5.98 0.933333C8.76667 0.933333 11.0267 3.2 11.0267 5.98C11.0267 8.76 8.76 11.0267 5.98 11.0267Z" fill="#757575"/>
          </svg>
          <input
            className="filter-search-input"
            type="search"
            placeholder="Поиск..."
            aria-label="Поиск коллекций"
            id="collection-search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Чекбоксы коллекций */}
      <div className="brand-grid">
        {filteredCollections.map((collection) => (
          <label key={collection} className="brand-checkbox">
            <input
              type="checkbox"
              checked={selectedCollections.includes(collection)}
              onChange={() => handleToggleCollection(collection)}
            />
            <span className="custom-checkbox"></span>
            <span>{collection}</span>
          </label>
        ))}
      </div>

      {/* Кнопка "Показать больше" */}
      {collections.length > 10 && (
        <button className="show-more" onClick={toggleShowAll}>
          {showAll ? 'Скрыть' : `Ещё ${collections.length - 10}`}
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </button>
      )}
    </div>
  );
}
