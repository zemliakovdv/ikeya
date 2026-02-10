// components/catalog/CatalogClient.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import FilterAside from './sidebar/FilterAside';
import ProductCard from './products/ProductCard'; // ✅ Используем ProductCard
import ProductSort from './ProductSort';

export default function CatalogClient({ 
  initialProducts = [], 
  category,
  categoryData,
  rootCategories,
  level,
  showAllFilters = false
}) {
  // Централизованное состояние фильтров
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    collections: [],
    colors: [],
    materials: [],
    widths: [],
    heights: [],
    depths: [],
    lengths: [],
    seats: [],
    shapes: [],
  });

  // Вычисляем минимальную и максимальную цену из товаров
  const priceRange = useMemo(() => {
    if (initialProducts.length === 0) return { min: 0, max: 10000 };
    
    const prices = initialProducts.map(p => parseFloat(p.attributes.price) || 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [initialProducts]);

  // Инициализируем диапазон цен
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceMin: priceRange.min,
      priceMax: priceRange.max
    }));
  }, [priceRange]);

  // Извлекаем уникальные коллекции из товаров
  const availableCollections = useMemo(() => {
    const collections = new Set();
    initialProducts.forEach(product => {
      if (product.attributes.collection) {
        collections.add(product.attributes.collection);
      }
    });
    return Array.from(collections).sort();
  }, [initialProducts]);

  // Применяем фильтры к товарам
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Фильтр по цене
    result = result.filter(product => {
      const price = parseFloat(product.attributes.price) || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Фильтр по коллекциям
    if (filters.collections.length > 0) {
      result = result.filter(product => 
        product.attributes.collection && 
        filters.collections.includes(product.attributes.collection)
      );
    }

    return result;
  }, [initialProducts, filters]);

  // Функции для изменения фильтров
  const updatePriceRange = (min, max) => {
    setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const toggleCollection = (collection) => {
    setFilters(prev => ({
      ...prev,
      collections: prev.collections.includes(collection)
        ? prev.collections.filter(c => c !== collection)
        : [...prev.collections, collection]
    }));
  };

  const toggleColor = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const toggleCheckboxFilter = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter(v => v !== value)
        : [...prev[filterKey], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      collections: [],
      colors: [],
      materials: [],
      widths: [],
      heights: [],
      depths: [],
      lengths: [],
      seats: [],
      shapes: [],
    });
  };

  return (
    <>
      <div className="col-lg-3">
        <FilterAside
          showAllFilters={showAllFilters}
          currentCategory={category}
          categoryData={categoryData}
          rootCategories={rootCategories}
          level={level}
          filters={filters}
          priceRange={priceRange}
          availableCollections={availableCollections}
          onPriceChange={updatePriceRange}
          onCollectionToggle={toggleCollection}
          onColorToggle={toggleColor}
          onCheckboxToggle={toggleCheckboxFilter}
          onClearFilters={clearFilters}
        />
      </div>
      
      <div className="col-lg-9">
        <ProductSort totalCount={filteredProducts.length} />
        
        {filteredProducts.length > 0 ? (
          <div className="all-catalog-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="all-catalog-empty">
            <p>Товары не найдены. Попробуйте изменить фильтры.</p>
          </div>
        )}
      </div>
    </>
  );
}
