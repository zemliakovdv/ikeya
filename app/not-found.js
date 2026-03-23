// app/not-found.js

import Link from 'next/link';
import { Suspense } from 'react';
import NotFoundRecommendations from '@/components/recommendations/NotFoundRecommendations';

export const metadata = {
  title: 'Страница не найдена | IKEYA',
};

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container">
        <div className="row">
          <div className="col-12">

            <div className="not-found__inner">
              <img
                src="/assets/img/not-found.png"
                alt="Страница не найдена"
                className="not-found__image"
              />
              <h1 className="not-found__title">По вашему запросу ничего не найдено</h1>
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

      <Suspense fallback={null}>
        <NotFoundRecommendations />
      </Suspense>
    </main>
  );
}