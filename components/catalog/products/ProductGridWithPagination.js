'use client';

// components/catalog/products/ProductGridWithPagination.js

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
  currentPage: serverCurrentPage,
  totalItems,
}) {
  const [currentPage, setCurrentPage] = useState(serverCurrentPage || initialPage || 1);

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
        onPageChange={setCurrentPage}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        basePath={basePath}
        queryString={queryString}
      />
    </>
  );
}