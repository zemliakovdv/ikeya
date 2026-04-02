'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

const sanitize = (arr) => (arr || []).filter(p => p && p.attributes);

function filterByPrice(products, searchParams) {
  const minPrice = parseFloat(searchParams.get('min_price') || '0') || 0;
  const maxPrice = parseFloat(searchParams.get('max_price') || '0') || Infinity;
  const hasMin = searchParams.get('min_price');
  const hasMax = searchParams.get('max_price');
  if (!hasMin && !hasMax) return products;
  return products.filter(item => {
    const price = parseFloat(item.attributes?.price_byn || item.attributes?.price || 0);
    if (price <= 0) return false;
    if (hasMin && price < minPrice) return false;
    if (hasMax && price > maxPrice) return false;
    return true;
  });
}

export default function InfiniteProductGrid({ initialProducts, categoryId, totalPages, queryString = '' }) {

  const [products, setProducts] = useState(sanitize(initialProducts));
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages ? 2 <= totalPages : (initialProducts?.length || 0) >= 20);

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
      const searchParams = new URLSearchParams(queryString);
      searchParams.set('page', String(currentPage));
      searchParams.set('per_page', '20');

      const url = categoryId
        ? `${API_BASE_URL}/categories/${categoryId}/products?${searchParams.toString()}`
        : `${API_BASE_URL}/products?${searchParams.toString()}`;

      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();

      const rawProducts = data.data || [];
      const filtered = filterByPrice(rawProducts, new URLSearchParams(queryString));

      if (filtered.length > 0) {
        setProducts(prev => [...prev, ...sanitize(filtered)]);
        pageRef.current = currentPage + 1;
        setPage(pageRef.current);

        const more = data.meta?.page < data.meta?.total_pages;
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
  }, [categoryId, queryString]);

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