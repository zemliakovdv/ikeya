'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function PriceFilter({ min = 19.99, max = 4999, onChange }) {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const sliderRef = useRef(null);
  const fillRef = useRef(null);

  // ✅ Вынесли функцию ВЫШЕ useEffect с useCallback
  const updateSliderFill = useCallback(() => {
    if (!fillRef.current) return;
    const percentMin = ((minValue - min) / (max - min)) * 100;
    const percentMax = ((maxValue - min) / (max - min)) * 100;
    fillRef.current.style.left = `${percentMin}%`;
    fillRef.current.style.width = `${percentMax - percentMin}%`;
  }, [minValue, maxValue, min, max]); // Добавили все зависимости

  // ✅ Теперь useEffect может безопасно использовать updateSliderFill
  useEffect(() => {
    updateSliderFill();
  }, [updateSliderFill]); // Зависим от updateSliderFill

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
    onChange && onChange({ min: value, max: maxValue });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
    onChange && onChange({ min: minValue, max: value });
  };

  return (
    <div className="filter-section">
      <div className="section-title">
        <span>Цена</span>
        <span className="toggle-icon">
          <img src="/assets/img/icons/arrow-down.svg" alt="" />
        </span>
      </div>
      <div className="price-slider" ref={sliderRef}>
        <div className="price-slider-fill" ref={fillRef}></div>
        <div className="slider-handle handle-min"></div>
        <div className="slider-handle handle-max"></div>
      </div>
      <div className="price-range">
        <input 
          type="number" 
          className="price-input" 
          placeholder="от" 
          value={minValue}
          onChange={handleMinChange}
          min={min}
          max={max}
        />
        <input 
          type="number" 
          className="price-input" 
          placeholder="до" 
          value={maxValue}
          onChange={handleMaxChange}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
}
