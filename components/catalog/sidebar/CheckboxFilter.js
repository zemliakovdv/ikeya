'use client';

import { useState } from 'react';

export default function CheckboxFilter({ 
  title, 
  options = [], 
  showMore = false,
  expandLimit = 15,
  onChange 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  const visibleOptions = showMore && !isExpanded 
    ? options.slice(0, expandLimit) 
    : options;

  const handleChange = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    setSelectedValues(newValues);
    onChange && onChange(newValues);
  };

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>{title}</span>
        <span className="toggle-icon">
          <img src="/assets/img/icons/arrow-down.svg" alt="" />
        </span>
      </div>
      
      <div className="brand-grid">
        {visibleOptions.map(option => (
          <label key={option.value} className="brand-checkbox">
            <input 
              type="checkbox" 
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
            <span className="custom-checkbox"></span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      
      {showMore && options.length > expandLimit && (
        <button 
          className="show-more"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Скрыть' : `Еще ${options.length - expandLimit}`}
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </button>
      )}
    </div>
  );
}
