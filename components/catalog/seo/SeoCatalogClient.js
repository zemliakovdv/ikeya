'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '@/components/catalog/products/ProductCard';
import CheckboxFilter from '@/components/catalog/sidebar/CheckboxFilter';
import PriceFilter from '@/components/catalog/sidebar/PriceFilter';

const PRICE_FILTER_PARAMETER = 'f-price-buckets';
const SORT_CLOSE_DELAY = 180;
const DEFAULT_EMPTY_FILTERED_MESSAGE = 'По выбранным фильтрам товары не найдены.';
const DEFAULT_EMPTY_SNAPSHOT_MESSAGE = 'Сейчас товаров в этой подборке нет. Посмотрите похожие товары в каталоге.';
const SORT_OPTIONS = [
  { value: null, label: 'По умолчанию' },
  { value: 'cheapest', label: 'Дешевле' },
  { value: 'expensive', label: 'Дороже' },
];

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  return [value];
}

function toStringValue(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeCompareValue(value) {
  return toStringValue(value).toLowerCase();
}

function parsePrice(value) {
  const normalized = toStringValue(value).replace(/\s/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function getProductAttributes(product) {
  if (isPlainObject(product?.attributes)) return product.attributes;
  return isPlainObject(product) ? product : {};
}

function normalizeProductTeaser(resource, index) {
  if (isPlainObject(resource?.attributes)) return resource;
  if (!isPlainObject(resource)) return null;

  return {
    id: resource.id || resource.sku || resource.slug || `seo-product-${index}`,
    type: resource.type || 'product_teaser',
    attributes: { ...resource },
  };
}

function getProductKey(product, index) {
  return (
    product?.id ||
    product?.attributes?.sku ||
    product?.sku ||
    product?.attributes?.id ||
    index
  );
}

function getQuantity(product) {
  const attr = getProductAttributes(product);
  const quantity = Number(attr.quantity ?? product?.quantity ?? 0);
  return Number.isFinite(quantity) ? quantity : 0;
}

function getPrice(product) {
  const attr = getProductAttributes(product);
  return parsePrice(attr.price_byn ?? attr.price ?? product?.price_byn ?? product?.price);
}

function getPriceRangeFromProducts(products) {
  const prices = products
    .map((product) => getPrice(product))
    .filter((value) => Number.isFinite(value));

  if (prices.length === 0) {
    return { min: 0, max: 10000 };
  }

  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));

  return {
    min,
    max: max > min ? max : min + 1,
  };
}

function getPriceRangeFromFilters(filters) {
  const priceFilter = filters.find((filter) => filter.parameter === PRICE_FILTER_PARAMETER);
  if (!priceFilter?.values?.length) return null;

  const firstValue = priceFilter.values[0];
  const min = Number(firstValue?.min);
  const max = Number(firstValue?.max);

  if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
    return { min, max };
  }

  const match = toStringValue(firstValue?.id).match(/^PRICE_(\d+(?:[.,]\d+)?)_(\d+(?:[.,]\d+)?)$/);
  if (!match) return null;

  const parsedMin = parsePrice(match[1]);
  const parsedMax = parsePrice(match[2]);

  if (!Number.isFinite(parsedMin) || !Number.isFinite(parsedMax) || parsedMax <= parsedMin) {
    return null;
  }

  return {
    min: parsedMin,
    max: parsedMax,
  };
}

function buildPriceRange(products, filters) {
  return getPriceRangeFromFilters(filters) || getPriceRangeFromProducts(products);
}

function normalizeFilterOption(option) {
  if (!isPlainObject(option)) {
    const value = toStringValue(option);
    return value ? { value, label: value } : null;
  }

  const value = toStringValue(option.id ?? option.value ?? option.slug ?? option.code);
  const label = toStringValue(option.translated_name ?? option.name ?? option.label ?? option.title ?? value);

  if (!value || !label) return null;

  return { value, label };
}

function normalizeUiFilters(source) {
  if (!Array.isArray(source)) return [];

  return source
    .filter((filter) => isPlainObject(filter))
    .filter((filter) => toStringValue(filter.parameter))
    .filter((filter) => toStringValue(filter.parameter) !== PRICE_FILTER_PARAMETER)
    .map((filter) => {
      const parameter = toStringValue(filter.parameter);
      const explicitTitle = toStringValue(
        filter.translated_name ?? filter.name ?? filter.label ?? filter.title
      );

      return {
        parameter,
        title: explicitTitle || parameter,
        hasExplicitTitle: Boolean(explicitTitle),
        values: toArray(filter.values).map(normalizeFilterOption).filter(Boolean),
      };
    })
    .filter((filter) => filter.values.length > 0 || isCollectionParameter(filter.parameter));
}

