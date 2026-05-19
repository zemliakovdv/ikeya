// components/catalog/sidebar/PriceFilter.js
'use client';

import { useState, useCallback, useEffect } from 'react';

export default function PriceFilter({
  min = 0,
  max = 10000,
  currentMin,
  currentMax,
  onChange
}) {
  const [localMin, setLocalMin] = useState(currentMin ?? min)
  const [localMax, setLocalMax] = useState(currentMax ?? max)
  const [inputMin, setInputMin] = useState(String(currentMin ?? min))
  const [inputMax, setInputMax] = useState(String(currentMax ?? max))

  useEffect(() => {
    setLocalMin(currentMin ?? min)
    setLocalMax(currentMax ?? max)
    setInputMin(String(currentMin ?? min))
    setInputMax(String(currentMax ?? max))
  }, [currentMin, currentMax, min, max])

  const pct = (val) => ((val - min) / (max - min)) * 100

  const handleMinSlider = useCallback((e) => {
    const val = Math.min(Number(e.target.value), localMax - 1)
    setLocalMin(val)
    setInputMin(String(val))
  }, [localMax])

  const handleMaxSlider = useCallback((e) => {
    const val = Math.max(Number(e.target.value), localMin + 1)
    setLocalMax(val)
    setInputMax(String(val))
  }, [localMin])

  const handleMinInput = useCallback((e) => {
    setInputMin(e.target.value)
  }, [])

  const handleMaxInput = useCallback((e) => {
    setInputMax(e.target.value)
  }, [])

  function applyChange(newMin, newMax) {
    if (onChange) onChange(newMin, newMax)
  }

  const handleMinBlur = useCallback(() => {
    const raw = inputMin.replace(/[^0-9]/g, '')
    const val = raw === '' ? min : Number(raw)
    const clamped = Math.min(Math.max(val, min), localMax - 1)
    setLocalMin(clamped)
    setInputMin(String(clamped))
    if (clamped !== (currentMin ?? min)) applyChange(clamped, localMax)
  }, [inputMin, min, localMax, currentMin])

  const handleMaxBlur = useCallback(() => {
    const raw = inputMax.replace(/[^0-9]/g, '')
    const val = raw === '' ? max : Number(raw)
    const clamped = Math.max(Math.min(val, max), localMin + 1)
    setLocalMax(clamped)
    setInputMax(String(clamped))
    if (clamped !== (currentMax ?? max)) applyChange(localMin, clamped)
  }, [inputMax, max, localMin, currentMax])

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
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={() => applyChange(localMin, localMax)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={() => applyChange(localMin, localMax)}
          style={{ touchAction: 'none' }}
        />

        <input
          type="range"
          className="price-slider price-slider--max"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxSlider}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={() => applyChange(localMin, localMax)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={() => applyChange(localMin, localMax)}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Инпуты от/до */}
      <div className="price-inputs">
        <div className="price-input-group">
          <label className="price-input-label">от</label>
          <input
            type="text"
            inputMode="numeric"
            className="price-input"
            value={inputMin}
            onChange={handleMinInput}
            onBlur={handleMinBlur}
          />
        </div>
        <div className="price-input-group">
          <label className="price-input-label">до</label>
          <input
            type="text"
            inputMode="numeric"
            className="price-input"
            value={inputMax}
            onChange={handleMaxInput}
            onBlur={handleMaxBlur}
          />
        </div>
      </div>
    </div>
  )
}