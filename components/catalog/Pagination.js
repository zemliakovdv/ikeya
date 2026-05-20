// components/catalog/Pagination.js

function toPositiveInt(value, fallback = 1) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toNonNegativeInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 20,
  basePath = '',
  queryString = '',
}) {
  const safeTotalPages = toNonNegativeInt(totalPages, 0);
  const safeItemsPerPage = toPositiveInt(itemsPerPage, 20);
  const safeTotalItems = toNonNegativeInt(totalItems, 0);
  const safeCurrentPage = Math.min(
    toPositiveInt(currentPage, 1),
    Math.max(safeTotalPages, 1)
  );

  const buildHref = (page) => {
    const safePage = toPositiveInt(page, 1);
    const params = new URLSearchParams(queryString);

    if (safePage === 1) {
      params.delete('page');
    } else {
      params.set('page', String(safePage));
    }

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const getVisiblePages = () => {
    const pages = [];

    if (safeTotalPages <= 5) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else if (safeCurrentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(safeTotalPages);
    } else if (safeCurrentPage >= safeTotalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = safeTotalPages - 3; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(safeCurrentPage - 1);
      pages.push(safeCurrentPage);
      pages.push(safeCurrentPage + 1);
      pages.push('...');
      pages.push(safeTotalPages);
    }

    return pages;
  };

  if (safeTotalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const startItem = (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  return (
    <>
      <nav className="pages" role="navigation" aria-label="Навигация по страницам">
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
              className={`page-number-wrapper${safeCurrentPage === page ? ' active' : ''}`}
              aria-label={safeCurrentPage === page ? `Страница ${page}` : `Перейти на страницу ${page}`}
              aria-current={safeCurrentPage === page ? 'page' : undefined}
            >
              <span className="text-wrapper">{page}</span>
            </a>
          );
        })}

        {safeCurrentPage < safeTotalPages && (
          <a
            href={buildHref(safeCurrentPage + 1)}
            className="arrow-right-wrapper"
            aria-label="Перейти на следующую страницу"
          >
            <img className="arrow-right" src="/assets/img/catalog-modal/arrow-right.svg" alt="" />
          </a>
        )}
      </nav>

      {safeTotalItems > 0 && (
        <p className="nav-text">{startItem} — {endItem} из {safeTotalItems}</p>
      )}
    </>
  );
}