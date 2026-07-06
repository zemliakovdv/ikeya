'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SimilarProducts from '@/components/product/SimilarProducts';

function extractSKUFromPathname(pathname) {
  const parts = (pathname || '').split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1] || '';
  const slugParts = lastPart.split('-');
  const candidate = slugParts[slugParts.length - 1];

  return /^\d+$/.test(candidate) ? candidate : lastPart;
}

export default function ProductNotFoundContent() {
  const pathname = usePathname();
  const sku = useMemo(() => extractSKUFromPathname(pathname), [pathname]);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadState() {
      if (!sku) return;

      try {
        const res = await fetch(`/api/product-status?sku=${encodeURIComponent(sku)}`, {
          cache: 'no-store',
        });

        if (!res.ok) return;

        const payload = await res.json();
        if (!isMounted) return;

        if (payload?.code === 'product_unavailable') {
          setIsUnavailable(true);
          setSimilarProducts(Array.isArray(payload?.similar_products) ? payload.similar_products : []);
        }
      } catch {
        // Для 404-экрана молча деградируем к дефолтному состоянию.
      }
    }

    loadState();

    return () => {
      isMounted = false;
    };
  }, [sku]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="not-found__inner">
              <img
                src="/assets/img/not-found.png"
                alt={isUnavailable ? 'Товар снят с продажи' : 'Страница не найдена'}
                className="not-found__image"
              />
              <h1 className="not-found__title">
                {isUnavailable ? 'Товар снят с продажи' : 'По вашему запросу ничего не найдено'}
              </h1>
              <p className="not-found__subtitle">
                Введите другой запрос или начните с
              </p>
              <div className="not-found__actions">
                <Link href="/" className="not-found__btn not-found__btn--outline">
                  Главной страницы
                </Link>
                <Link href="/catalog" className="not-found__btn not-found__btn--primary">
                  Каталог
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUnavailable ? <SimilarProducts products={similarProducts} /> : null}
    </>
  );
}
