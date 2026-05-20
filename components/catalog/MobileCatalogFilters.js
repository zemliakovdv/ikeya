'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import FilterAside from '@/components/catalog/sidebar/FilterAside';

const PANEL_ID = 'mobile-catalog-filter-panel';

export default function MobileCatalogFilters({
  treeData = [],
  slugChain = [],
  showAllFilters = false,
  hasChildren = false,
  availableFilters = [],
}) {
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const shouldRestoreFocusRef = useRef(false);

  const openFilters = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setIsOpen(true);
  }, []);

  const closeFilters = useCallback(() => {
    setIsOpen(false);
  }, []);

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
        ref={triggerRef}
        className="mobile-filter-trigger"
        type="button"
        onClick={openFilters}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
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

          <div
            id={PANEL_ID}
            className="mobile-filter-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Фильтры"
          >
            <div className="mobile-filter-panel__header">
              <h2>Фильтры</h2>
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