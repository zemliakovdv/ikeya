'use client';

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/catalog/products/ProductCard';
import PriceFilter from '@/components/catalog/sidebar/PriceFilter';
import CheckboxFilter from '@/components/catalog/sidebar/CheckboxFilter';
import FilterChips from '@/components/catalog/FilterChips';
import SearchNotFound from '@/components/catalog/SearchNotFound';
import NotFoundRecommendations from '@/components/recommendations/NotFoundRecommendations';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

function getPriceRangeFromFilters(filters) {
  const priceBucket = (filters || []).find(f => f.parameter === 'f-price-buckets');
  if (!priceBucket?.values?.length) return { min: 0, max: 10000 };

  let min = Infinity;
  let max = 0;

  priceBucket.values.forEach(({ id }) => {
    const match = id.match(/^PRICE_(\d+)_(\d+)$/);
    if (!match) return;
    const lo = parseInt(match[1]) / 100;
    const hi = parseInt(match[2]) / 100;
    if (lo < min) min = lo;
    if (hi < 92233720368547 && hi > max) max = hi;
  });

  return {
    min: min === Infinity ? 0 : Math.floor(min),
    max: max === 0 ? 10000 : Math.ceil(max)
  };
}

function safeNumberOrEmpty(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.trim() === '') return '';
  const n = Number(s);
  return Number.isFinite(n) ? s : '';
}

