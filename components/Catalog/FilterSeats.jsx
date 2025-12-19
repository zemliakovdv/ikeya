// components/Catalog/FilterSeats.jsx
'use client';

import { useState } from 'react';

export default function FilterSeats() {
    const [showAll, setShowAll] = useState(false);

    const seats = ['1 место', '2 места', '2-3 места', '3-4 места', '4+ места'];

    return (
        <div className="filter-section" style={{ display: 'none' }}>
            <div className="section-title">
                <span>Количество мест</span>
                <span className="toggle-icon">
                    <img src="/assets/img/icons/arrow-down.svg" alt="" />
                </span>
            </div>
            <div className="brand-grid">
                {seats.map((seat, index) => (
                    <label key={index} className="brand-checkbox">
                        <input type="checkbox" />
                        <span className="custom-checkbox"></span>
                        <span>{seat}</span>
                    </label>
                ))}
            </div>
            <button className="show-more">
                Показать еще 2 варианта
                <span className="toggle-icon">
                    <img src="/assets/img/icons/arrow-down.svg" alt="" />
                </span>
            </button>
        </div>
    );
}
