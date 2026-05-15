'use client';

import { useCallback, useEffect, useState } from 'react';
import FilterAside from '@/components/catalog/sidebar/FilterAside';

export default function MobileCatalogFilters({
  treeData = [],
  slugChain = [],
  showAllFilters = false,
  hasChildren = false,
  availableFilters = [],
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openFilters = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeFilters = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeFilters();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeFilters]);

  return (
    <div className="mobile-catalog-filters">
      <button
        className="mobile-filter-trigger"
        type="button"
        onClick={openFilters}
        aria-expanded={isOpen}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3 5.5H17M5.5 10H14.5M8 14.5H12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
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

          <div className="mobile-filter-panel" role="dialog" aria-modal="true" aria-label="Фильтры">
            <div className="mobile-filter-panel__header">
              <h2>Фильтры</h2>
              <button
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
            </div>

            <div className="mobile-filter-panel__body">
              <FilterAside
                treeData={treeData}
                slugChain={slugChain}
                showAllFilters={showAllFilters}
                hasChildren={hasChildren}
                availableFilters={availableFilters}
              />
            </div>

            <div className="mobile-filter-panel__footer">
              <button
                className="mobile-filter-panel__apply"
                type="button"
                onClick={closeFilters}
              >
                Показать товары
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}