// components/catalog/products/InfiniteProductGrid.js
'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

export default function InfiniteProductGrid({ initialProducts, categoryId, totalPages }) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages ? page <= totalPages : initialProducts.length >= 20);
  const observerRef = useRef(null);

  // Обновляем состояние при изменении категории
  useEffect(() => {
    setProducts(initialProducts);
    setPage(2);
    setHasMore(totalPages ? 2 <= totalPages : initialProducts.length >= 20);
  }, [categoryId, initialProducts, totalPages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      // ✅ ИСПРАВЛЕНО: Разные URL для "всех товаров" и категорий
      const url = categoryId
        ? `/api/categories/${categoryId}/products?page=${page}&per_page=20`
        : `/api/products?page=${page}&per_page=20`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        setProducts(prev => [...prev, ...data.products]);
        setPage(prev => prev + 1);

        // Проверяем, есть ли еще страницы
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
  };

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

      {!hasMore && products.length > 0 && (
        <div style={{ height: '10px' }} />
      )}
    </>
  );
}