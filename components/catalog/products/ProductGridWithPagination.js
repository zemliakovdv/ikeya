'use client';

// components/catalog/products/ProductGridWithPagination.js

import { useEffect, useMemo, useState } from 'react';
import InfiniteProductGrid from './InfiniteProductGrid';
import Pagination from '@/components/catalog/Pagination';

function toPositiveInt(value, fallback = 1) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toNonNegativeInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export default function ProductGridWithPagination({
  initialProducts,
  categoryId,
  totalPages,
  queryString = '',
  initialPage,
  basePath,
  currentPage: serverCurrentPage,
  totalItems,
}) {
  const safeInitialPage = useMemo(
    () => toPositiveInt(serverCurrentPage || initialPage, 1),
    [serverCurrentPage, initialPage]
  );

  const safeTotalPages = useMemo(
    () => toNonNegativeInt(totalPages, 0),
    [totalPages]
  );

  const safeTotalItems = useMemo(
    () => toNonNegativeInt(totalItems, 0),
    [totalItems]
  );

  const gridKey = useMemo(
    () => `${categoryId || 'all'}-${safeInitialPage}-${queryString}`,
    [categoryId, safeInitialPage, queryString]
  );

  const [currentPage, setCurrentPage] = useState(safeInitialPage);

  useEffect(() => {
    setCurrentPage(safeInitialPage);
  }, [safeInitialPage]);

  return (
    <>
      <InfiniteProductGrid
        key={gridKey}
        initialProducts={initialProducts}
        categoryId={categoryId}
        totalPages={safeTotalPages}
        queryString={queryString}
        initialPage={safeInitialPage}
        basePath={basePath}
        onPageChange={setCurrentPage}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={safeTotalPages}
        totalItems={safeTotalItems}
        basePath={basePath}
        queryString={queryString}
      />
    </>
  );
}