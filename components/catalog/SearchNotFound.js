// components/catalog/SearchNotFound.js
'use client';

import Link from 'next/link';

export default function SearchNotFound({ query }) {
  return (
    <div className="search-not-found">
      <div className="search-not-found__image">
        <img
          src="/assets/img/icons/search-empty.svg"
          alt="Ничего не найдено"
        />
      </div>
      <p className="search-not-found__title">
        По вашему запросу ничего не найдено
      </p>
      <p className="search-not-found__text">
        Введите другой запрос или начните с{' '}
        <Link href="/" className="search-not-found__link">
          Главной страницы
        </Link>
      </p>
    </div>
  );
}