'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import PageLoader from '@/components/ui/PageLoader';

const FALLBACK_TIMEOUT_MS = 15000;

function isModifiedEvent(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isCatalogPath(pathname) {
  return pathname === '/catalog' || pathname.startsWith('/catalog/');
}

function isProductPath(pathname) {
  return pathname.startsWith('/product/');
}

function getRouteType(pathname) {
  if (isCatalogPath(pathname)) return 'catalog';
  if (isProductPath(pathname)) return 'product';
  return null;
}

export default function CatalogRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [routeType, setRouteType] = useState(null);
  const timeoutRef = useRef(null);

  const currentSearch = useMemo(() => {
    const query = searchParams?.toString() || '';
    return query ? `?${query}` : '';
  }, [searchParams]);

  useEffect(() => {
    setIsVisible(false);
    setRouteType(null);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, currentSearch]);

  useEffect(() => {
    function clearFallback() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function showLoader(nextRouteType) {
      clearFallback();
      setRouteType(nextRouteType);
      setIsVisible(true);
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setRouteType(null);
        timeoutRef.current = null;
      }, FALLBACK_TIMEOUT_MS);
    }

    function handleDocumentClick(event) {
      if (event.defaultPrevented) return;
      if (!(event.target instanceof Element)) return;
      if (event.button !== 0) return;
      if (isModifiedEvent(event)) return;

      const anchor = event.target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      let nextUrl;
      try {
        nextUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (nextUrl.origin !== window.location.origin) return;
      const nextRouteType = getRouteType(nextUrl.pathname);
      if (!nextRouteType) return;

      const currentUrl = new URL(window.location.href);

      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search
      ) {
        return;
      }

      showLoader(nextRouteType);
    }

    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      clearFallback();
    };
  }, []);

  if (!isVisible) return null;

  const message = routeType === 'product'
    ? 'Загружаем товар...'
    : 'Загружаем товары...';

  return (
    <div className="route-page-loader">
      <PageLoader message={message} />
    </div>
  );
}
