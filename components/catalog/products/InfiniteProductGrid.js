'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProductCard from './ProductCard';

const ITEMS_PER_PAGE = 20;
const API_BASE_URL = '/api/v1';

function sanitize(products) {
  return (products || []).filter((product) => product && product.attributes);
}

export default function InfiniteProductGrid({
  initialProducts = [],
  categoryId,
  totalPages,
  queryString = '',
  initialPage = 1,
  basePath = '',
  onPageChange,
}) {
  const sanitizedInitialProducts = useMemo(
    () => sanitize(initialProducts),
    [initialProducts]
  );

  const [products, setProducts] = useState(sanitizedInitialProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(
    totalPages ? initialPage < totalPages : sanitizedInitialProducts.length >= ITEMS_PER_PAGE
  );

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(initialPage + 1);
  const observerRef = useRef(null);
  const triggerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const abortRef = useRef(null);
  const requestKeyRef = useRef('');

  const requestKey = useMemo(() => {
    return `${categoryId || 'all'}-${initialPage}-${totalPages || 1}-${queryString}`;
  }, [categoryId, initialPage, totalPages, queryString]);

  useEffect(() => {
    requestKeyRef.current = requestKey;

    abortRef.current?.abort();

    setProducts(sanitizedInitialProducts);
    setCurrentPage(initialPage);

    pageRef.current = initialPage + 1;
    loadingRef.current = false;
    setLoading(false);

    const more = totalPages
      ? initialPage < totalPages
      : sanitizedInitialProducts.length >= ITEMS_PER_PAGE;

    setHasMore(more);
    hasMoreRef.current = more;
  }, [sanitizedInitialProducts, totalPages, initialPage, requestKey]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    abortRef.current?.abort();

    const controller = new AbortController();
    const activeRequestKey = requestKeyRef.current;
    const page = pageRef.current;

    abortRef.current = controller;
    loadingRef.current = true;
    setLoading(true);

    try {
      const searchParams = new URLSearchParams(queryString);
      searchParams.set('page', String(page));
      searchParams.set('per_page', String(ITEMS_PER_PAGE));

      const endpoint = categoryId
        ? `${API_BASE_URL}/categories/${categoryId}/products`
        : `${API_BASE_URL}/products`;

      const response = await fetch(`${endpoint}?${searchParams.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (controller.signal.aborted || requestKeyRef.current !== activeRequestKey) return;

      const nextProducts = sanitize(data.data || []);
      const meta = data.meta || {};

      const serverTotalPages = Number(meta.total_pages) ||
        Math.ceil((Number(meta.total) || 0) / ITEMS_PER_PAGE);

      const more = page < serverTotalPages;

      if (nextProducts.length > 0) {
        setProducts((prev) => [...prev, ...nextProducts]);
      }

      pageRef.current = page + 1;
      hasMoreRef.current = more;

      setHasMore(more);
      setCurrentPage(page);

      const params = new URLSearchParams(queryString);
      params.set('page', String(page));

      const nextUrl = params.toString()
        ? `${basePath}?${params.toString()}`
        : basePath;

      window.history.replaceState(null, '', nextUrl);
      onPageChange?.(page);
    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('Error loading more products:', error);
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      if (!controller.signal.aborted) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [categoryId, queryString, basePath, onPageChange]);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current?.();
        }
      },
      { threshold: 0, rootMargin: '200px' }
    );

    observerRef.current = observer;

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      observer.disconnect();
      abortRef.current?.abort();
    };
  }, []);

  const setTriggerRef = useCallback((node) => {
    triggerRef.current = node;

    if (!node || !observerRef.current) return;

    observerRef.current.disconnect();
    observerRef.current.observe(node);
  }, []);

  return (
    <>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={`${product.id}-${product.attributes?.sku || ''}`}
            product={product}
          />
        ))}
      </div>

      {hasMore && (
        <div
          ref={setTriggerRef}
          className="loading-trigger"
          style={{
            height: '80px',
            margin: '32px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading && <div className="page-loader__spinner" />}
        </div>
      )}
    </>
  );
}