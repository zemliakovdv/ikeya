// components/catalog/Pagination.js

export default function Pagination({ currentPage = 1, totalPages = 1, totalItems = 0, itemsPerPage = 20, basePath = '', queryString = '' }) {

  console.log('Pagination props:', { currentPage, totalPages, totalItems });

  const buildHref = (page) => {
    const params = new URLSearchParams(queryString);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
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
            <a
              key={page}
              href={buildHref(page)}
              className={`page-number-wrapper${currentPage === page ? ' active' : ''}`}
              aria-label={currentPage === page ? `Page ${page}` : `Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              <span className="text-wrapper">{page}</span>
            </a>
          );
        })}

        {currentPage < totalPages && (
          <a
            href={buildHref(currentPage + 1)}
            className="arrow-right-wrapper"
            aria-label="Go to next page"
          >
            <img className="arrow-right" src="/assets/img/catalog-modal/arrow-right.svg" alt="" />
          </a>
        )}
      </nav>

      {totalItems > 0 && (
        <p className="nav-text">{startItem} — {endItem} из {totalItems}</p>
      )}
    </>
  );
}