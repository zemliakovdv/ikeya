// components/catalog/sidebar/PriceFilter.js
'use client';

import { useCallback } from 'react';

export default function PriceFilter({ 
  min = 0, 
  max = 10000, 
  currentMin, 
  currentMax, 
  onChange 
}) {
  const handleMinChange = useCallback((e) => {
    const value = parseFloat(e.target.value);
    if (value <= currentMax && onChange) {
      onChange(value, currentMax);
    }
  }, [currentMax, onChange]);

  const handleMaxChange = useCallback((e) => {
    const value = parseFloat(e.target.value);
    if (value >= currentMin && onChange) {
      onChange(currentMin, value);
    }
  }, [currentMin, onChange]);

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>Цена</span>
      </div>
      
      <div className="price-range">
        <input
          type="number"
          className="price-input"
          placeholder="Мин"
          min={min}
          max={max}
          value={currentMin}
          onChange={handleMinChange}
        />
        <input
          type="number"
          className="price-input"
          placeholder="Макс"
          min={min}
          max={max}
          value={currentMax}
          onChange={handleMaxChange}
        />
      </div>
      
      <div className="price-display">
        <span>{currentMin} zł</span>
        <span>—</span>
        <span>{currentMax} zł</span>
      </div>
    </div>
  );
}
