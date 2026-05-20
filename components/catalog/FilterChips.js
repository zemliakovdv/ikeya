// components/catalog/FilterChips.js
'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function uniq(arr) {
  return Array.from(new Set((arr || []).map(String)));
}

function formatPriceLabel(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;

  const normalized = String(value).trim().replace(',', '.');
  const n = Number(normalized);

  if (!Number.isFinite(n)) return String(value);

  return String(n);
}

// Удаляем фильтры по всем ключам filters[...][]
// потому что параметры динамические и мы не можем заранее знать список.
function clearAllFiltersFromParams(params) {
  params.delete('min_price');
  params.delete('max_price');
  params.delete('page');

  for (const key of Array.from(params.keys())) {
    if (key.startsWith('filters[')) params.delete(key);
  }
}

function removeOneFilterValue(params, parameter, value) {
  const key = `filters[${parameter}][]`;
  const existing = params.getAll(key).map(String);

  params.delete(key);

  existing
    .filter((v) => v !== String(value))
    .forEach((v) => params.append(key, v));
}

export default function FilterChips({ filterLabels = {}, filterTitles = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chips = useMemo(() => {
    const list = [];

    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');

    if (minPrice || maxPrice) {
      const minLabel = formatPriceLabel(minPrice, '0');
      const maxLabel = formatPriceLabel(maxPrice, '∞');

      list.push({
        id: 'price',
        type: 'price',
        label: `Цена: ${minLabel} — ${maxLabel}`,
        parameter: null,
        value: null,
      });
    }

    const paramToValues = new Map();

    for (const key of searchParams.keys()) {
      if (!key.startsWith('filters[') || !key.endsWith('][]')) continue;

      const match = key.match(/^filters\[(.+?)\]\[\]$/);
      if (!match) continue;

      const parameter = match[1];
      const values = uniq(searchParams.getAll(key));

      paramToValues.set(parameter, values);
    }

    for (const [parameter, values] of paramToValues.entries()) {
      values.forEach((v) => {
        const valueLabel = filterLabels[v] || v;
        const paramTitle = filterTitles[parameter];
        const label = paramTitle ? `${paramTitle}: ${valueLabel}` : valueLabel;

        list.push({
          id: `${parameter}:${v}`,
          type: 'filter',
          label,
          parameter,
          value: v,
        });
      });
    }

    return list;
  }, [searchParams, filterLabels, filterTitles]);

  const push = useCallback(
    (params) => {
      params.delete('page');

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname]
  );

  const handleRemoveChip = useCallback(
    (chip) => {
      const params = new URLSearchParams(searchParams.toString());

      if (chip.type === 'price') {
        params.delete('min_price');
        params.delete('max_price');
        push(params);
        return;
      }

      if (chip.type === 'filter' && chip.parameter) {
        removeOneFilterValue(params, chip.parameter, chip.value);
        push(params);
      }
    },
    [searchParams, push]
  );

  const handleClearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    clearAllFiltersFromParams(params);
    push(params);
  }, [searchParams, push]);

  if (chips.length === 0) return null;

  return (
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
              <path d="M10.2083 10.6683C10.0883 10.6683 9.975 10.6217 9.88833 10.535L5.335 5.98167L0.781667 10.535C0.601667 10.715 0.315 10.715 0.135 10.535C-0.045 10.355 -0.045 10.0683 0.135 9.88833L4.68833 5.335L0.135 0.781667C-0.045 0.601667 -0.045 0.315 0.135 0.135C0.315 -0.045 0.601667 -0.045 0.781667 0.135L5.335 4.68833L9.88833 0.135C10.0683 -0.045 10.355 -0.045 10.535 0.135C10.715 0.315 10.715 0.601667 10.535 0.781667L5.98167 5.335L10.535 9.88833C10.715 10.0683 10.715 10.355 10.535 10.535C10.4483 10.6217 10.3283 10.6683 10.215 10.6683H10.2083Z" fill="#757575"/>
            </svg>
          </button>
        </div>
      ))}

      <button className="cheaps-clear-all" onClick={handleClearAll} type="button">
        Очистить всё
      </button>
    </div>
  );
}