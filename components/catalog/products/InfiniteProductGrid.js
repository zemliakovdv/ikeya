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
  const pageRef = useRef(initialPage + 1);

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

  // Клиентская фильтрация по цене.
  // Нужна потому что бэк игнорирует min_price/max_price — это known_issue.
  // При сортировке "expensive" бэк отдаёт дорогие товары первыми,
  // и страницы могут быть полностью пустыми после фильтрации.
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

    // Максимум попыток пропустить пустые страницы при активном фильтре цены.
    // Например при сортировке "expensive" + фильтр до 100 BYN —
    // бэк отдаёт дорогие товары, фронт их режет, страница пустая.
    // Пробуем следующие страницы пока не найдём товары или не закончатся попытки.
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

        // Двигаем указатель вперёд до применения фильтра
        pageRef.current = currentPage + 1;

        // Применяем клиентскую фильтрацию по цене
        const filtered = filterByPrice(rawProducts);

        if (filtered.length > 0) {
          foundProducts = filtered;
          break;
        }

        // Страница пустая после фильтрации — проверяем есть ли ещё страницы
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
      } else {
        // Исчерпали MAX_SKIP_ATTEMPTS — товары в диапазоне закончились
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
  }, [categoryId, queryString, updateUrl, filterByPrice]);

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