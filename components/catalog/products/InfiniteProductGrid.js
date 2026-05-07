'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

const API_BASE_URL = '/api/v1';

const sanitize = (arr) => (arr || []).filter(p => p && p.attributes);

export default function InfiniteProductGrid({
  initialProducts,
  categoryId,
  totalPages,
  queryString = '',
  initialPage = 1,
  basePath = '',
  onPageChange, // колбэк → сообщаем родителю текущую страницу
}) {
  const [products, setProducts] = useState(sanitize(initialProducts));
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(
    totalPages ? initialPage < totalPages : (initialProducts?.length || 0) >= 20
  );

  // Refs — не вызывают ре-рендер
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(initialPage + 1);
  const observerRef = useRef(null);
  const triggerRef = useRef(null);
  const loadMoreRef = useRef(null); // актуальная функция loadMore

  // Сбрасываем состояние при смене фильтров/категории/страницы
  useEffect(() => {
    setProducts(sanitize(initialProducts));
    setCurrentPage(initialPage);
    pageRef.current = initialPage + 1;
    const more = totalPages ? initialPage < totalPages : (initialProducts?.length || 0) >= 20;
    setHasMore(more);
    hasMoreRef.current = more;
  }, [initialProducts, totalPages, initialPage]);

  const filterByPrice = useCallback((items) => {
    const params = new URLSearchParams(queryString);
    const hasMin = params.has('min_price');
    const hasMax = params.has('max_price');
    if (!hasMin && !hasMax) return items;

    const minPrice = hasMin ? parseFloat(params.get('min_price')) : 0;
    const maxPrice = hasMax ? parseFloat(params.get('max_price')) : Infinity;

    return items.filter(item => {
      const price = parseFloat(
        String(item.attributes?.price_byn || item.attributes?.price || '0').replace(/\s/g, '')
      );
      if (price <= 0) return false;
      if (hasMin && price < minPrice) return false;
      if (hasMax && price > maxPrice) return false;
      return true;
    });
  }, [queryString]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const page = pageRef.current;

    try {
      const searchParams = new URLSearchParams(queryString);
      searchParams.set('page', String(page));
      searchParams.set('per_page', '20');

      const url = categoryId
        ? `${API_BASE_URL}/categories/${categoryId}/products?${searchParams.toString()}`
        : `${API_BASE_URL}/products?${searchParams.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const rawProducts = sanitize(data.data || []);
      const meta = data.meta || {};

      const filtered = filterByPrice(rawProducts);
      const serverTotalPages = Number(meta.total_pages) || Math.ceil((Number(meta.total) || 0) / 20);
      const more = page < serverTotalPages;

      if (filtered.length > 0) {
        setProducts(prev => [...prev, ...filtered]);
      }

      pageRef.current = page + 1;
      hasMoreRef.current = more;
      setHasMore(more);
      setCurrentPage(page);

      // Обновляем URL и уведомляем родителя
      const params = new URLSearchParams(queryString);
      params.set('page', String(page));
      const newUrl = `${basePath}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
      onPageChange?.(page);

    } catch (error) {
      console.error('Error loading more products:', error);
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [categoryId, queryString, basePath, filterByPrice, onPageChange]);

  // Всегда держим актуальную версию loadMore в ref
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // Observer создаётся один раз, использует loadMoreRef
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

    return () => observer.disconnect();
  }, []); // создаётся один раз

  // Переподключаем observer к триггеру когда hasMore меняется
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
          <ProductCard key={product.id} product={product} />
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