function isAvailabilityParameter(parameter) {
  const value = normalizeCompareValue(parameter);
  return value === 'only_available' || value.includes('availability') || value.includes('available') || value.includes('stock');
}

function isCategoryParameter(parameter) {
  const value = normalizeCompareValue(parameter);
  return value === 'category' || value === 'category_id';
}

function isCollectionParameter(parameter) {
  const value = normalizeCompareValue(parameter).replace(/^f-/, '');
  return value === 'collection' || value === 'collections';
}

function getParameterAliases(parameter) {
  const raw = toStringValue(parameter);
  const stripped = raw.replace(/^f-/, '');
  const dashed = stripped.replace(/_/g, '-');
  const underscored = stripped.replace(/-/g, '_');

  return Array.from(new Set([raw, stripped, dashed, underscored].filter(Boolean)));
}

function extractPrimitiveValues(value) {
  if (Array.isArray(value)) {
    return value.flatMap(extractPrimitiveValues);
  }

  if (isPlainObject(value)) {
    return [
      value.id,
      value.value,
      value.slug,
      value.code,
      value.name,
      value.label,
      value.title,
      value.translated_name,
    ]
      .map(toStringValue)
      .filter(Boolean);
  }

  const primitive = toStringValue(value);
  return primitive ? [primitive] : [];
}

function collectNamedArrayValues(entries, aliases, extractValues = extractPrimitiveValues) {
  if (!Array.isArray(entries)) return [];

  return entries.flatMap((entry) => {
    if (!isPlainObject(entry)) return [];

    const keys = [
      entry.parameter,
      entry.key,
      entry.code,
      entry.name,
      entry.slug,
      entry.id,
    ].map(normalizeCompareValue);

    const matches = aliases.some((alias) => keys.includes(normalizeCompareValue(alias)));
    if (!matches) return [];

    return extractValues(
      entry.value ??
      entry.values ??
      entry.option ??
      entry.options ??
      entry.items ??
      entry.data
    );
  });
}

function getProductDisplayTitle(product) {
  const attr = getProductAttributes(product);
  return toStringValue(attr.name_ru);
}

function getProductCollectionOptions(product) {
  const title = getProductDisplayTitle(product);
  if (!title) return [];

  return title
    .split('/')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .map((label) => ({
      value: normalizeCompareValue(label),
      label,
    }))
    .filter((option) => option.value);
}

function buildCollectionFilter(products) {
  const values = mergeCollectionOptions(products.flatMap(getProductCollectionOptions));

  if (values.length === 0) return null;

  return {
    parameter: 'collection',
    title: 'Коллекция',
    hasExplicitTitle: true,
    values,
  };
}

function mergeCollectionOptions(...optionGroups) {
  const uniqueOptions = new Map();

  optionGroups.flat().forEach((option) => {
    const label = toStringValue(option?.label);
    const value = normalizeCompareValue(option?.value || label);

    if (value && label && !uniqueOptions.has(value)) {
      uniqueOptions.set(value, { value, label });
    }
  });

  return Array.from(uniqueOptions.values())
    .sort((left, right) => left.label.localeCompare(right.label, 'ru', {
      sensitivity: 'base',
      numeric: true,
    }));
}

function mergeCollectionFilter(backendFilters, derivedFilter) {
  const collectionFilters = backendFilters.filter((filter) =>
    isCollectionParameter(filter.parameter)
  );

  if (collectionFilters.length === 0) {
    return derivedFilter ? [...backendFilters, derivedFilter] : backendFilters;
  }

  const firstCollectionIndex = backendFilters.findIndex((filter) =>
    isCollectionParameter(filter.parameter)
  );
  const firstCollectionFilter = collectionFilters[0];
  const explicitTitleFilter = collectionFilters.find((filter) => filter.hasExplicitTitle);

  if (!derivedFilter?.values.length) {
    return backendFilters.filter((filter) => !isCollectionParameter(filter.parameter));
  }

  const mergedCollectionFilter = {
    ...firstCollectionFilter,
    title: explicitTitleFilter?.title || derivedFilter?.title || firstCollectionFilter.title,
    hasExplicitTitle: Boolean(explicitTitleFilter) || Boolean(derivedFilter?.hasExplicitTitle),
    values: derivedFilter.values,
  };

  return backendFilters.reduce((result, filter, index) => {
    if (!isCollectionParameter(filter.parameter)) {
      result.push(filter);
    } else if (index === firstCollectionIndex) {
      result.push(mergedCollectionFilter);
    }

    return result;
  }, []);
}

