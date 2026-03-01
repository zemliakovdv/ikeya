// components/profile/Favorites.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import FavoriteProductCard from './FavoriteProductCard';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price-asc', label: 'Новинки' },
  { value: 'price-desc', label: 'Дешевле' },
  { value: 'name-asc', label: 'Дороже' },
];

function sortProducts(products, sort) {
  const arr = [...products];
  switch (sort) {
    case 'price-asc': return arr.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    case 'price-desc': return arr.sort((a, b) => a.price - b.price);
    case 'name-asc': return arr.sort((a, b) => b.price - a.price);
    default: return arr.sort((a, b) => (b.is_hit ? 1 : 0) - (a.is_hit ? 1 : 0));
  }
}

export default function Favorites() {
  const { isAuth, isHydrated } = useAuth();
  const { items: products, remove: handleRemoved, loading } = useFavorites();
  const router = useRouter();


  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState('popular');


  const sorted = useMemo(() => sortProducts(products, sortValue), [products, sortValue]);
  const currentLabel = SORT_OPTIONS.find(o => o.value === sortValue)?.label ?? 'Популярные';

  if (loading) {
    return <div className="orders-lists"><div className="profile-loading">Загружаем избранное…</div></div>;
  }

  if (products.length === 0) {
    return (
      <div className="orders-lists">
        <div className="empty">
          <div className="empty-illustration">
            <img src="/assets/img/profile/no-favorite.png" alt="" />
          </div>
          <div className="empty-title">В избранном пусто</div>
          <div className="empty-text">
            Добавляйте товары с помощью ❤️️
          </div>
          <button className="empty-btn" onClick={() => router.push('/')}>
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-lists">
      <div className="orders-shopping_wrapper">
        <div className="orders-shopping">

          {/* Сортировка */}
          <div className="all-catalog-sort">
            <div className="catalog-sort">
              <div
                className="catalog-sort__selected"
                onClick={() => setSortOpen(prev => !prev)}
              >
                <span className="catalog-sort__current">{currentLabel}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z" fill="#757575" />
                </svg>
              </div>
              {sortOpen && (
                <ul className="catalog-sort__dropdown">
                  {SORT_OPTIONS.map(opt => (
                    <li
                      key={opt.value}
                      className={`catalog-sort__option ${sortValue === opt.value ? 'active' : ''}`}
                      data-sort={opt.value}
                      onClick={() => { setSortValue(opt.value); setSortOpen(false); }}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Карточки */}
          <div className="shopping-cards">
            <div className="all-catalog-items">
              {sorted.map(item => (
                <FavoriteProductCard
                  key={item.sku}
                  product={item.product}
                  onRemoved={sku => handleRemoved(sku)}
                />
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
