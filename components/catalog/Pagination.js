// components/catalog/Pagination.js
'use client';

import { useCallback } from 'react';

export default function Pagination({ currentPage = 1, totalPages = 16, totalItems = 320, itemsPerPage = 20 }) {
  const handlePageChange = useCallback((page) => {
    // TODO: Логика смены страницы (router.push с query params)
    console.log('Go to page:', page);
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  // Генерируем массив видимых страниц
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      <nav className="pages" role="navigation" aria-label="Pagination Navigation">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="icon-button" aria-hidden="true">
                <span className="div">...</span>
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`page-number-wrapper ${currentPage === page ? 'active' : ''}`}
              aria-label={currentPage === page ? `Page ${page}` : `Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={() => handlePageChange(page)}
            >
              <span className="text-wrapper">{page}</span>
            </button>
          );
        })}

        {currentPage < totalPages && (
          <button
            className="arrow-right-wrapper"
            aria-label="Go to next page"
            onClick={handleNextPage}
          >
            <img className="arrow-right" src="/assets/img/catalog-modal/arrow-right.svg" alt="" />
          </button>
        )}
      </nav>

      <p className="nav-text">
        {startItem} — {endItem} из {totalItems}
      </p>
    </>
  );
}
