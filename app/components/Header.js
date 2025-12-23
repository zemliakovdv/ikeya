'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // состояние авторизации
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-top-inner">
                <div className="header-top-menu">
                  <ul>
                    <li><a href="#">О компании</a></li>
                    <li><a href="#">Доставка</a></li>
                    <li><a href="#">Оплата</a></li>
                    <li><a href="#">Пункты выдачи</a></li>
                    <li><a href="#">Сотрудничество</a></li>
                  </ul>
                </div>
                <div className="header-top-phone">
                  <a href="tel:2626">
                    <img src="/assets/img/icons/header-short-phone.svg" alt="Телефон" />
                    2626
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header-middle">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-middle-inner">
                <div className="header-middle-start">
                  <Link href="/" className="logo">
                    <img src="/assets/img/logo.svg" alt="Логотип" />
                  </Link>
                  <button id="catalogButton" className="catalog-btn">
                    <img src="/assets/img/icons/catalog-button.svg" alt="Каталог" />
                    <p>Каталог</p>
                  </button>
                  <a href="#">Услуги</a>
                </div>
                <div className="header-middle-search">
                  <form onSubmit={handleSearch}>
                    <div className="middle-searh-inner">
                      <input 
                        type="search" 
                        placeholder="Поиск по названию, артикулу" 
                        id="search-form"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="search-but">
                        <img src="/assets/img/icons/header-search.svg" alt="Поиск" />
                      </button>
                    </div>
                  </form>
                </div>
                <div className="header-middle-panel">
                  <div className="header-panel-item">
                    <Link href="/favorites">
                      <img src="/assets/img/icons/header-favorite.svg" alt="Избранное" />
                      <p>Избранное</p>
                      <span>0</span>
                    </Link>
                  </div>
                  <div className="header-panel-item">
                    {isLoggedIn ? (
                      <Link href="/">
                        <img src="/assets/img/icons/header-profile.svg" alt="Профиль" />
                        <p>Профиль</p>
                        <span>0</span>
                      </Link>
                    ) : (
                      <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal">
                        <img src="/assets/img/icons/header-profile.svg" alt="Профиль" />
                        <p>Войти</p>
                        <span>0</span>
                      </a>
                    )}
                  </div>
                  <div className="header-panel-item">
                    <Link href="/cart">
                      <img src="/assets/img/icons/header-card.svg" alt="Корзина" />
                      <p>Корзина</p>
                      <span>14</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-bottom-inner">
                <Link href="/catalog">Диваны</Link>
                <Link href="/catalog">Кресла</Link>
                <Link href="/catalog">Кровати</Link>
                <Link href="/catalog">Матрасы</Link>
                <Link href="/catalog">Текстиль</Link>
                <Link href="/catalog">Освещение</Link>
                <Link href="/catalog">Посуда</Link>
                <Link href="/catalog">Кухонная утварь</Link>
                <Link href="/catalog">Украшения</Link>
                <Link href="/catalog">Системы хранения</Link>
                <Link href="/catalog">Комоды и тумбочки</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
