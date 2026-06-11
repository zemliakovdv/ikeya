// components/catalog/ProductSort.js
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SORT_CLOSE_DELAY = 180;

const DEFAULT_OPTIONS = [
  { value: null, label: 'По умолчанию' },
  { value: 'cheapest', label: 'Дешевле' },
  { value: 'expensive', label: 'Дороже' },
];

/**
 * Дропдаун сортировки.
 *
 * Режим по умолчанию (каталог): без пропсов options/onSelect —
 * пишет выбор в URL (?sort=...), как и раньше.
 *
 * Управляемый режим (например, «Покупки» в профиле):
 *   <ProductSort options={[...]} currentSort={sort} onSelect={setSort} />
 * — URL не трогает, выбор отдаёт в колбэк.
 */
export default function ProductSort({ currentSort = null, options = null, onSelect = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const sortOptions = useMemo(
    () => (Array.isArray(options) && options.length ? options : DEFAULT_OPTIONS),
    [options]
  );

  const currentLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label ||
    sortOptions[0]?.label ||
    'По умолчанию';

  const closeDropdown = useCallback(() => {
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
  }, [isOpen, isClosing]);

  const openDropdown = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setShouldRender(true);
    setIsClosing(false);

    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
  }, [isOpen, openDropdown, closeDropdown]);

  useEffect(() => {
    if (!shouldRender) return;

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
  }, [shouldRender, closeDropdown]);

  useEffect(() => {
    if (!shouldRender) return;

    document.body.classList.add('catalog-sort-open');

    return () => {
      document.body.classList.remove('catalog-sort-open');
    };
  }, [shouldRender]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      document.body.classList.remove('catalog-sort-open');
    };
  }, []);

  const handleSelectSort = useCallback(
    (value) => {
      // Управляемый режим: отдаём выбор наружу, URL не трогаем
      if (typeof onSelect === 'function') {
        onSelect(value);
        closeDropdown();
        return;
      }

      // Режим каталога: пишем в URL
      const params = new URLSearchParams(searchParams.toString());

      if (!value) {
        params.delete('sort');
      } else {
        params.set('sort', value);
      }

      params.delete('page');

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);

      closeDropdown();
    },
    [onSelect, router, pathname, searchParams, closeDropdown]
  );

  return (
    <div className="all-catalog-sort">
      <div
        className={`catalog-sort ${isOpen ? 'catalog-sort--open' : ''} ${
          isClosing ? 'catalog-sort--closing' : ''
        }`}
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

        {shouldRender && (
          <>
            <button
              className="catalog-sort__overlay"
              type="button"
              aria-label="Закрыть сортировку"
              onClick={closeDropdown}
            />

            <ul className="catalog-sort__dropdown" role="listbox">
              {sortOptions.map((option) => (
                <li
                  key={String(option.value)}
                  className={`catalog-sort__option ${
                    option.value === currentSort ? 'active' : ''
                  }`}
                  data-sort={option.value || ''}
                  role="option"
                  aria-selected={option.value === currentSort}
                >
                  <button
                    type="button"
                    className="catalog-sort__option-button"
                    onClick={() => handleSelectSort(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}