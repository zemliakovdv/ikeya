// components/Catalog/FilterColor.jsx
'use client';

import { useState } from 'react';

export default function FilterColor({ type = 'full' }) {
    const [showAll, setShowAll] = useState(false);

    const colors = [
        { class: 'color-beige', title: 'Бежевый' },
        { class: 'color-gray', title: 'Серый' },
        { class: 'color-brown', title: 'Коричневый' },
        { class: 'color-white', title: 'Белый' },
        { class: 'color-multicolor', title: 'Разноцветный' }
    ];

    // Для catalog-third.html цвета внутри checkbox
    if (type === 'deep' || type === 'category') {
        return (
            <div className="filter-section" style={{ display: 'none' }}>
                <div className="section-title">
                    <span>Цвет</span>
                    <span className="toggle-icon">
                        <img src="/assets/img/icons/arrow-down.svg" alt="" />
                    </span>
                </div>
                <div className="brand-grid">
                    {colors.map((color, index) => (
                        <label key={index} className="brand-checkbox">
                            <input type="checkbox" />
                            <span className="custom-checkbox"></span>
                            <div className={`color-option ${color.class}`} title={color.title}></div>
                            <span>{color.title}</span>
                        </label>
                    ))}
                </div>
                <button className="show-more">
                    Показать еще 4 цвета
                    <span className="toggle-icon">
                        <img src="/assets/img/icons/arrow-down.svg" alt="" />
                    </span>
                </button>
            </div>
        );
    }

    // Для остальных страниц - просто квадратики
    return (
        <div className="filter-section" style={{ display: 'none' }}>
            <div className="section-title">
                <span>Цвет</span>
                <span className="toggle-icon">
                    <img src="/assets/img/icons/arrow-down.svg" alt="" />
                </span>
            </div>
            <div className="color-options">
                {colors.map((color, index) => (
                    <div 
                        key={index}
                        className={`color-option ${color.class} ${index === 0 ? 'active' : ''}`}
                        title={color.title}
                    ></div>
                ))}
            </div>
            <button 
                className="show-more"
                onClick={() => setShowAll(!showAll)}
            >
                Показать еще 4 цвета
                <span className="toggle-icon">
                    <img src="/assets/img/icons/arrow-down.svg" alt="" />
                </span>
            </button>
        </div>
    );
}
