'use client';

import { useState } from 'react';

export default function ColorFilter({ colors = [], showMore = false, onChange }) {
  const [selectedColors, setSelectedColors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleColors = showMore && !isExpanded ? colors.slice(0, 9) : colors;
  const hiddenCount = colors.length - 9;

  const handleChange = (colorValue) => {
    const newColors = selectedColors.includes(colorValue)
      ? selectedColors.filter(c => c !== colorValue)
      : [...selectedColors, colorValue];
    
    setSelectedColors(newColors);
    onChange && onChange(newColors);
  };

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>Цвет</span>
        <span className="toggle-icon">
          <img src="/assets/img/icons/arrow-down.svg" alt="" />
        </span>
      </div>
      
      <div className="brand-grid">
        {visibleColors.map(color => (
          <label key={color.value} className="brand-checkbox">
            <input 
              type="checkbox" 
              value={color.value}
              checked={selectedColors.includes(color.value)}
              onChange={() => handleChange(color.value)}
            />
            <span className="custom-checkbox"></span>
            <div 
              className={`color-option color-${color.value} ${selectedColors.includes(color.value) ? 'active' : ''}`}
              title={color.label}
            ></div>
            <span>{color.label}</span>
          </label>
        ))}
      </div>

      {showMore && hiddenCount > 0 && (
        <button 
          className="show-more"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Скрыть' : `Еще ${hiddenCount}`}
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </button>
      )}
    </div>
  );
}
