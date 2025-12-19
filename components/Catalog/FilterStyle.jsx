// components/Catalog/FilterStyle.jsx
'use client';

import { useState } from 'react';

export default function FilterStyle() {
    const [showAll, setShowAll] = useState(false);

    const styles = [
        'Скандинавский', 'Минимализм', 'Лофт', 'Классический', 
        'Современный', 'Прованс', 'Эклектика', 'Хай-тек', 'Рустик'
    ];

    const visibleStyles = showAll ? styles : styles.slice(0, 5);

    return (
        <div className="filter-section" style={{ display: 'none' }}>
            <div className="section-title">
                <span>Стиль</span>
                <span className="toggle-icon">
                    <img src="/assets/img/icons/arrow-down.svg" alt="" />
                </span>
            </div>
            <div className="brand-grid">
                {visibleStyles.map((style, index) => (
                    <label key={index} className="brand-checkbox">
                        <input type="checkbox" />
                        <span className="custom-checkbox"></span>
                        <span>{style}</span>
                    </label>
                ))}
            </div>
            {styles.length > 5 && (
                <button 
                    className="show-more"
                    onClick={() => setShowAll(!showAll)}
                >
                    Показать еще 4 стиля
                    <span className="toggle-icon">
                        <img src="/assets/img/icons/arrow-down.svg" alt="" />
                    </span>
                </button>
            )}
        </div>
    );
}
