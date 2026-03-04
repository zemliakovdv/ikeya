'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import CategoryNav from './CategoryTree';
import PriceFilter from './PriceFilter';
import CheckboxFilter from './CheckboxFilter';
import FilterNotification from './FilterNotification';

function readAll(sp, key) {
  return sp.getAll(key).map(String);
}

function safeNumberOrEmpty(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.trim() === '') return '';
  const n = Number(s);
  return Number.isFinite(n) ? s : '';
}

export default function FilterAside({
  showAllFilters = false,
  currentCategory = null,
  categoryData = null,
  rootCategories = [],
  level = 0,
  availableFilters = [],
  priceRange = { min: 0, max: 10000 },
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const normalizedAvailableFilters = useMemo(() => {
    if (!Array.isArray(availableFilters)) return [];
    return availableFilters
      .filter((f) => f && f.parameter && Array.isArray(f.values) && f.values.length > 0)
      .map((f) => ({
        parameter: String(f.parameter),
        title: f.translated_name || f.name || String(f.parameter),
        values: f.values
          .filter((v) => v && v.id !== undefined && v.id !== null)
          .map((v) => ({
            value: String(v.id),
            label: v.translated_name || v.name || String(v.id),
          })),
      }));
  }, [availableFilters]);

  // стабильный ключ чтобы useEffect не зацикливался
  const filtersKey = useMemo(
    () => normalizedAvailableFilters.map((f) => f.parameter).join(','),
    [normalizedAvailableFilters]
  );

  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');
  const [draftFilters, setDraftFilters] = useState({});

  // синхронизация draft <- URL
  useEffect(() => {
    const minPrice = safeNumberOrEmpty(searchParams.get('min_price'));
    const maxPrice = safeNumberOrEmpty(searchParams.get('max_price'));

    const nextDraftFilters = {};
    normalizedAvailableFilters.forEach((f) => {
      const key = `filters[${f.parameter}][]`;
      nextDraftFilters[f.parameter] = readAll(searchParams, key);
    });

    setDraftPriceMin(minPrice);
    setDraftPriceMax(maxPrice);
    setDraftFilters(nextDraftFilters);
  }, [searchParams, filtersKey]); // ← filtersKey вместо normalizedAvailableFilters

  const toggleValue = useCallback((parameter, value) => {
    const v = String(value);
    setDraftFilters((prev) => {
      const current = Array.isArray(prev[parameter]) ? prev[parameter] : [];
      const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
      return { ...prev, [parameter]: next };
    });
  }, []);

  const handlePriceChange = useCallback((minV, maxV) => {
    setDraftPriceMin(String(minV));
    setDraftPriceMax(String(maxV));
  }, []);

  const clearAllFiltersFromParams = useCallback((params) => {
    params.delete('min_price');
    params.delete('max_price');
    params.delete('page');
    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filters[')) params.delete(key);
    }
  }, []);

  const handleApply = useCallback(() => {
    if (!showAllFilters) return;

    const params = new URLSearchParams(searchParams.toString());

    const minP = safeNumberOrEmpty(draftPriceMin);
    const maxP = safeNumberOrEmpty(draftPriceMax);

    if (minP !== '') params.set('min_price', minP);
    else params.delete('min_price');

    if (maxP !== '') params.set('max_price', maxP);
    else params.delete('max_price');

    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filters[')) params.delete(key);
    }

    Object.entries(draftFilters || {}).forEach(([parameter, values]) => {
      const key = `filters[${parameter}][]`;
      (values || []).forEach((val) => params.append(key, String(val)));
    });

    params.delete('page');

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [showAllFilters, draftPriceMin, draftPriceMax, draftFilters, pathname, router, searchParams]);

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    clearAllFiltersFromParams(params);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [clearAllFiltersFromParams, pathname, router, searchParams]);

  const {
    parentCategory = null,
    grandParentCategory = null,
    greatGrandParentCategory = null,
    subcategories = [],
  } = categoryData || {};

  const currentMin = useMemo(() => {
    if (draftPriceMin === '') return priceRange.min;
    const n = Number(draftPriceMin);
    return Number.isFinite(n) ? n : priceRange.min;
  }, [draftPriceMin, priceRange.min]);

  const currentMax = useMemo(() => {
    if (draftPriceMax === '') return priceRange.max;
    const n = Number(draftPriceMax);
    return Number.isFinite(n) ? n : priceRange.max;
  }, [draftPriceMax, priceRange.max]);

  return (
    <aside
      className="filter-aside"
      style={{
        position: 'sticky',
        top: '0',
        alignSelf: 'flex-start',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <CategoryNav
        currentCategory={currentCategory}
        parentCategory={parentCategory}
        grandParentCategory={grandParentCategory}
        greatGrandParentCategory={greatGrandParentCategory}
        subcategories={subcategories}
        rootCategories={rootCategories}
        level={level}
      />

      {showAllFilters && (
        <PriceFilter
          min={priceRange.min}
          max={priceRange.max}
          currentMin={currentMin}
          currentMax={currentMax}
          onChange={handlePriceChange}
        />
      )}

      {showAllFilters ? (
        <>
          {normalizedAvailableFilters.length > 0 ? (
            normalizedAvailableFilters.map((f) => (
              <CheckboxFilter
                key={f.parameter}
                title={f.title}
                filterKey={f.parameter}
                selectedOptions={draftFilters[f.parameter] || []}
                onToggle={toggleValue}
                options={f.values}
                showMore
              />
            ))
          ) : (
            <FilterNotification />
          )}

          <button className="apply-filters" onClick={handleApply} type="button">
            Применить фильтры
          </button>

          <button className="apply-filters" onClick={handleClear} type="button">
            Очистить фильтры
          </button>
        </>
      ) : (
        <FilterNotification />
      )}
    </aside>
  );
}
