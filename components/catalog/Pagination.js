export default function Pagination({ 
  currentPage = 1, 
  totalPages = 16,
  itemsPerPage = 20,
  totalItems = 320 
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <>
      <nav className="pages" role="navigation" aria-label="Pagination Navigation">
        <button 
          className={`page-number-wrapper ${currentPage === 1 ? 'active' : ''}`}
          aria-label="Page 1" 
          aria-current={currentPage === 1 ? 'page' : undefined}
        >
          <span className="text-wrapper">1</span>
        </button>
        <button className="page-number-wrapper" aria-label="Go to page 2">
          <span className="text-wrapper">2</span>
        </button>
        <button className="page-number-wrapper" aria-label="Go to page 3">
          <span className="text-wrapper">3</span>
        </button>
        <button className="page-number-wrapper" aria-label="Go to page 4">
          <span className="text-wrapper">4</span>
        </button>
        <span className="icon-button" aria-hidden="true">
          <span className="div">...</span>
        </span>
        <button className="page-number-wrapper" aria-label="Go to page 15">
          <span className="text-wrapper">15</span>
        </button>
        <button className="page-number-wrapper" aria-label="Go to page 16">
          <span className="text-wrapper">16</span>
        </button>
        <button className="arrow-right-wrapper" aria-label="Go to next page">
          <img 
            className="arrow-right" 
            src="/assets/img/catalog-modal/arrow-right.svg"
            alt="" 
          />
        </button>
      </nav>
      <p className="nav-text">{startItem} — {endItem} из {totalItems} товаров</p>
    </>
  );
}
