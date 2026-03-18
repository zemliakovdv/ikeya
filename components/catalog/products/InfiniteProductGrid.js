'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

const sanitize = (arr) => (arr || []).filter(p => p && p.attributes);

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export default function InfiniteProductGrid({ initialProducts, categoryId, totalPages, queryString = '' }) {

  const [products, setProducts] = useState(sanitize(initialProducts));
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages ? 2 <= totalPages : (initialProducts?.length || 0) >= 20);

  // Сбрасываем state когда меняются initialProducts (новый фильтр/сортировка)
  useEffect(() => {
    setProducts(sanitize(initialProducts));
    setPage(2);
    setHasMore(totalPages ? 2 <= totalPages : (initialProducts?.length || 0) >= 20);
  }, [initialProducts, totalPages]);
  const observerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const url = categoryId
        ? `/api/categories/${categoryId}/products?${queryString}&page=${page}&per_page=20`
        : `/api/products?page=${page}&per_page=20`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        setProducts(prev => [...prev, ...sanitize(data.products)]);
        setPage(prev => prev + 1);

        if (data.meta?.current_page >= data.meta?.total_pages) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('❌ Error loading more products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, categoryId, page, queryString]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

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