// components/catalog/sidebar/ColorFilter.js
'use client';

import { useState, useCallback } from 'react';

export default function ColorFilter() {
  const [selectedColors, setSelectedColors] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const colors = [
    { id: 'beige', name: 'Бежевый', class: 'color-beige' },
    { id: 'gray', name: 'Серый', class: 'color-gray' },
    { id: 'brown', name: 'Коричневый', class: 'color-brown' },
    { id: 'white', name: 'Белый', class: 'color-white' },
    { id: 'multicolor', name: 'Разноцветный', class: 'color-multicolor' },
    { id: 'black', name: 'Черный', class: 'color-black' },
    { id: 'blue', name: 'Синий', class: 'color-blue' },
    { id: 'green', name: 'Зеленый', class: 'color-green' },
    { id: 'red', name: 'Красный', class: 'color-red' },
  ];

  const visibleColors = showAll ? colors : colors.slice(0, 5);

  const handleToggleColor = useCallback((colorId) => {
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
  }, []);

  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>Цвет</span>
        <span className="toggle-icon">
          <img src="/assets/img/icons/arrow-down.svg" alt="" />
        </span>
      </div>
      <div className="brand-grid">
        {visibleColors.map((color) => (
          <label key={color.id} className="brand-checkbox">
            <input
              type="checkbox"
              checked={selectedColors.includes(color.id)}
              onChange={() => handleToggleColor(color.id)}
            />
            <span className="custom-checkbox"></span>
            <div className={`color-option ${color.class} ${selectedColors.includes(color.id) ? 'active' : ''}`} title={color.name}></div>
            <span>{color.name}</span>
          </label>
        ))}
      </div>
      {colors.length > 5 && (
        <button className="show-more" onClick={toggleShowAll}>
          {showAll ? 'Скрыть' : `Ещё ${colors.length - 5}`}
          <span className="toggle-icon">
            <img src="/assets/img/icons/arrow-down.svg" alt="" />
          </span>
        </button>
      )}
    </div>
  );
}
