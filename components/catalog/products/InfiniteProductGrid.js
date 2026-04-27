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
  onLoadedPagesChange, // колбэк → сообщаем родителю сколько страниц подгружено
}) {

  const [products, setProducts] = useState(sanitize(initialProducts));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    totalPages ? (initialPage + 1) <= totalPages : (initialProducts?.length || 0) >= 20
  );

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(initialPage + 1);
  const observerRef = useRef(null);   // IntersectionObserver instance
  const triggerRef = useRef(null);    // DOM-элемент триггера

  // Сброс page из URL при обновлении страницы
useEffect(() => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (params.has('page')) {
    params.delete('page');
    const qs = params.toString();
    window.location.replace(qs ? `${basePath}?${qs}` : basePath);
  }
}, []);

  // Сбрасываем состояние при смене фильтров/категории
  useEffect(() => {
    setProducts(sanitize(initialProducts));
    pageRef.current = initialPage + 1;
    const more = totalPages ? (initialPage + 1) <= totalPages : (initialProducts?.length || 0) >= 20;
    setHasMore(more);
    hasMoreRef.current = more;
    if (onLoadedPagesChange) onLoadedPagesChange(0);
  }, [initialProducts, totalPages, initialPage]);

  const updateUrl = useCallback((page) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(queryString);
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    const newUrl = qs ? `${basePath}?${qs}` : basePath;
    window.history.replaceState(null, '', newUrl);
  }, [queryString, basePath]);

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

    const MAX_SKIP_ATTEMPTS = 5;
    let attempts = 0;
    let foundProducts = [];
    let lastMeta = {};
    let lastPage = pageRef.current;

    try {
      while (attempts < MAX_SKIP_ATTEMPTS) {
        const currentPage = pageRef.current;
        const searchParams = new URLSearchParams(queryString);
        searchParams.set('page', String(currentPage));
        searchParams.set('per_page', '20');

        const url = categoryId
          ? `${API_BASE_URL}/categories/${categoryId}/products?${searchParams.toString()}`
          : `${API_BASE_URL}/products?${searchParams.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const rawProducts = sanitize(data.data || []);
        lastMeta = data.meta || {};
        lastPage = currentPage;

        const serverTotalPages = Number(lastMeta.total_pages) || Math.ceil((Number(lastMeta.total) || 0) / 20);
        const currentPageNum = Number(lastMeta.page ?? lastMeta.current_page ?? currentPage);

        pageRef.current = currentPage + 1;

        const filtered = filterByPrice(rawProducts);

        if (filtered.length > 0) {
          foundProducts = filtered;
          break;
        }

        if (currentPageNum >= serverTotalPages) {
          hasMoreRef.current = false;
          setHasMore(false);
          loadingRef.current = false;
          setLoading(false);
          return;
        }

        attempts++;
      }

      if (foundProducts.length > 0) {
        setProducts(prev => [...prev, ...foundProducts]);

        const serverTotalPages = Number(lastMeta.total_pages) || Math.ceil((Number(lastMeta.total) || 0) / 20);
        const more = pageRef.current <= serverTotalPages;

        hasMoreRef.current = more;
        setHasMore(more);
        updateUrl(lastPage);

        if (onLoadedPagesChange) {
          onLoadedPagesChange(lastPage - initialPage);
        }
      } else {
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [categoryId, queryString, updateUrl, filterByPrice, onLoadedPagesChange, initialPage]);

  // Callback ref — вызывается при каждом монтировании/размонтировании триггера.
  // Это решает проблему когда hasMore меняется и триггер пересоздаётся —
  // observer автоматически переподключается к новому DOM-элементу.
  const setTriggerRef = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    triggerRef.current = node;
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0,
        rootMargin: '200px', // грузим за 200px до появления триггера
      }
    );

    observerRef.current.observe(node);

    // Немедленная проверка — вдруг элемент уже виден при первом рендере
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight + 200) {
      loadMore();
    }
  }, [loadMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
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
            height: '100px',
            margin: '40px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {loading && <div className="page-loader__spinner" />}
        </div>
      )}

      {!hasMore && products.length > 0 && <div style={{ height: '10px' }} />}
    </>
  );
}