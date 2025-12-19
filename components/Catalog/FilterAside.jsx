// components/Catalog/FilterAside.jsx
'use client';

import { useState } from 'react';
import FilterCategories from './FilterCategories';
import FilterPrice from './FilterPrice';
import FilterBrands from './FilterBrands';
import FilterHiddenSections from './FilterHiddenSections';
import FilterMaterial from './FilterMaterial';
import FilterColor from './FilterColor';
import FilterSeats from './FilterSeats';
import FilterStyle from './FilterStyle';

export default function FilterAside({ 
    type = 'full', // 'full' | 'search' | 'deep' | 'category'
    categories = [],
    showApplyButton = false
}) {
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        brands: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <aside className="filter-aside">
            <FilterCategories 
                type={type}
                categories={categories}
                expanded={expandedSections.categories}
                onToggle={() => toggleSection('categories')}
            />

            <FilterPrice />

            <FilterBrands 
                expanded={expandedSections.brands}
                onToggle={() => toggleSection('brands')}
            />

            <FilterHiddenSections />

            <FilterMaterial />

            <FilterColor type={type} />

            <FilterSeats />

            <FilterStyle />

            <p className="filter-notification"></p>
            <button 
                className="apply-filters"
                style={{ display: showApplyButton ? 'block' : 'none' }}
            >
                Очистить фильтры
            </button>
        </aside>
    );
}
