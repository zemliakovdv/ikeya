// components/catalog/ProductSort.js
'use client';

import { useMemo, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function ProductSort({ currentSort = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

const sortOptions = useMemo(
  () => [
    { value: 'cheapest',  label: 'Дешевле' },
    { value: 'expensive', label: 'Дороже' },
  ],
  []
);


  const currentLabel =
    sortOptions.find(opt => opt.value === currentSort)?.label ||
    'Сортировка';

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelectSort = useCallback(
    (value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value) {
        params.delete('sort');
      } else {
        params.set('sort', value);
      }

      params.delete('page');

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);

      setIsOpen(false);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="all-catalog-sort">
      <div className="catalog-sort">
        <div className="catalog-sort__selected" onClick={toggleDropdown}>
          <span className="catalog-sort__current">{currentLabel}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z"
              fill="#757575"
            />
          </svg>
        </div>

        {isOpen && (
          <ul className="catalog-sort__dropdown">
            {sortOptions.map((option) => (
              <li
                key={String(option.value)}
                className={`catalog-sort__option ${
                  option.value === currentSort ? 'active' : ''
                }`}
                data-sort={option.value || ''}
                onClick={() => handleSelectSort(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}