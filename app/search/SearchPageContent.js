'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import ProductCard from '@/components/catalog/products/ProductCard';
import PriceFilter from '@/components/catalog/sidebar/PriceFilter';
import CheckboxFilter from '@/components/catalog/sidebar/CheckboxFilter';
import FilterChips from '@/components/catalog/FilterChips';
import SearchNotFound from '@/components/catalog/SearchNotFound';
import Pagination from '@/components/catalog/Pagination';
import NotFoundRecommendations from '@/components/recommendations/NotFoundRecommendations';
import PageLoader from '@/components/ui/PageLoader';

import { buildApiUrl } from '@/lib/config/api';
const ITEMS_PER_PAGE = 20;

function parsePrice(value) {
  if (value === null || value === undefined || value === '') return 0;

  const normalized = String(value)
    .replace(/\s/g, '')
    .replace(',', '.');

  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getPriceRangeFromProducts(products) {
  const prices = products
    .map((product) => parsePrice(product.attributes?.price_byn || product.attributes?.price))
    .filter((price) => price > 0);

  if (!prices.length) return { min: 0, max: 10000 };

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

function safeNumberOrEmpty(value) {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  if (stringValue.trim() === '') return '';

  const normalized = stringValue.replace(',', '.');
  const numberValue = Number(normalized);

  return Number.isFinite(numberValue) ? stringValue : '';
}

function readAll(searchParams, key) {
  return searchParams.getAll(key).map(String);
}

function normalizeProduct(product) {
  const attr = product?.attributes || {};

  return {
    ...product,
    attributes: {
      ...attr,
      small_desc_name: attr.small_desc_name || attr.name_ru || attr.name,
      price_byn: attr.price_byn || attr.price,
    },
  };
}

function hasValidPrice(product) {
  const price = parsePrice(product.attributes?.price_byn || product.attributes?.price);

  return price > 0;
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || '';

  const [firstPageData, setFirstPageData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortOpen, setSortOpen] = useState(false);
  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');
  const [draftFilters, setDraftFilters] = useState({});

  const priceDebounceRef = useRef(null);
  const isMountedRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(false);
  const pageRef = useRef(2);
  const observerRef = useRef(null);
  const triggerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const firstPageAbortRef = useRef(null);
  const loadMoreAbortRef = useRef(null);
  const requestKeyRef = useRef('');

  const fetchKey = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    return params.toString();
  }, [searchParams]);

  const sortOptions = [
    { value: 'cheapest', label: 'Дешевле' },
    { value: 'expensive', label: 'Дороже' },
  ];

  const currentSortLabel = sortOptions.find((option) => option.value === sortParam)?.label || 'Сортировка';

  const normalizedFilters = useMemo(() => {
    const filters = firstPageData?.available_filters || [];

    return filters
      .filter((filter) => filter.parameter !== 'f-price-buckets' && Array.isArray(filter.values) && filter.values.length > 0)
      .map((filter) => ({
        parameter: String(filter.parameter),
        title: filter.translated_name || filter.name || String(filter.parameter),
        values: filter.values
          .filter((value) => value && value.id !== undefined)
          .map((value) => ({
            value: String(value.id),
            label: value.translated_name || value.name || String(value.id),
          })),
      }));
  }, [firstPageData]);

  const filtersKey = useMemo(
    () => normalizedFilters.map((filter) => filter.parameter).join(','),
    [normalizedFilters]
  );

  const priceRange = useMemo(() => getPriceRangeFromProducts(products), [products]);

  const filterLabels = useMemo(() => {
    const labels = {};

    (firstPageData?.available_filters || []).forEach((filter) => {
      (filter.values || []).forEach((value) => {
        if (value.id !== undefined) {
          labels[String(value.id)] = value.translated_name || value.name || String(value.id);
        }
      });
    });

    return labels;
  }, [firstPageData]);

  const filterTitles = useMemo(() => {
    const titles = {};

    (firstPageData?.available_filters || []).forEach((filter) => {
      titles[filter.parameter] = filter.translated_name || filter.name || filter.parameter;
    });

    return titles;
  }, [firstPageData]);

  const buildParams = useCallback((page = 1) => {
    const params = new URLSearchParams();

    params.set('q', q.trim());
    params.set('page', String(page));
    params.set('per_page', String(ITEMS_PER_PAGE));

    if (sortParam) params.set('sort', sortParam);

    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');

    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);

    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('filters[')) {
        params.append(key, value);
      }
    }

    return params;
  }, [q, sortParam, searchParams]);

  const fetchFirstPage = useCallback(async (signal, activeRequestKey) => {
    if (!q.trim()) {
      setFirstPageData(null);
      setProducts([]);
      setHasMore(false);
      hasMoreRef.current = false;
      setTotalPages(1);
      setTotalItems(0);
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    setProducts([]);
    setHasMore(false);
    hasMoreRef.current = false;
    pageRef.current = 2;
    setCurrentPage(1);

    try {
      const params = buildParams(1);
      const res = await fetch(`${buildApiUrl('/search/suggest')}?${params.toString()}`, { signal });

      if (!res.ok) throw new Error('Search error');

      const data = await res.json();

      if (signal.aborted || requestKeyRef.current !== activeRequestKey) return;

      const meta = data.meta || {};
      const rawProducts = (data.products?.data || [])
        .map(normalizeProduct)
        .filter(hasValidPrice);

      const pages = meta.total_pages || 1;
      const total = meta.total || rawProducts.length;

      setFirstPageData(data);
      setProducts(rawProducts);
      setTotalPages(pages);
      setTotalItems(total);

      const more = pages > 1;
      setHasMore(more);
      hasMoreRef.current = more;
    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('Search error:', error);
      setFirstPageData(null);
      setProducts([]);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      if (!signal.aborted && requestKeyRef.current === activeRequestKey) {
        setLoading(false);
      }
    }
  }, [q, buildParams]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadMoreAbortRef.current?.abort();

    const controller = new AbortController();
    const activeRequestKey = requestKeyRef.current;
    const page = pageRef.current;

    loadMoreAbortRef.current = controller;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const params = buildParams(page);
      const res = await fetch(`${buildApiUrl('/search/suggest')}?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Search error');

      const data = await res.json();

      if (controller.signal.aborted || requestKeyRef.current !== activeRequestKey) return;

      const meta = data.meta || {};
      const rawProducts = (data.products?.data || [])
        .map(normalizeProduct)
        .filter(hasValidPrice);

      const pages = meta.total_pages ?? totalPages;
      const more = page < pages;

      if (rawProducts.length > 0) {
        setProducts((prev) => [...prev, ...rawProducts]);
      }

      pageRef.current = page + 1;
      hasMoreRef.current = more;
      setHasMore(more);
      setCurrentPage(page);

      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set('page', String(page));
      window.history.replaceState(null, '', `${pathname}?${urlParams.toString()}`);
    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('Load more error:', error);
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      if (!controller.signal.aborted) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [buildParams, totalPages, pathname, searchParams]);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current?.();
        }
      },
      { threshold: 0, rootMargin: '200px' }
    );

    observerRef.current = observer;

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const setTriggerRef = useCallback((node) => {
    triggerRef.current = node;

    if (!node || !observerRef.current) return;

    observerRef.current.disconnect();
    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    requestKeyRef.current = fetchKey;

    firstPageAbortRef.current?.abort();
    loadMoreAbortRef.current?.abort();

    loadingMoreRef.current = false;
    setLoadingMore(false);

    const controller = new AbortController();
    firstPageAbortRef.current = controller;

    fetchFirstPage(controller.signal, fetchKey);

    return () => {
      controller.abort();
    };
  }, [fetchKey, fetchFirstPage]);

  useEffect(() => {
    return () => {
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
      firstPageAbortRef.current?.abort();
      loadMoreAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    setDraftPriceMin(safeNumberOrEmpty(searchParams.get('min_price')));
    setDraftPriceMax(safeNumberOrEmpty(searchParams.get('max_price')));

    const nextDraftFilters = {};

    normalizedFilters.forEach((filter) => {
      nextDraftFilters[filter.parameter] = readAll(searchParams, `filters[${filter.parameter}][]`);
    });

    setDraftFilters(nextDraftFilters);
    isMountedRef.current = true;
  }, [searchParams, filtersKey, normalizedFilters]);

  const applyFilters = useCallback((minPrice, maxPrice, filters) => {
    const params = new URLSearchParams(searchParams.toString());

    const min = safeNumberOrEmpty(minPrice);
    const max = safeNumberOrEmpty(maxPrice);

    if (min !== '') params.set('min_price', min);
    else params.delete('min_price');

    if (max !== '') params.set('max_price', max);
    else params.delete('max_price');

    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filters[')) params.delete(key);
    }

    Object.entries(filters || {}).forEach(([parameter, values]) => {
      (values || []).forEach((value) => {
        params.append(`filters[${parameter}][]`, String(value));
      });
    });

    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handlePriceChange = useCallback((minValue, maxValue) => {
    const min = String(minValue);
    const max = String(maxValue);

    setDraftPriceMin(min);
    setDraftPriceMax(max);

    if (!isMountedRef.current) return;

    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }

    priceDebounceRef.current = window.setTimeout(() => {
      applyFilters(min, max, draftFilters);
    }, 600);
  }, [applyFilters, draftFilters]);

  const toggleValue = useCallback((parameter, value) => {
    const nextValue = String(value);

    setDraftFilters((prev) => {
      const current = Array.isArray(prev[parameter]) ? prev[parameter] : [];
      const next = current.includes(nextValue)
        ? current.filter((item) => item !== nextValue)
        : [...current, nextValue];

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
      if (key.startsWith('filters[')) {
        params.delete(key);
      }
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

    const numberValue = Number(String(draftPriceMin).replace(',', '.'));

    return Number.isFinite(numberValue) ? numberValue : priceRange.min;
  }, [draftPriceMin, priceRange.min]);

  const currentMax = useMemo(() => {
    if (draftPriceMax === '') return priceRange.max;

    const numberValue = Number(String(draftPriceMax).replace(',', '.'));

    return Number.isFinite(numberValue) ? numberValue : priceRange.max;
  }, [draftPriceMax, priceRange.max]);

  const hasActiveFilters = useMemo(() => {
    if (draftPriceMin !== '') return true;
    if (draftPriceMax !== '') return true;

    return Object.values(draftFilters).some((value) => Array.isArray(value) && value.length > 0);
  }, [draftPriceMin, draftPriceMax, draftFilters]);

  const categories = firstPageData?.categories?.data || firstPageData?.categories || [];
  const hasResults = products.length > 0;

  const paginationQueryString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    return params.toString();
  }, [searchParams]);

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

  const noResults = !loading && !hasResults && firstPageData !== null;
  const hideSidebar = noResults;

  return (
    <main className="main catalog-inner">
      <section className="all-catalog">
        <div className="container">

          <h1>
            {loading
              ? `Поиск по запросу «${q}»...`
              : `По запросу «${q}» найдено ${totalItems} товаров`
            }
          </h1>

          {loading && <PageLoader />}

          <div className="all-catalog-inner" style={{ visibility: loading ? 'hidden' : 'visible' }}>

            {!hideSidebar && (
              <aside
                className="filter-aside"
                style={{
                  position: 'sticky',
                  top: 0,
                  alignSelf: 'flex-start',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {categories.length > 0 && (
                  <div className="category-sidebar">
                    <h3 className="category-sidebar__title">Категория</h3>

                    <nav className="category-tree">
                      <div className="category-tree__root">
                        {categories.map((cat) => {
                          const attrs = cat.attributes || {};
                          const slug = attrs.slug || cat.slug || cat.id;
                          const title = attrs.translated_name || cat.translated_name || attrs.name || cat.name || 'Категория';

                          return (
                            <Link
                              key={cat.id}
                              href={`/catalog/${slug}/`}
                              className="category-tree__link"
                            >
                              {title}
                            </Link>
                          );
                        })}
                      </div>
                    </nav>
                  </div>
                )}

                <PriceFilter
                  min={priceRange.min}
                  max={priceRange.max}
                  currentMin={currentMin}
                  currentMax={currentMax}
                  onChange={handlePriceChange}
                />

                {normalizedFilters.map((filter) => (
                  <CheckboxFilter
                    key={filter.parameter}
                    title={filter.title}
                    filterKey={filter.parameter}
                    selectedOptions={draftFilters[filter.parameter] || []}
                    onToggle={toggleValue}
                    options={filter.values}
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

            <div className="all-catalog-center" style={hideSidebar ? { width: '100%' } : {}}>
              {!hideSidebar && (
                <div className="all-catalog-sort">
                  <div className="catalog-sort">
                    <button
                      className="catalog-sort__selected"
                      onClick={() => setSortOpen((value) => !value)}
                      type="button"
                      aria-expanded={sortOpen}
                    >
                      <span className="catalog-sort__current">{currentSortLabel}</span>

                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z" fill="#757575" />
                      </svg>
                    </button>

                    {sortOpen && (
                      <ul className="catalog-sort__dropdown">
                        {sortOptions.map((option) => (
                          <li key={option.value}>
                            <button
                              className={`catalog-sort__option ${option.value === sortParam ? 'active' : ''}`}
                              onClick={() => handleSort(option.value)}
                              type="button"
                            >
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <FilterChips filterLabels={filterLabels} filterTitles={filterTitles} />

              {!loading && hasResults && (
                <>
                  <div className="products-grid">
                    {products.map((product) => (
                      <ProductCard key={`${product.id}-${product.attributes?.sku || ''}`} product={product} />
                    ))}
                  </div>

                  {hasMore && (
                    <div
                      ref={setTriggerRef}
                      className="loading-trigger"
                      style={{
                        height: '80px',
                        margin: '32px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {loadingMore && <div className="page-loader__spinner" />}
                    </div>
                  )}

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={ITEMS_PER_PAGE}
                      basePath={pathname}
                      queryString={paginationQueryString}
                    />
                  )}
                </>
              )}

              {noResults && <SearchNotFound query={q} />}
            </div>
          </div>
        </div>
      </section>

      {noResults && (
        <Suspense fallback={null}>
          <NotFoundRecommendations />
        </Suspense>
      )}
    </main>
  );
}