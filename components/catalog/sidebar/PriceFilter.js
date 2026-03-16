// components/catalog/sidebar/PriceFilter.js
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export default function PriceFilter({
  min = 0,
  max = 10000,
  currentMin,
  currentMax,
  onChange
}) {
  const [localMin, setLocalMin] = useState(currentMin ?? min)
  const [localMax, setLocalMax] = useState(currentMax ?? max)

  useEffect(() => {
    setLocalMin(currentMin ?? min)
    setLocalMax(currentMax ?? max)
  }, [currentMin, currentMax, min, max])

  const pct = (val) => ((val - min) / (max - min)) * 100

  const handleMinSlider = useCallback((e) => {
    const val = Math.min(Number(e.target.value), localMax - 1)
    setLocalMin(val)
  }, [localMax])

  const handleMaxSlider = useCallback((e) => {
    const val = Math.max(Number(e.target.value), localMin + 1)
    setLocalMax(val)
  }, [localMin])

  const handleMinInput = useCallback((e) => {
    const val = e.target.value === '' ? min : Number(e.target.value)
    setLocalMin(Math.min(val, localMax - 1))
  }, [min, localMax])

  const handleMaxInput = useCallback((e) => {
    const val = e.target.value === '' ? max : Number(e.target.value)
    setLocalMax(Math.max(val, localMin + 1))
  }, [max, localMin])

  function applyChange(newMin, newMax) {
    if (onChange) onChange(newMin, newMax)
  }

  return (
    <div className="filter-section price-filter">
      <div className="section-title">
        <span>Цена</span>
      </div>

      {/* Двойной слайдер */}
      <div className="price-slider-wrapper">
        <div className="price-slider-track">
          <div
            className="price-slider-range"
            style={{
              left: `${pct(localMin)}%`,
              width: `${pct(localMax) - pct(localMin)}%`
            }}
          />
        </div>

        <input
          type="range"
          className="price-slider price-slider--min"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinSlider}
          onMouseUp={() => applyChange(localMin, localMax)}
          onTouchEnd={() => applyChange(localMin, localMax)}
        />

        <input
          type="range"
          className="price-slider price-slider--max"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxSlider}
          onMouseUp={() => applyChange(localMin, localMax)}
          onTouchEnd={() => applyChange(localMin, localMax)}
        />
      </div>

      {/* Инпуты от/до */}
      <div className="price-inputs">
        <div className="price-input-group">
          <label className="price-input-label">от</label>
          <input
            type="number"
            className="price-input"
            value={localMin}
            min={min}
            max={localMax - 1}
            onChange={handleMinInput}
            onBlur={() => applyChange(localMin, localMax)}
          />
        </div>
        <div className="price-input-group">
          <label className="price-input-label">до</label>
          <input
            type="number"
            className="price-input"
            value={localMax}
            min={localMin + 1}
            max={max}
            onChange={handleMaxInput}
            onBlur={() => applyChange(localMin, localMax)}
          />
        </div>
      </div>
    </div>
  )
}