// components/Catalog/FilterMaterial.jsx
'use client';

import { useState } from 'react';

export default function FilterMaterial() {
    const [showAll, setShowAll] = useState(false);

    const materials = [
        'Дерево', 'Металл', 'Пластик', 'Стекло', 'Ткань',
        'Кожа', 'МДФ', 'ДСП', 'Ротанг'
    ];

    const visibleMaterials = showAll ? materials : materials.slice(0, 5);

    return (
        <div className="filter-section" style={{ display: 'none' }}>
            <div className="section-title">
                <span>Материал</span>
                <span className="toggle-icon">
                    <img src="/assets/img/icons/arrow-down.svg" alt="" />
                </span>
            </div>
            <div className="brand-grid">
                {visibleMaterials.map((material, index) => (
                    <label key={index} className="brand-checkbox">
                        <input type="checkbox" />
                        <span className="custom-checkbox"></span>
                        <span>{material}</span>
                    </label>
                ))}
            </div>
            {materials.length > 5 && (
                <button 
                    className="show-more"
                    onClick={() => setShowAll(!showAll)}
                >
                    Показать еще 4 материала
                    <span className="toggle-icon">
                        <img src="/assets/img/icons/arrow-down.svg" alt="" />
                    </span>
                </button>
            )}
        </div>
    );
}
