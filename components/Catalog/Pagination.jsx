// components/Catalog/Pagination.jsx
export default function Pagination({ 
    currentPage = 1, 
    totalPages = 16,
    show = true 
}) {
    if (!show) return null;

    const pages = [];
    
    // Первые 4 страницы
    for (let i = 1; i <= Math.min(4, totalPages); i++) {
        pages.push(i);
    }

    // Многоточие
    if (totalPages > 6) {
        pages.push('...');
    }

    // Последние 2 страницы
    if (totalPages > 4) {
        pages.push(totalPages - 1);
        pages.push(totalPages);
    }

    return (
        <>
            <nav className="pages" role="navigation" aria-label="Pagination Navigation">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={index} className="icon-button" aria-hidden="true">
                                <span className="div...">...</span>
                            </span>
                        );
                    }

                    const isActive = page === currentPage;
                    return (
                        <button
                            key={index}
                            className="page-number-wrapper"
                            aria-label={isActive ? `Page ${page}` : `Go to page ${page}`}
                            aria-current={isActive ? 'page' : undefined}
                            {...(isActive && { className: 'page-number-wrapper active' })}
                        >
                            <span className="text-wrapper">{page}</span>
                        </button>
                    );
                })}

                <button 
                    className="arrow-right-wrapper" 
                    aria-label="Go to next page"
                >
                    <img 
                        className="arrow-right" 
                        src="/assets/img/catalog-modal/arrow-right.svg" 
                        alt="" 
                    />
                </button>
            </nav>
            <p className="nav-text">1 — 20 из 320 товаров</p>
        </>
    );
}
