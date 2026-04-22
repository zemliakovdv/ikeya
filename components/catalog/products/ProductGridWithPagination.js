'use client';

// components/catalog/products/ProductGridWithPagination.js
// Клиентская обёртка — скрывает пагинацию после первой подгрузки инфинит-скроллом.
// Пагинация остаётся в DOM для SEO-роботов (display:none не мешает индексации ссылок).

import { useState } from 'react';
import InfiniteProductGrid from './InfiniteProductGrid';
import Pagination from '@/components/catalog/Pagination';

export default function ProductGridWithPagination({
  initialProducts,
  categoryId,
  totalPages,
  queryString,
  initialPage,
  basePath,
  currentPage,
  totalItems,
}) {
  const [loadedPages, setLoadedPages] = useState(0);

  return (
    <>
      <InfiniteProductGrid
        key={`${categoryId}-${initialPage}-${queryString}`}
        initialProducts={initialProducts}
        categoryId={categoryId}
        totalPages={totalPages}
        queryString={queryString}
        initialPage={initialPage}
        basePath={basePath}
        onLoadedPagesChange={setLoadedPages}
      />
      <div style={{ display: loadedPages > 0 ? 'none' : 'block' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          basePath={basePath}
          queryString={queryString}
        />
      </div>
    </>
  );
}