function readAll(sp, key) {
  return sp.getAll(key).map(String);
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || '';

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');
  const [draftFilters, setDraftFilters] = useState({});

  const priceDebounceRef = useRef(null);
  const isMountedRef = useRef(false);

  const sortOptions = [
    { value: 'cheapest', label: 'Дешевле' },
    { value: 'expensive', label: 'Дороже' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortParam)?.label || 'Сортировка';

  // Нормализуем фильтры из API (исключаем цену — она в PriceFilter)
  const normalizedFilters = useMemo(() => {
    const filters = results?.available_filters || [];
    return filters
      .filter(f => f.parameter !== 'f-price-buckets' && Array.isArray(f.values) && f.values.length > 0)
      .map(f => ({
        parameter: String(f.parameter),
        title: f.name || String(f.parameter),
        values: f.values
          .filter(v => v && v.id !== undefined)
          .map(v => ({
            value: String(v.id),
            label: v.name || String(v.id),
          })),
      }));
  }, [results]);

  const filtersKey = useMemo(
    () => normalizedFilters.map(f => f.parameter).join(','),
    [normalizedFilters]
  );

  const priceRange = useMemo(() => {
    const prods = results?.products?.data || [];
    const prices = prods
      .map(p => parseFloat(String(p.attributes?.price_byn || p.attributes?.price || 0).replace(/\s/g, '')))
      .filter(p => p > 0);
    if (!prices.length) return { min: 0, max: 10000 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [results]);

  // Загружаем результаты при изменении URL
  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    fetchResults();
  }, [q, sortParam, searchParams.toString()]);

  // Синхронизация draft <- URL
  useEffect(() => {
    setDraftPriceMin(safeNumberOrEmpty(searchParams.get('min_price')));
    setDraftPriceMax(safeNumberOrEmpty(searchParams.get('max_price')));

    const nextDraftFilters = {};
    normalizedFilters.forEach(f => {
      nextDraftFilters[f.parameter] = readAll(searchParams, `filters[${f.parameter}][]`);
    });
    setDraftFilters(nextDraftFilters);
    isMountedRef.current = true;
  }, [searchParams, filtersKey]);

  async function fetchResults() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('q', q.trim());
      if (sortParam) params.set('sort', sortParam);
      const minP = searchParams.get('min_price');
      const maxP = searchParams.get('max_price');
      if (minP) params.set('min_price', minP);
      if (maxP) params.set('max_price', maxP);
      for (const [key, val] of searchParams.entries()) {
        if (key.startsWith('filters[')) params.append(key, val);
      }

      const res = await fetch(`${API_BASE_URL}/search/suggest?${params.toString()}`);
      if (!res.ok) throw new Error('Search error');
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error('Search error:', e);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

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
      (values || []).forEach(val => params.append(`filters[${parameter}][]`, String(val)));
    });
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
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
    setDraftFilters(prev => {
      const current = Array.isArray(prev[parameter]) ? prev[parameter] : [];
      const next = current.includes(v) ? current.filter(x => x !== v) : [...current, v];
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
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  function handleSort(value) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete('sort');
    else params.set('sort', value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
    setSortOpen(false);
  }

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
    return Object.values(draftFilters).some(v => Array.isArray(v) && v.length > 0);
  }, [draftPriceMin, draftPriceMax, draftFilters]);

  const filterLabels = useMemo(() => {
    const labels = {};
    (results?.available_filters || []).forEach(f => {
      (f.values || []).forEach(v => {
        if (v.id !== undefined) labels[String(v.id)] = v.translated_name || v.name || String(v.id);
      });
    });
    return labels;
  }, [results]);

  const filterTitles = useMemo(() => {
    const titles = {};
    (results?.available_filters || []).forEach(f => {
      titles[f.parameter] = f.translated_name || f.name || f.parameter;
    });
    return titles;
  }, [results]);
  const categories = results?.categories?.data || results?.categories || [];
  const products = (results?.products?.data || []).map(p => ({
    ...p,
    attributes: {
      ...p.attributes,
      // Нормализуем название и цену под ProductCard
      small_desc_name: p.attributes?.small_desc_name || p.attributes?.name_ru || p.attributes?.name,
      price_byn: p.attributes?.price_byn || p.attributes?.price,
    }
  }));
  const hasResults = products.length > 0;

  if (!q) {
    return (
      <main className="main catalog-inner">
        <section className="all-catalog">
          <div className="container">
            <div className="all-catalog-empty">
              <p>Введите запрос для поиска товаров</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main catalog-inner">
      <section className="all-catalog">
        <div className="container">

          {/* Заголовок */}
          <h1>
            {loading
              ? `Поиск по запросу «${q}»...`
              : `По запросу «${q}» найдено ${results?.meta?.total ?? products.length} товаров`
            }
          </h1>

          <div className="all-catalog-inner">
            {/* Сайдбар — скрываем когда нет результатов */}
            {(!(!loading && !hasResults && results !== null)) && (
            <aside className="filter-aside" style={{ position: 'sticky', top: 0, alignSelf: 'flex-start', overflowY: 'auto', overflowX: 'hidden' }}>

              {/* Категории */}
              {categories.length > 0 && (
                <div className="category-sidebar">
                  <h3 className="category-sidebar__title">Категория</h3>
                  <nav className="category-tree">
                    <div className="category-tree__root">
                      {categories.map(cat => (
                        <a
                          key={cat.id}
                          href={`/catalog/${cat.attributes?.slug || cat.slug || cat.id}/`}
                          className="category-tree__link"
                        >
                          {cat.attributes?.translated_name || cat.translated_name || cat.name}
                        </a>
                      ))}
                    </div>
                  </nav>
                </div>
              )}

              {/* Фильтр цены */}
              <PriceFilter
                min={priceRange.min}
                max={priceRange.max}
                currentMin={currentMin}
                currentMax={currentMax}
                onChange={handlePriceChange}
              />

              {/* Чекбокс фильтры */}
              {normalizedFilters.map(f => (
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

              {hasActiveFilters && (
                <button className="clear-filters" onClick={handleClear} type="button">
                  Очистить фильтры
                </button>
              )}
            </aside>
            )}

            {/* Центральная колонка */}
            <div className="all-catalog-center" style={!loading && !hasResults && results !== null ? { width: '100%' } : {}}>

              {/* Сортировка — скрываем когда нет результатов */}
              {(!(!loading && !hasResults && results !== null)) && (
              <div className="all-catalog-sort">
                <div className="catalog-sort">
                  <div className="catalog-sort__selected" onClick={() => setSortOpen(v => !v)}>
                    <span className="catalog-sort__current">{currentSortLabel}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z" fill="#757575"/>
                    </svg>
                  </div>
                  {sortOpen && (
                    <ul className="catalog-sort__dropdown">
                      {sortOptions.map(opt => (
                        <li
                          key={opt.value}
                          className={`catalog-sort__option ${opt.value === sortParam ? 'active' : ''}`}
                          onClick={() => handleSort(opt.value)}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              )}

              {/* Чипсы фильтров */}
              <FilterChips filterLabels={filterLabels} filterTitles={filterTitles} />

              {/* Скелетон */}
              {loading && (
                <div className="products-grid">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} style={{ height: 320, background: '#f5f5f5', borderRadius: 8 }} />
                  ))}
                </div>
              )}

              {/* Товары */}
              {!loading && hasResults && (
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Нет результатов */}
              {!loading && !hasResults && results !== null && (
                <SearchNotFound query={q} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Рекомендации — показываем когда ничего не найдено */}
      {!loading && !hasResults && results !== null && (
        <Suspense fallback={null}>
          <NotFoundRecommendations />
        </Suspense>
      )}

    </main>
  );
}