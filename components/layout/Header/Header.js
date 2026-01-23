'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="header">

      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-top-inner">
                <div className="header-top-menu">
                  <ul>
                    <li><Link href="#">О компании</Link></li>
                    <li><Link href="#">Доставка</Link></li>
                    <li><Link href="#">Оплата</Link></li>
                    <li><Link href="/pvz">Пункты выдачи</Link></li>
                    <li><Link href="#">Сотрудничество</Link></li>
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
                  <Link href="#">Услуги</Link>
                </div>
                <div className="header-middle-search">
                  <div className="middle-searh-inner">
                    <input type="search" placeholder="Поиск по названию, артикулу" id="search-form" />
                    <button type="submit" className="search-but">
                      <img src="/assets/img/icons/header-search.svg" alt="Поиск" />
                    </button>
                  </div>
                </div>
                <div className="header-middle-panel">
                  <div className="header-panel-item">
                    <Link href="/account/favorites">
                      <img src="/assets/img/icons/header-favorite.svg" alt="Избранное" />
                      <p>Избранное</p>
                      <span>0</span>
                    </Link>
                  </div>
                  <div className="header-panel-item">
                    <a href="panel-item-button" data-bs-toggle="modal" data-bs-target="#loginModal">
                      <img src="/assets/img/icons/header-profile.svg" alt="Профиль" />
                      <p>Войти</p>
                      <span>0</span>
                    </a>
                  </div>
                  <div className="header-panel-item">
                    <Link href="/cart">
                      <img src="/assets/img/icons/header-card.svg" alt="Корзина" />
                      <p>Корзина</p>
                      <span className="cart-count">0</span>
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
  )
}
