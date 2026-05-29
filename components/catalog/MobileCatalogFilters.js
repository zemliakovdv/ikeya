'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { findNodeInTree } from '@/lib/utils/categoryHelpers';

const PANEL_ID = 'mobile-catalog-filter-panel';

const EXCLUDED_FILTERS = ['f-price-buckets', 'f-type'];
const SERIES_PARAMETER = 'f-series';

function readAll(sp, key) {
  return sp.getAll(key).map(String);
}

function safeNumberOrEmpty(v) {
  if (v === null || v === undefined) return '';

  const s = String(v).trim().replace(',', '.');
  if (s === '') return '';

  const n = Number(s);
  return Number.isFinite(n) ? s : '';
}

function parsePriceValue(value, fallback) {
  const n = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

function extractPriceRange(availableFilters) {
  const fallback = { min: 0, max: 10000 };
  const priceBucket = (availableFilters || []).find((f) => f.parameter === 'f-price-buckets');

  if (!priceBucket?.values?.length) {
    return fallback;
  }

  const firstValue = priceBucket.values[0] || {};

  if (firstValue.min !== undefined || firstValue.max !== undefined) {
    const min = parsePriceValue(firstValue.min, fallback.min);
    const max = parsePriceValue(firstValue.max, fallback.max);

    return {
      min,
      max: max > min ? max : fallback.max,
    };
  }

  const id = String(firstValue.id || '');
  const match = id.match(/^PRICE_(\d+(?:[.,]\d+)?)_(\d+(?:[.,]\d+)?)$/);

  if (match) {
    const min = parsePriceValue(match[1], fallback.min);
    const max = parsePriceValue(match[2], fallback.max);

    return {
      min,
      max: max > min ? max : fallback.max,
    };
  }

  return fallback;
}

function getNodeName(node) {
  return (
    node?.attributes?.translated_name ||
    node?.attributes?.name ||
    'Категория'
  );
}

function getNodeSlug(node) {
  return node?.attributes?.slug || node?.id || '';
}

function buildUrl(slugs) {
  return slugs.length ? `/catalog/${slugs.join('/')}` : '/catalog';
}

function buildUrlFromNodes(nodes) {
  const slugs = (nodes || [])
    .map(getNodeSlug)
    .filter(Boolean);

  return buildUrl(slugs);
}

function getFilterDisplayTitle(filter) {
  if (!filter) return '';

  if (filter.parameter === SERIES_PARAMETER) {
    return 'Коллекции';
  }

  return filter.translated_name || filter.name || String(filter.parameter);
}

function normalizeFilters(availableFilters) {
  if (!Array.isArray(availableFilters)) return [];

  return availableFilters
    .filter((f) => f && f.parameter && Array.isArray(f.values) && f.values.length > 0)
    .filter((f) => !EXCLUDED_FILTERS.includes(f.parameter))
    .map((f) => ({
      parameter: String(f.parameter),
      title: getFilterDisplayTitle(f),
      values: f.values
        .filter((v) => v && v.id !== undefined && v.id !== null)
        .map((v) => ({
          value: String(v.id),
          label: v.translated_name || v.name || String(v.id),
        })),
    }));
}

function formatPrice(value) {
  const n = Number(String(value).replace(',', '.'));

  if (!Number.isFinite(n)) return String(value);

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(n);
}

function getFilterLabel(filters, parameter, value) {
  const filter = filters.find((f) => f.parameter === parameter);
  const option = filter?.values?.find((v) => v.value === value);

  return option?.label || value;
}

function MobileCheckbox({ checked, label, onChange }) {
  return (
    <label className="mobile-filter-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="mobile-filter-checkbox__box" />
      <span className="mobile-filter-checkbox__label">{label}</span>
    </label>
  );
}

export default function MobileCatalogFilters({
  treeData = [],
  slugChain = [],
  showAllFilters = false,
  hasChildren = false,
  availableFilters = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState(null);
  const [filterSearch, setFilterSearch] = useState('');

  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');
  const [draftFilters, setDraftFilters] = useState({});

  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const shouldRestoreFocusRef = useRef(false);

  const priceRange = useMemo(() => extractPriceRange(availableFilters), [availableFilters]);

  const normalizedFilters = useMemo(
    () => normalizeFilters(availableFilters),
    [availableFilters]
  );

  const seriesFilter = useMemo(
    () => normalizedFilters.find((f) => f.parameter === SERIES_PARAMETER) || null,
    [normalizedFilters]
  );

  const otherFilters = useMemo(
    () => normalizedFilters.filter((f) => f.parameter !== SERIES_PARAMETER),
    [normalizedFilters]
  );

  const mobileFilters = useMemo(() => {
    if (!showAllFilters) {
      return seriesFilter ? [seriesFilter] : [];
    }

    return seriesFilter ? [seriesFilter, ...otherFilters] : otherFilters;
  }, [showAllFilters, seriesFilter, otherFilters]);

  const activeFilter = useMemo(() => {
    if (!activeScreen) return null;

    return mobileFilters.find((f) => f.parameter === activeScreen) || null;
  }, [activeScreen, mobileFilters]);

  const currentCategoryData = useMemo(() => {
    const roots = Array.isArray(treeData) ? treeData : [];
    const currentSlugChain = Array.isArray(slugChain) ? slugChain : [];

    if (currentSlugChain.length === 0) {
      return {
        roots,
        node: null,
        ancestors: [],
        subItems: roots,
        subItemsBaseSlugs: [],
      };
    }

    const { node, ancestors, siblings } = findNodeInTree(roots, currentSlugChain);

    if (!node) {
      return {
        roots,
        node: null,
        ancestors: [],
        subItems: [],
        subItemsBaseSlugs: [],
      };
    }

    const safeAncestors = Array.isArray(ancestors) ? ancestors : [];
    const safeSiblings = Array.isArray(siblings) ? siblings : [];
    const children = Array.isArray(node.children) ? node.children : [];
    const nodeHasChildren = children.length > 0;

    return {
      roots,
      node,
      ancestors: safeAncestors,
      subItems: nodeHasChildren
        ? children
        : safeSiblings.filter((s) => s.id !== node.id),
      subItemsBaseSlugs: nodeHasChildren
        ? currentSlugChain
        : currentSlugChain.slice(0, -1),
    };
  }, [treeData, slugChain]);

  const activeChips = useMemo(() => {
    const chips = [];

    if (draftPriceMin !== '' || draftPriceMax !== '') {
      const minText = draftPriceMin !== '' ? formatPrice(draftPriceMin) : formatPrice(priceRange.min);
      const maxText = draftPriceMax !== '' ? formatPrice(draftPriceMax) : formatPrice(priceRange.max);

      chips.push({
        type: 'price',
        label: `Цена: от ${minText} до ${maxText}`,
      });
    }

    Object.entries(draftFilters).forEach(([parameter, values]) => {
      if (!Array.isArray(values) || values.length === 0) return;

      values.forEach((value) => {
        const filter = normalizedFilters.find((f) => f.parameter === parameter);
        const title = filter?.title || parameter;
        const label = getFilterLabel(normalizedFilters, parameter, value);

        chips.push({
          type: 'filter',
          parameter,
          value,
          label: `${title}: ${label}`,
        });
      });
    });

    return chips;
  }, [draftPriceMin, draftPriceMax, draftFilters, priceRange, normalizedFilters]);

  const hasActiveFilters = activeChips.length > 0;

  const openFilters = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setActiveScreen(null);
    setFilterSearch('');
    setIsOpen(true);
  }, []);

  const closeFilters = useCallback(() => {
    setIsOpen(false);
    setActiveScreen(null);
    setFilterSearch('');
  }, []);

  const syncDraftsFromUrl = useCallback(() => {
    const minPrice = safeNumberOrEmpty(searchParams.get('min_price'));
    const maxPrice = safeNumberOrEmpty(searchParams.get('max_price'));

    const nextDraftFilters = {};
    normalizedFilters.forEach((f) => {
      const key = `filters[${f.parameter}][]`;
      nextDraftFilters[f.parameter] = readAll(searchParams, key);
    });

    setDraftPriceMin(minPrice);
    setDraftPriceMax(maxPrice);
    setDraftFilters(nextDraftFilters);
  }, [searchParams, normalizedFilters]);

  useEffect(() => {
    syncDraftsFromUrl();
  }, [syncDraftsFromUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || !shouldRestoreFocusRef.current) return;

    shouldRestoreFocusRef.current = false;
    triggerRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (activeScreen) {
          setActiveScreen(null);
          setFilterSearch('');
          return;
        }

        closeFilters();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeScreen, closeFilters]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const min = safeNumberOrEmpty(draftPriceMin);
    const max = safeNumberOrEmpty(draftPriceMax);

    if (min !== '') params.set('min_price', min);
    else params.delete('min_price');

    if (max !== '') params.set('max_price', max);
    else params.delete('max_price');

    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filters[')) params.delete(key);
    }

    Object.entries(draftFilters || {}).forEach(([parameter, values]) => {
      const key = `filters[${parameter}][]`;

      (values || []).forEach((val) => {
        params.append(key, String(val));
      });
    });

    params.delete('page');

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [searchParams, draftPriceMin, draftPriceMax, draftFilters, pathname, router]);

  const applyAndClose = useCallback(() => {
    applyFilters();
    closeFilters();
  }, [applyFilters, closeFilters]);

  const handleClearAll = useCallback(() => {
    setDraftPriceMin('');
    setDraftPriceMax('');

    const nextDraftFilters = {};
    normalizedFilters.forEach((f) => {
      nextDraftFilters[f.parameter] = [];
    });

    setDraftFilters(nextDraftFilters);

    const params = new URLSearchParams(searchParams.toString());

    params.delete('min_price');
    params.delete('max_price');
    params.delete('page');

    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filters[')) params.delete(key);
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [normalizedFilters, pathname, router, searchParams]);

  const handleRemoveChip = useCallback((chip) => {
    if (chip.type === 'price') {
      setDraftPriceMin('');
      setDraftPriceMax('');
      return;
    }

    setDraftFilters((prev) => {
      const current = Array.isArray(prev[chip.parameter]) ? prev[chip.parameter] : [];

      return {
        ...prev,
        [chip.parameter]: current.filter((v) => v !== chip.value),
      };
    });
  }, []);

  const handleFilterToggle = useCallback((parameter, value) => {
    const v = String(value);

    setDraftFilters((prev) => {
      const current = Array.isArray(prev[parameter]) ? prev[parameter] : [];
      const next = current.includes(v)
        ? current.filter((x) => x !== v)
        : [...current, v];

      return {
        ...prev,
        [parameter]: next,
      };
    });
  }, []);

  const handleBackToMain = useCallback(() => {
    setActiveScreen(null);
    setFilterSearch('');
  }, []);

  const openFilterScreen = useCallback((parameter) => {
    setActiveScreen(parameter);
    setFilterSearch('');
  }, []);

  const filteredActiveFilterValues = useMemo(() => {
    if (!activeFilter) return [];

    const query = filterSearch.trim().toLowerCase();

    if (!query) return activeFilter.values;

    return activeFilter.values.filter((option) => (
      option.label.toLowerCase().includes(query)
    ));
  }, [activeFilter, filterSearch]);

  const currentPriceMin = draftPriceMin !== '' ? draftPriceMin : String(priceRange.min);
  const currentPriceMax = draftPriceMax !== '' ? draftPriceMax : String(priceRange.max);

  return (
    <div className="mobile-catalog-filters">
      <button
        ref={triggerRef}
        className="mobile-filter-trigger"
        type="button"
        onClick={openFilters}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8.9 16.47H2.7C2.31 16.47 2 16.78 2 17.17C2 17.56 2.31 17.87 2.7 17.87H8.9C9.29 17.87 9.6 17.56 9.6 17.17C9.6 16.78 9.29 16.47 8.9 16.47Z" fill="#181818" />
          <path d="M21.3 16.47H18.89C18.89 15.85 18.84 15.46 18.68 15.08C18.4 14.41 17.86 13.86 17.18 13.58C16.67 13.37 16.14 13.37 15.09 13.37C14.04 13.37 13.51 13.37 13 13.58C12.32 13.86 11.79 14.39 11.5 15.08C11.29 15.59 11.29 16.12 11.29 17.17C11.29 18.22 11.29 18.75 11.5 19.26C11.78 19.94 12.31 20.47 13 20.76C13.51 20.97 14.04 20.97 15.09 20.97C16.14 20.97 16.67 20.97 17.18 20.76C17.85 20.48 18.4 19.94 18.68 19.27C18.84 18.89 18.88 18.49 18.89 17.87H21.3C21.69 17.87 22 17.56 22 17.17C22 16.78 21.69 16.47 21.3 16.47ZM17.4 18.73C17.26 19.06 16.99 19.33 16.66 19.47C16.41 19.57 15.94 19.57 15.1 19.57C14.26 19.57 13.79 19.57 13.54 19.47C13.2 19.33 12.94 19.07 12.8 18.73C12.7 18.48 12.7 18.01 12.7 17.17C12.7 16.33 12.7 15.86 12.8 15.61C12.94 15.27 13.2 15.01 13.54 14.87C13.79 14.77 14.25 14.77 15.1 14.77C15.95 14.77 16.41 14.77 16.66 14.87C16.99 15.01 17.26 15.28 17.4 15.61C17.5 15.86 17.5 16.32 17.5 17.17C17.5 18.02 17.5 18.48 17.39 18.73H17.4Z" fill="#181818" />
          <path d="M15.0999 7.53H21.2999C21.6899 7.53 21.9999 7.22 21.9999 6.83C21.9999 6.44 21.6899 6.13 21.2999 6.13H15.0999C14.7099 6.13 14.3999 6.44 14.3999 6.83C14.3999 7.22 14.7099 7.53 15.0999 7.53Z" fill="#181818" />
          <path d="M12.49 8.92003C12.7 8.41003 12.7 7.88003 12.7 6.83003C12.7 5.78003 12.7 5.25003 12.49 4.74003C12.21 4.06003 11.68 3.53003 10.99 3.24003C10.48 3.03003 9.95 3.03003 8.9 3.03003C7.85 3.03003 7.32 3.03003 6.81 3.24003C6.13 3.52003 5.6 4.05003 5.31 4.74003C5.15 5.12003 5.11 5.51003 5.1 6.13003H2.7C2.31 6.13003 2 6.44003 2 6.83003C2 7.22003 2.31 7.53003 2.7 7.53003H5.11C5.11 8.15003 5.16 8.54003 5.32 8.92003C5.6 9.60003 6.13 10.13 6.82 10.42C7.33 10.63 7.86 10.63 8.91 10.63C9.96 10.63 10.49 10.63 11 10.42C11.68 10.14 12.21 9.61003 12.5 8.92003H12.49ZM11.2 8.39003C11.06 8.73003 10.8 8.99003 10.46 9.13003C10.21 9.23003 9.74 9.23003 8.9 9.23003C8.06 9.23003 7.59 9.23003 7.34 9.13003C7 8.99003 6.74 8.73003 6.6 8.39003C6.5 8.14003 6.5 7.67003 6.5 6.83003C6.5 5.99003 6.5 5.52003 6.6 5.27003C6.74 4.93003 7 4.67003 7.34 4.53003C7.59 4.43003 8.06 4.43003 8.9 4.43003C9.74 4.43003 10.21 4.43003 10.46 4.53003C10.8 4.67003 11.06 4.93003 11.2 5.27003C11.3 5.52003 11.3 5.99003 11.3 6.83003C11.3 7.67003 11.3 8.14003 11.2 8.39003Z" fill="#181818" />
        </svg>
        <span>Фильтры</span>
      </button>

      {isOpen && (
        <>
          <button
            className="mobile-filter-overlay"
            type="button"
            aria-label="Закрыть фильтры"
            onClick={closeFilters}
          />

          <div
            id={PANEL_ID}
            className={`mobile-filter-panel${activeScreen ? ' mobile-filter-panel--subscreen' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={activeScreen && activeFilter ? activeFilter.title : 'Фильтры'}
          >
            <div className="mobile-filter-panel__header">
              {activeScreen ? (
                <button
                  className="mobile-filter-panel__back"
                  type="button"
                  onClick={handleBackToMain}
                  aria-label="Назад"
                >
                  <span aria-hidden="true">‹</span>
                  <span>{activeFilter?.title || 'Фильтр'}</span>
                </button>
              ) : (
                <>
                  <h2>Фильтры</h2>

                  {hasActiveFilters && (
                    <button
                      className="mobile-filter-panel__reset"
                      type="button"
                      onClick={handleClearAll}
                    >
                      Сбросить все
                    </button>
                  )}
                </>
              )}

              {!activeScreen && !hasActiveFilters && (
                <button
                  ref={closeButtonRef}
                  className="mobile-filter-panel__close"
                  type="button"
                  aria-label="Закрыть"
                  onClick={closeFilters}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 6L18 18M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="mobile-filter-panel__body">
              {!activeScreen && (
                <div className="mobile-filter-main">
                  {activeChips.length > 0 && (
                    <div className="mobile-filter-chips">
                      {activeChips.map((chip) => (
                        <button
                          key={`${chip.type}-${chip.parameter || 'price'}-${chip.value || 'range'}`}
                          className="mobile-filter-chip"
                          type="button"
                          onClick={() => handleRemoveChip(chip)}
                        >
                          <span>{chip.label}</span>
                          <span aria-hidden="true">×</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mobile-filter-category">
                    <Link href="/catalog" className="mobile-filter-category__back" onClick={closeFilters}>
                      ‹ Все категории
                    </Link>

                    {currentCategoryData.ancestors.map((ancestor, index) => {
                      const ancestorHref = buildUrlFromNodes(
                        currentCategoryData.ancestors.slice(0, index + 1)
                      );

                      return (
                        <Link
                          key={ancestor.id || ancestorHref}
                          href={ancestorHref}
                          className="mobile-filter-category__back"
                          onClick={closeFilters}
                        >
                          ‹ {getNodeName(ancestor)}
                        </Link>
                      );
                    })}

                    {currentCategoryData.node && (
                      <div className="mobile-filter-category__current">
                        {getNodeName(currentCategoryData.node)}
                      </div>
                    )}

                    {currentCategoryData.subItems.map((item) => {
                      const itemSlug = getNodeSlug(item);
                      if (!itemSlug) return null;

                      const href = buildUrl([...currentCategoryData.subItemsBaseSlugs, itemSlug]);
                      const itemName = getNodeName(item);

                      return (
                        <Link
                          key={item.id || href}
                          href={href}
                          className="mobile-filter-category__link"
                          onClick={closeFilters}
                        >
                          {itemName}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mobile-filter-price">
                    <div className="mobile-filter-price__title">Цена</div>

                    <div className="mobile-filter-price__range">
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={Number(currentPriceMin)}
                        onChange={(event) => {
                          const next = Math.min(Number(event.target.value), Number(currentPriceMax) - 1);
                          setDraftPriceMin(String(next));
                        }}
                      />

                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={Number(currentPriceMax)}
                        onChange={(event) => {
                          const next = Math.max(Number(event.target.value), Number(currentPriceMin) + 1);
                          setDraftPriceMax(String(next));
                        }}
                      />
                    </div>

                    <div className="mobile-filter-price__inputs">
                      <label className="mobile-filter-price__field">
                        <span>от</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={draftPriceMin}
                          placeholder={String(priceRange.min)}
                          onChange={(event) => {
                            setDraftPriceMin(safeNumberOrEmpty(event.target.value));
                          }}
                        />
                      </label>

                      <label className="mobile-filter-price__field">
                        <span>до</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={draftPriceMax}
                          placeholder={String(priceRange.max)}
                          onChange={(event) => {
                            setDraftPriceMax(safeNumberOrEmpty(event.target.value));
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {mobileFilters.map((filter) => {
                    const selectedValues = draftFilters[filter.parameter] || [];
                    const previewValues = filter.values.slice(0, 5);
                    const hasMore = filter.values.length > previewValues.length;

                    return (
                      <div key={filter.parameter} className="mobile-filter-preview">
                        <div className="mobile-filter-preview__header">
                          <div className="mobile-filter-preview__title">{filter.title}</div>

                          {hasMore && (
                            <button
                              className="mobile-filter-preview__all"
                              type="button"
                              onClick={() => openFilterScreen(filter.parameter)}
                            >
                              <span>Все</span>
                              <span aria-hidden="true">›</span>
                            </button>
                          )}
                        </div>

                        <div className="mobile-filter-preview__list">
                          {previewValues.map((option) => (
                            <MobileCheckbox
                              key={option.value}
                              label={option.label}
                              checked={selectedValues.includes(option.value)}
                              onChange={() => handleFilterToggle(filter.parameter, option.value)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeScreen && activeFilter && (
                <div className="mobile-filter-options">
                  <div className="mobile-filter-search">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M9 15.5C12.5899 15.5 15.5 12.5899 15.5 9C15.5 5.41015 12.5899 2.5 9 2.5C5.41015 2.5 2.5 5.41015 2.5 9C2.5 12.5899 5.41015 15.5 9 15.5Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M13.75 13.75L17.5 17.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>

                    <input
                      type="search"
                      value={filterSearch}
                      placeholder="Поиск"
                      onChange={(event) => setFilterSearch(event.target.value)}
                    />
                  </div>

                  <div className="mobile-filter-options__list">
                    {filteredActiveFilterValues.map((option) => {
                      const selectedValues = draftFilters[activeFilter.parameter] || [];

                      return (
                        <MobileCheckbox
                          key={option.value}
                          label={option.label}
                          checked={selectedValues.includes(option.value)}
                          onChange={() => handleFilterToggle(activeFilter.parameter, option.value)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mobile-filter-panel__footer">
              <button
                className="mobile-filter-panel__apply"
                type="button"
                onClick={activeScreen ? handleBackToMain : applyAndClose}
              >
                {activeScreen ? 'Выбрать' : hasActiveFilters ? 'Показать товары' : 'Закрыть'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}