function getProductParameterValues(product, parameter) {
  const attr = getProductAttributes(product);
  const aliases = getParameterAliases(parameter);
  const values = [];

  aliases.forEach((alias) => {
    values.push(...extractPrimitiveValues(attr[alias]));

    if (isPlainObject(attr.filters) && alias in attr.filters) {
      values.push(...extractPrimitiveValues(attr.filters[alias]));
    }

    if (isPlainObject(attr.parameters) && alias in attr.parameters) {
      values.push(...extractPrimitiveValues(attr.parameters[alias]));
    }
  });

  values.push(...collectNamedArrayValues(attr.parameters, aliases));
  values.push(...collectNamedArrayValues(attr.characteristics, aliases));
  values.push(...collectNamedArrayValues(attr.filters_list, aliases));

  return Array.from(new Set(values.map(normalizeCompareValue).filter(Boolean)));
}

function matchesSelectedValues(product, parameter, selectedValues) {
  if (!selectedValues.length) return true;

  if (isAvailabilityParameter(parameter)) {
    return getQuantity(product) > 0;
  }

  if (isCategoryParameter(parameter)) {
    const attr = getProductAttributes(product);
    const categoryValue = normalizeCompareValue(attr.category_id ?? product?.category_id);
    return selectedValues.some((value) => normalizeCompareValue(value) === categoryValue);
  }

  if (isCollectionParameter(parameter)) {
    const productCollections = getProductCollectionOptions(product)
      .map((option) => option.value);

    if (productCollections.length === 0) return false;

    return selectedValues.some((value) =>
      productCollections.includes(normalizeCompareValue(value))
    );
  }

  const productValues = getProductParameterValues(product, parameter);
  if (productValues.length === 0) return true;

  return selectedValues.some((value) => productValues.includes(normalizeCompareValue(value)));
}

function buildFilterTitles(filters) {
  return filters.reduce((acc, filter) => {
    acc[filter.parameter] = filter.title;
    return acc;
  }, {});
}

function hasActiveSelections(selectedFilters) {
  return Object.values(selectedFilters).some((values) => Array.isArray(values) && values.length > 0);
}

function buildEmptyStateLink(catalogUrl) {
  const href = toStringValue(catalogUrl);
  return href || '/catalog';
}

