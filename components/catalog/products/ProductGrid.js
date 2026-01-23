'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], totalProducts = 320 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  const sortOptions = {
    popular: 'Популярные',
    newest: 'Новинки',
    'price-asc': 'Дешевле',
    'price-desc': 'Дороже'
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1, 2, 3, 4);
    pages.push('...');
    pages.push(totalPages - 1, totalPages);
    
    return pages;
  };

  return (
    <div className="all-catalog-cards">
      <div className="all-catalog-sort">
        <div className="catalog-sort">
          <div 
            className="catalog-sort__selected"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <span className="catalog-sort__current">{sortOptions[sortOption]}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z" fill="#757575" />
            </svg>
          </div>

          {isSortOpen && (
            <ul className="catalog-sort__dropdown">
              {Object.entries(sortOptions).map(([key, label]) => (
                <li 
                  key={key}
                  className={`catalog-sort__option ${sortOption === key ? 'active' : ''}`}
                  data-sort={key}
                  onClick={() => {
                    setSortOption(key);
                    setIsSortOpen(false);
                  }}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="all-catalog-cheaps">
        {/* Место для чипов активных фильтров */}
      </div>

      <div className="all-catalog-items">
        {products.map((product, index) => (
          <ProductCard key={product.id || index} product={product} index={index} />
        ))}
      </div>

      <nav className="pages" role="navigation" aria-label="Pagination Navigation">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="icon-button" aria-hidden="true">
              <span className="div">...</span>
            </span>
          ) : (
            <button
              key={page}
              className={`page-number-wrapper ${page === currentPage ? 'active' : ''}`}
              aria-label={page === currentPage ? `Page ${page}` : `Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => handlePageChange(page)}
            >
              <span className="text-wrapper">{page}</span>
            </button>
          )
        ))}
        
        {currentPage < totalPages && (
          <button 
            className="arrow-right-wrapper" 
            aria-label="Go to next page"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <img className="arrow-right" src="/assets/img/catalog-modal/arrow-right.svg" alt="" />
          </button>
        )}
      </nav>

      <p className="nav-text">{startItem} — {endItem} из {totalProducts} товаров</p>
    </div>
  );
}
