// components/catalog/sidebar/CheckboxFilter.js
'use client';

import { useState, useCallback } from 'react';

export default function CheckboxFilter({ title, options = [], showMore = false }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback((value) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const visibleOptions = showMore && !isExpanded ? options.slice(0, 5) : options;

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>{title}</span>
        <span className="toggle-icon">
          <img src="/assets/img/icons/arrow-down.svg" alt="" />
        </span>
      </div>
      <div className="brand-grid">
        {visibleOptions.map((option) => (
          <label key={option.value} className="brand-checkbox">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option.value)}
              onChange={() => handleToggle(option.value)}
            />
            <span className="custom-checkbox"></span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {showMore && options.length > 5 && (
        <button className="show-more" onClick={toggleExpanded}>
          {isExpanded ? 'Скрыть' : `Ещё ${options.length - 5}`}
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </button>
      )}
    </div>
  );
}
