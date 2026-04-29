'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import CategoryNav from './CategoryTree';
import PriceFilter from './PriceFilter';
import CheckboxFilter from './CheckboxFilter';
import FilterNotification from './FilterNotification';

const EXCLUDED_FILTERS = ['f-price-buckets', 'f-type'];
const SERIES_PARAMETER = 'f-series';

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

function extractPriceRange(availableFilters) {
  const priceBucket = (availableFilters || []).find(f => f.parameter === 'f-price-buckets');
  if (!priceBucket?.values?.length) return { min: 0, max: 10000 };
  const v = priceBucket.values[0];
  const min = parseFloat(v.min || 0);
  const max = parseFloat(v.max || 10000);
  return {
    min: Number.isFinite(min) ? Math.floor(min) : 0,
    max: Number.isFinite(max) ? Math.ceil(max) : 10000,
  };
}

export default function FilterAside({
  treeData = [],
  slugChain = [],
  showAllFilters = false,
  hasChildren = false,
  availableFilters = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const priceRange = useMemo(() => extractPriceRange(availableFilters), [availableFilters]);  const normalizedAvailableFilters = useMemo(() => {
    if (!Array.isArray(availableFilters)) return [];
    return availableFilters
      .filter((f) => f && f.parameter && Array.isArray(f.values) && f.values.length > 0)
      .filter((f) => !EXCLUDED_FILTERS.includes(f.parameter))
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

  const seriesFilter = useMemo(
    () => normalizedAvailableFilters.find(f => f.parameter === SERIES_PARAMETER) || null,
    [normalizedAvailableFilters]
  );

  const otherFilters = useMemo(
    () => normalizedAvailableFilters.filter(f => f.parameter !== SERIES_PARAMETER),
    [normalizedAvailableFilters]
  );

  const filtersKey = useMemo(
    () => normalizedAvailableFilters.map((f) => f.parameter).join(','),
    [normalizedAvailableFilters]
  );

  const level = slugChain.length;
  const showNotification = level === 0 || (level === 1 && hasChildren);
  const showOtherFilters = !showNotification && showAllFilters;

  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');
  const [draftFilters, setDraftFilters] = useState({});

  const priceDebounceRef = useRef(null);
  const isMountedRef = useRef(false);

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
    isMountedRef.current = true;
  }, [searchParams, filtersKey]);

  const applyFilters = useCallback((minP, maxP, filters) => {
    const params = new URLSearchParams(searchParams.toString());

    const min = safeNumberOrEmpty(minP);
    const max = safeNumberOrEmpty(maxP);

    if (min !== '') params.set('min_price', min);
    else params.delete('min_price');

    if (max !== '') params.set('max_price', max);
    else params.delete('max_price');

    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filters[')) params.delete(key);
    }

    Object.entries(filters || {}).forEach(([parameter, values]) => {
      const key = `filters[${parameter}][]`;
      (values || []).forEach((val) => params.append(key, String(val)));
    });

    params.delete('page');

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [searchParams, pathname, router]);

  const handlePriceChange = useCallback((minV, maxV) => {
    const min = String(minV);
    const max = String(maxV);
    setDraftPriceMin(min);
    setDraftPriceMax(max);

    if (!isMountedRef.current) return;

    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      applyFilters(min, max, draftFilters);
    }, 600);
  }, [applyFilters, draftFilters]);

  const toggleValue = useCallback((parameter, value) => {
    const v = String(value);
    setDraftFilters((prev) => {
      const current = Array.isArray(prev[parameter]) ? prev[parameter] : [];
      const next = current.includes(v)
        ? current.filter((x) => x !== v)
        : [...current, v];
      const newFilters = { ...prev, [parameter]: next };
      applyFilters(draftPriceMin, draftPriceMax, newFilters);
      return newFilters;
    });
  }, [applyFilters, draftPriceMin, draftPriceMax]);

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('min_price');
    params.delete('max_price');
    params.delete('page');
    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filters[')) params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

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

  const hasActiveFilters = useMemo(() => {
    if (draftPriceMin !== '') return true;
    if (draftPriceMax !== '') return true;
    return Object.values(draftFilters).some((v) => Array.isArray(v) && v.length > 0);
  }, [draftPriceMin, draftPriceMax, draftFilters]);

  return (
    <aside
      className="filter-aside"
      style={{
        position: 'sticky',
        top: '80px',
        alignSelf: 'flex-start',
        maxHeight: 'calc(100vh - 80px)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <CategoryNav treeData={treeData} slugChain={slugChain} />

      <PriceFilter
        min={priceRange.min}
        max={priceRange.max}
        currentMin={currentMin}
        currentMax={currentMax}
        onChange={handlePriceChange}
      />

      {seriesFilter && (
        <CheckboxFilter
          key={seriesFilter.parameter}
          title="Коллекции"
          filterKey={seriesFilter.parameter}
          selectedOptions={draftFilters[seriesFilter.parameter] || []}
          onToggle={toggleValue}
          options={seriesFilter.values}
          showMore
        />
      )}

      {showOtherFilters && otherFilters.map((f) => (
        <CheckboxFilter
          key={f.parameter}
          title={f.title}
          filterKey={f.parameter}
          selectedOptions={draftFilters[f.parameter] || []}
          onToggle={toggleValue}
          options={f.values}
          showMore
        />
      ))}

      {showNotification && <FilterNotification />}

      {hasActiveFilters && (
        <button className="clear-filters" onClick={handleClear} type="button">
          Очистить фильтры
        </button>
      )}
    </aside>
  );
}