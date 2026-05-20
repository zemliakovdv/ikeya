// components/catalog/sidebar/PriceFilter.js
'use client';

import { useState, useCallback, useEffect } from 'react';

const STEP = 1;

function parsePriceInput(value, fallback) {
  const normalized = String(value ?? '')
    .trim()
    .replace(',', '.')
    .replace(/[^0-9.]/g, '');

  if (normalized === '') return fallback;

  const n = Number(normalized);
  return Number.isFinite(n) ? n : fallback;
}

function clampPrice(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function PriceFilter({
  min = 0,
  max = 10000,
  currentMin,
  currentMax,
  onChange
}) {
  const safeMin = Number.isFinite(Number(min)) ? Number(min) : 0;
  const safeMax = Number.isFinite(Number(max)) && Number(max) > safeMin
    ? Number(max)
    : safeMin + STEP;

  const initialMin = clampPrice(Number(currentMin ?? safeMin), safeMin, safeMax - STEP);
  const initialMax = clampPrice(Number(currentMax ?? safeMax), initialMin + STEP, safeMax);

  const [localMin, setLocalMin] = useState(initialMin);
  const [localMax, setLocalMax] = useState(initialMax);
  const [inputMin, setInputMin] = useState(String(initialMin));
  const [inputMax, setInputMax] = useState(String(initialMax));

  useEffect(() => {
    const nextMin = clampPrice(Number(currentMin ?? safeMin), safeMin, safeMax - STEP);
    const nextMax = clampPrice(Number(currentMax ?? safeMax), nextMin + STEP, safeMax);

    setLocalMin(nextMin);
    setLocalMax(nextMax);
    setInputMin(String(nextMin));
    setInputMax(String(nextMax));
  }, [currentMin, currentMax, safeMin, safeMax]);

  const pct = useCallback((val) => {
    const range = safeMax - safeMin;

    if (range <= 0) return 0;

    const percent = ((val - safeMin) / range) * 100;
    return clampPrice(percent, 0, 100);
  }, [safeMin, safeMax]);

  const applyChange = useCallback((newMin, newMax) => {
    const nextMin = clampPrice(Number(newMin), safeMin, safeMax - STEP);
    const nextMax = clampPrice(Number(newMax), nextMin + STEP, safeMax);

    if (onChange) {
      onChange(nextMin, nextMax);
    }
  }, [onChange, safeMin, safeMax]);

  const handleMinSlider = useCallback((e) => {
    const val = Math.min(Number(e.target.value), localMax - STEP);

    setLocalMin(val);
    setInputMin(String(val));
  }, [localMax]);

  const handleMaxSlider = useCallback((e) => {
    const val = Math.max(Number(e.target.value), localMin + STEP);

    setLocalMax(val);
    setInputMax(String(val));
  }, [localMin]);

  const handleMinInput = useCallback((e) => {
    setInputMin(e.target.value);
  }, []);

  const handleMaxInput = useCallback((e) => {
    setInputMax(e.target.value);
  }, []);

  const handleMinBlur = useCallback(() => {
    const parsed = parsePriceInput(inputMin, safeMin);
    const clamped = clampPrice(parsed, safeMin, localMax - STEP);

    setLocalMin(clamped);
    setInputMin(String(clamped));

    if (clamped !== Number(currentMin ?? safeMin)) {
      applyChange(clamped, localMax);
    }
  }, [inputMin, safeMin, localMax, currentMin, applyChange]);

  const handleMaxBlur = useCallback(() => {
    const parsed = parsePriceInput(inputMax, safeMax);
    const clamped = clampPrice(parsed, localMin + STEP, safeMax);

    setLocalMax(clamped);
    setInputMax(String(clamped));

    if (clamped !== Number(currentMax ?? safeMax)) {
      applyChange(localMin, clamped);
    }
  }, [inputMax, safeMax, localMin, currentMax, applyChange]);

  return (
    <div className="filter-section price-filter">
      <div className="section-title">
        <span>Цена</span>
      </div>

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
          min={safeMin}
          max={safeMax}
          step={STEP}
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
          min={safeMin}
          max={safeMax}
          step={STEP}
          value={localMax}
          onChange={handleMaxSlider}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={() => applyChange(localMin, localMax)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={() => applyChange(localMin, localMax)}
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="price-inputs">
        <div className="price-input-group">
          <label className="price-input-label">от</label>
          <input
            type="text"
            inputMode="decimal"
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
            inputMode="decimal"
            className="price-input"
            value={inputMax}
            onChange={handleMaxInput}
            onBlur={handleMaxBlur}
          />
        </div>
      </div>
    </div>
  );
}