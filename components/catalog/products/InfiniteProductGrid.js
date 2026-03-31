'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

const sanitize = (arr) => (arr || []).filter(p => p && p.attributes);

export default function InfiniteProductGrid({ initialProducts, categoryId, totalPages, queryString = '' }) {

  const [products, setProducts] = useState(sanitize(initialProducts));
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages ? 2 <= totalPages : (initialProducts?.length || 0) >= 20);

  // Рефы для актуальных значений внутри колбэка observer — без них замыкание устаревает
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(2);

  useEffect(() => {
    setProducts(sanitize(initialProducts));
    setPage(2);
    pageRef.current = 2;
    const more = totalPages ? 2 <= totalPages : (initialProducts?.length || 0) >= 20;
    setHasMore(more);
    hasMoreRef.current = more;
  }, [initialProducts, totalPages]);

  const observerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const currentPage = pageRef.current;

    try {
      const url = categoryId
        ? `/api/categories/${categoryId}/products?${queryString}&page=${currentPage}&per_page=20`
        : `/api/products?page=${currentPage}&per_page=20`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        setProducts(prev => [...prev, ...sanitize(data.products)]);
        pageRef.current = currentPage + 1;
        setPage(pageRef.current);

        const more = data.meta?.current_page < data.meta?.total_pages;
        hasMoreRef.current = more;
        setHasMore(more);
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
  }, [categoryId, queryString]); // ← только стабильные deps, без loading/hasMore/page

  // Observer создаётся один раз — читает актуальное состояние через рефы
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
  }, [loadMore]); // loadMore теперь стабилен — не пересоздаётся

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
          {loading && <div className="loader">⏳ Загрузка...</div>}
        </div>
      )}

      {!hasMore && products.length > 0 && <div style={{ height: '10px' }} />}
    </>
  );
}