function SeoLocalSort({ currentSort, onSelect }) {
  const sortRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const currentLabel =
    SORT_OPTIONS.find((option) => option.value === currentSort)?.label ||
    SORT_OPTIONS[0].label;

  const closeDropdown = () => {
    if (!isOpen || isClosing) return;

    setIsClosing(true);
    setIsOpen(false);

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, SORT_CLOSE_DELAY);
  };

  const openDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setShouldRender(true);
    setIsClosing(false);

    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
  };

  useEffect(() => {
    if (!shouldRender) return undefined;

    const handleDocumentClick = (event) => {
      if (!sortRef.current?.contains(event.target)) {
        closeDropdown();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [shouldRender, isOpen, isClosing]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    document.body.classList.add('catalog-sort-open');

    return () => {
      document.body.classList.remove('catalog-sort-open');
    };
  }, [shouldRender]);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    document.body.classList.remove('catalog-sort-open');
  }, []);

  return (
    <div className="all-catalog-sort">
      <div
        className={`catalog-sort ${isOpen ? 'catalog-sort--open' : ''} ${isClosing ? 'catalog-sort--closing' : ''}`}
        ref={sortRef}
      >
        <button
          className="catalog-sort__selected"
          type="button"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="catalog-sort__current">{currentLabel}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z"
              fill="#757575"
            />
          </svg>
        </button>

        {shouldRender ? (
          <>
            <button
              className="catalog-sort__overlay"
              type="button"
              aria-label="Закрыть сортировку"
              onClick={closeDropdown}
            />

            <ul className="catalog-sort__dropdown" role="listbox">
              {SORT_OPTIONS.map((option) => (
                <li
                  key={String(option.value)}
                  className={`catalog-sort__option ${option.value === currentSort ? 'active' : ''}`}
                  data-sort={option.value || ''}
                  role="option"
                  aria-selected={option.value === currentSort}
                >
                  <button
                    type="button"
                    className="catalog-sort__option-button"
                    onClick={() => {
                      onSelect(option.value);
                      closeDropdown();
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function SeoCatalogClient({
  initialProducts = [],
  filters = [],
  catalogUrl = '',
}) {
  const normalizedProducts = useMemo(
    () => initialProducts.map(normalizeProductTeaser).filter(Boolean),
    [initialProducts]
  );

  const uiFilters = useMemo(() => {
    const backendUiFilters = normalizeUiFilters(filters);
    const derivedCollectionFilter = buildCollectionFilter(normalizedProducts);
    return mergeCollectionFilter(backendUiFilters, derivedCollectionFilter);
  }, [filters, normalizedProducts]);
  const filterTitles = useMemo(() => buildFilterTitles(uiFilters), [uiFilters]);
  const priceRange = useMemo(
    () => buildPriceRange(normalizedProducts, filters),
    [normalizedProducts, filters]
  );

  const [selectedFilters, setSelectedFilters] = useState(() =>
    uiFilters.reduce((acc, filter) => {
      acc[filter.parameter] = [];
      return acc;
    }, {})
  );
  const [selectedMinPrice, setSelectedMinPrice] = useState(priceRange.min);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(priceRange.max);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    setSelectedFilters((previousFilters) => {
      const nextFilters = uiFilters.reduce((acc, filter) => {
        const validValues = new Set(filter.values.map((option) => option.value));
        const previousValues = Array.isArray(previousFilters[filter.parameter])
          ? previousFilters[filter.parameter]
          : [];

        acc[filter.parameter] = previousValues.filter((value) => validValues.has(value));
        return acc;
      }, {});

      const previousKeys = Object.keys(previousFilters);
      const nextKeys = Object.keys(nextFilters);
      const isUnchanged =
        previousKeys.length === nextKeys.length &&
        nextKeys.every((key) => (
          key in previousFilters &&
          previousFilters[key].length === nextFilters[key].length &&
          previousFilters[key].every((value, index) => value === nextFilters[key][index])
        ));

      return isUnchanged ? previousFilters : nextFilters;
    });
  }, [uiFilters]);

  const filteredProducts = useMemo(() => {
    let nextProducts = normalizedProducts.filter((product) => {
      const price = getPrice(product);
      if (!Number.isFinite(price)) return true;
      return price >= selectedMinPrice && price <= selectedMaxPrice;
    });

    Object.entries(selectedFilters).forEach(([parameter, values]) => {
      if (!Array.isArray(values) || values.length === 0) return;
      nextProducts = nextProducts.filter((product) =>
        matchesSelectedValues(product, parameter, values)
      );
    });

    if (sort === 'cheapest') {
      nextProducts = [...nextProducts].sort((left, right) => (getPrice(left) ?? 0) - (getPrice(right) ?? 0));
    } else if (sort === 'expensive') {
      nextProducts = [...nextProducts].sort((left, right) => (getPrice(right) ?? 0) - (getPrice(left) ?? 0));
    }

    return nextProducts;
  }, [normalizedProducts, selectedMinPrice, selectedMaxPrice, selectedFilters, sort]);

  const hasActiveFilters = useMemo(() => (
    selectedMinPrice !== priceRange.min ||
    selectedMaxPrice !== priceRange.max ||
    hasActiveSelections(selectedFilters)
  ), [priceRange.max, priceRange.min, selectedFilters, selectedMaxPrice, selectedMinPrice]);

  const chips = useMemo(() => {
    const list = [];

    if (selectedMinPrice !== priceRange.min || selectedMaxPrice !== priceRange.max) {
      list.push({
        id: 'price',
        type: 'price',
        label: `Цена: ${selectedMinPrice} — ${selectedMaxPrice}`,
      });
    }

    Object.entries(selectedFilters).forEach(([parameter, values]) => {
      values.forEach((value) => {
        const filter = uiFilters.find((entry) => entry.parameter === parameter);
        const option = filter?.values.find((entry) => entry.value === value);
        const valueLabel = option?.label || value;
        const title = filterTitles[parameter];

        list.push({
          id: `${parameter}:${value}`,
          type: 'filter',
          parameter,
          value,
          label: title ? `${title}: ${valueLabel}` : valueLabel,
        });
      });
    });

    return list;
  }, [filterTitles, priceRange.max, priceRange.min, selectedFilters, selectedMaxPrice, selectedMinPrice, uiFilters]);

  const handleToggleFilter = (parameter, value) => {
    const nextValue = toStringValue(value);

    setSelectedFilters((prev) => {
      const currentValues = Array.isArray(prev[parameter]) ? prev[parameter] : [];
      const nextValues = currentValues.includes(nextValue)
        ? currentValues.filter((entry) => entry !== nextValue)
        : [...currentValues, nextValue];

      return {
        ...prev,
        [parameter]: nextValues,
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedMinPrice(priceRange.min);
    setSelectedMaxPrice(priceRange.max);
    setSort(null);
    setSelectedFilters(
      uiFilters.reduce((acc, filter) => {
        acc[filter.parameter] = [];
        return acc;
      }, {})
    );
  };

  const handleRemoveChip = (chip) => {
    if (chip.type === 'price') {
      setSelectedMinPrice(priceRange.min);
      setSelectedMaxPrice(priceRange.max);
      return;
    }

    if (chip.type === 'filter' && chip.parameter) {
      setSelectedFilters((prev) => ({
        ...prev,
        [chip.parameter]: (prev[chip.parameter] || []).filter((value) => value !== chip.value),
      }));
    }
  };

  const emptyCatalogLink = buildEmptyStateLink(catalogUrl);
  const hasSnapshot = normalizedProducts.length > 0;

  return (
    <div className="all-catalog-inner">
      {hasSnapshot ? (
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
          <PriceFilter
            min={priceRange.min}
            max={priceRange.max}
            currentMin={selectedMinPrice}
            currentMax={selectedMaxPrice}
            onChange={(min, max) => {
              setSelectedMinPrice(min);
              setSelectedMaxPrice(max);
            }}
          />

          {uiFilters.map((filter) => (
            <CheckboxFilter
              key={filter.parameter}
              title={filter.title}
              filterKey={filter.parameter}
              options={filter.values}
              selectedOptions={selectedFilters[filter.parameter] || []}
              onToggle={handleToggleFilter}
              showMore
            />
          ))}

          {hasActiveFilters ? (
            <button className="clear-filters" onClick={clearAllFilters} type="button">
              Очистить фильтры
            </button>
          ) : null}
        </aside>
      ) : null}

      <div className="all-catalog-center" style={!hasSnapshot ? { width: '100%' } : {}}>
        {hasSnapshot ? (
          <div className="catalog-toolbar-sticky">
            <div className="catalog-toolbar">
              <SeoLocalSort currentSort={sort} onSelect={setSort} />
            </div>
          </div>
        ) : null}

        {chips.length > 0 ? (
          <div className="all-catalog-cheaps">
            {chips.map((chip) => (
              <div key={chip.id} className="catalog-cheaps-item">
                <p>
                  <span>{chip.label}</span>
                </p>

                <button
                  className="cheaps-item-delete"
                  onClick={() => handleRemoveChip(chip)}
                  aria-label={`Удалить фильтр ${chip.label}`}
                  type="button"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2083 10.6683C10.0883 10.6683 9.975 10.6217 9.88833 10.535L5.335 5.98167L0.781667 10.535C0.601667 10.715 0.315 10.715 0.135 10.535C-0.045 10.355 -0.045 10.0683 0.135 9.88833L4.68833 5.335L0.135 0.781667C-0.045 0.601667 -0.045 0.315 0.135 0.135C0.315 -0.045 0.601667 -0.045 0.781667 0.135L5.335 4.68833L9.88833 0.135C10.0683 -0.045 10.355 -0.045 10.535 0.135C10.715 0.315 10.715 0.601667 10.535 0.781667L5.98167 5.335L10.535 9.88833C10.715 10.0683 10.715 10.355 10.535 10.535C10.4483 10.6217 10.3283 10.6683 10.215 10.6683H10.2083Z" fill="#757575" />
                  </svg>
                </button>
              </div>
            ))}

            <button className="cheaps-clear-all" onClick={clearAllFilters} type="button">
              Очистить всё
            </button>
          </div>
        ) : null}

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={`${getProductKey(product, index)}-seo`}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="all-catalog-empty">
            <p>{hasSnapshot ? DEFAULT_EMPTY_FILTERED_MESSAGE : DEFAULT_EMPTY_SNAPSHOT_MESSAGE}</p>
            <p style={{ marginTop: '12px' }}>
              <a href={emptyCatalogLink}>Перейти в каталог</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
