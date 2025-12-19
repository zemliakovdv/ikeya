// components/Catalog/FilterPrice.jsx
'use client';

import { useState } from 'react';

export default function FilterPrice({ 
    min = 19.99, 
    max = 4999,
    expanded = true 
}) {
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);

    return (
        <div className="filter-section">
            <div className="section-title">
                <span>Цена</span>
                <span className="toggle-icon">
                    <img src="/assets/img/icons/arrow-down.svg" alt="" />
                </span>
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
                    placeholder="От" 
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                />
                <input 
                    type="number" 
                    className="price-input" 
                    placeholder="До" 
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                />
            </div>
        </div>
    );
}
