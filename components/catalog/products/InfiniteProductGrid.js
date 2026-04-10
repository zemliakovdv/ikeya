'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

// Относительный путь — работает и на локалке и на сервере без Mixed Content
const API_BASE_URL = '/api/v1';

const sanitize = (arr) => (arr || []).filter(p => p && p.attributes);

export default function InfiniteProductGrid({
  initialProducts,
  categoryId,
  totalPages,
  queryString = '',
  initialPage = 1,   // какую страницу сервер уже отдал
  basePath = '',     // нужен для replaceState
}) {

  const [products, setProducts] = useState(sanitize(initialProducts));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    totalPages ? (initialPage + 1) <= totalPages : (initialProducts?.length || 0) >= 20
  );

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(initialPage + 1); // следующая страница после той что уже на экране

  const observerRef = useRef(null);

  // Сбрасываем состояние при смене фильтров/категории
  useEffect(() => {
    setProducts(sanitize(initialProducts));
    pageRef.current = initialPage + 1;
    const more = totalPages ? (initialPage + 1) <= totalPages : (initialProducts?.length || 0) >= 20;
    setHasMore(more);
    hasMoreRef.current = more;
  }, [initialProducts, totalPages, initialPage]);

  // Обновляем URL при скролле — без перезагрузки страницы
  // Нужно чтобы пагинация подсвечивала актуальный номер
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

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const currentPage = pageRef.current;

    try {
      const searchParams = new URLSearchParams(queryString);
      searchParams.set('page', String(currentPage));
      searchParams.set('per_page', '20');

      // Убираем price-параметры из клиентского запроса —
      // фильтрация по цене уже делается на сервере в getCategoryProducts
      // Здесь они только мешают и могут обрезать валидные товары
      const url = categoryId
        ? `${API_BASE_URL}/categories/${categoryId}/products?${searchParams.toString()}`
        : `${API_BASE_URL}/products?${searchParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const rawProducts = sanitize(data.data || []);

      if (rawProducts.length > 0) {
        setProducts(prev => [...prev, ...rawProducts]);

        const meta = data.meta || {};
        // Бэк возвращает page или current_page — обрабатываем оба варианта
        const currentPageNum = meta.page ?? meta.current_page ?? currentPage;
        const serverTotalPages = meta.total_pages ?? Math.ceil((meta.total || 0) / 20);
        const more = currentPageNum < serverTotalPages;

        pageRef.current = currentPage + 1;
        hasMoreRef.current = more;
        setHasMore(more);

        // Обновляем URL — пользователь видит актуальную страницу
        updateUrl(currentPage);
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
  }, [categoryId, queryString, updateUrl]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={observerRef}
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