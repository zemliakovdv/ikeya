// components/catalog/sidebar/PriceFilter.js
'use client';

import { useState, useCallback } from 'react';

export default function PriceFilter() {
  const [minPrice, setMinPrice] = useState(19.99);
  const [maxPrice, setMaxPrice] = useState(4999);

  const handleMinChange = useCallback((e) => {
    const value = parseFloat(e.target.value);
    if (value <= maxPrice) {
      setMinPrice(value);
    }
  }, [maxPrice]);

  const handleMaxChange = useCallback((e) => {
    const value = parseFloat(e.target.value);
    if (value >= minPrice) {
      setMaxPrice(value);
    }
  }, [minPrice]);

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>Цена</span>
      </div>
      <div className="price-slider">
        <div className="price-slider-fill"></div>
        <div className="slider-handle handle-min"></div>
        <div className="slider-handle handle-max"></div>
      </div>
      <div className="price-range">
        <input
          type="number"
          className="price-input"
          placeholder="Мин"
          value={minPrice}
          onChange={handleMinChange}
        />
        <input
          type="number"
          className="price-input"
          placeholder="Макс"
          value={maxPrice}
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
}
