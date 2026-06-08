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

export default function CatalogRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const currentSearch = useMemo(() => {
    const query = searchParams?.toString() || '';
    return query ? `?${query}` : '';
  }, [searchParams]);

  useEffect(() => {
    setIsVisible(false);

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

    function showLoader() {
      clearFallback();
      setIsVisible(true);
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
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
      if (!isCatalogPath(nextUrl.pathname)) return;

      const currentUrl = new URL(window.location.href);

      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search
      ) {
        return;
      }

      showLoader();
    }

    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      clearFallback();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="route-page-loader">
      <PageLoader message="Загружаем товары..." />
    </div>
  );
}
