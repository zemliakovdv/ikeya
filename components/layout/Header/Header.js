'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { getHeaderMenuCategories } from '@/lib/api/ikea'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthModals } from '@/components/auth/AuthModalsHost'

export default function Header() {
  const { itemsCount } = useCart();
  const { isAuth, user, logout } = useAuth();
  const { openLogin } = useAuthModals();

  const [menuCategories, setMenuCategories] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  // Загружаем категории меню при монтировании
  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await getHeaderMenuCategories();
        setMenuCategories(response.data || []);
      } catch (error) {
        console.error('Не удалось загрузить меню:', error);
      }
    }
    loadMenu();
  }, []);

  // закрытие дропдауна по клику вне
  useEffect(() => {
    function onDocClick(e) {
      if (!isProfileOpen) return;
      const t = e.target;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(t) &&
        toggleRef.current &&
        !toggleRef.current.contains(t)
      ) {
        setIsProfileOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') setIsProfileOpen(false);
    }
    document.addEventListener('click', onDocClick);
    window.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('keydown', onEsc);
    };
  }, [isProfileOpen]);

  function handleLogout() {
    logout();
    setIsProfileOpen(false);
  }

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
                    <Link href="/favorites">
                      <img src="/assets/img/icons/header-favorite.svg" alt="Избранное" />
                      <p>Избранное</p>
                      <span>0</span>
                    </Link>
                  </div>

                  {/* Профиль: Войти / Профиль */}
                  {!isAuth ? (
                    <div className="header-panel-item">
                      <button
                        type="button"
                        className="panel-item-button"
                        onClick={openLogin}
                        style={{ background: 'transparent', border: 0, padding: 0 }}
                      >
                        <img src="/assets/img/icons/header-profile.svg" alt="Профиль" />
                        <p>Войти</p>
                        <span>0</span>
                      </button>
                    </div>
                  ) : (
                    <div className="header-panel-item head-profile">
                      <button
                        ref={toggleRef}
                        type="button"
                        className="panel-item-button"
                        id="profileMenuToggle"
                        onClick={() => setIsProfileOpen((v) => !v)}
                      >
                        <img src="/assets/img/icons/header-profile.svg" alt="Профиль" />
                        <p>Профиль</p>
                      </button>
                    </div>
                  )}

                  <div className="header-panel-item">
                    <Link href="/cart">
                      <img src="/assets/img/icons/header-card.svg" alt="Корзина" />
                      <p>Корзина</p>
                      {itemsCount > 0 && <span className="cart-count">{itemsCount}</span>}
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Dropdown профиля (только когда isAuth) */}
        {isAuth && (
          <div
            ref={dropdownRef}
            className="profile-dropdown"
            id="profileDropdown"
            style={{ display: isProfileOpen ? 'block' : 'none' }}
          >
            <div className="profile-dropdown__content">
              <div className="profile-header">
                <div className="profile-header__avatar">
                  {/* SVG оставляем как в верстке */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M20.5901 22C20.5901 18.13 16.7402 15 12.0002 15C7.26015 15 3.41016 18.13 3.41016 22" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>

                <div className="profile-header__info">
                  <h6 className="profile-name">{user?.username || 'Профиль'}</h6>
                  <Link href="/profile" className="profile-details-link" onClick={() => setIsProfileOpen(false)}>
                    Личные данные
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.94 13.28L10.2867 8.93333C10.8 8.42 10.8 7.58 10.2867 7.06667L5.94 2.72" stroke="#0058A3" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="profile-divider" />

              <nav className="profile-menu">
                <Link href="/orders" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Заказы</span>
                  <span className="menu-item-badge" style={{ display: 'flex' }}>3</span>
                </Link>

                <Link href="/favorites" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Избранное</span>
                </Link>

                <Link href="/reviews" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Отзывы</span>
                </Link>
              </nav>

              <div className="profile-divider" />

              <nav className="profile-menu">
                <Link href="/receipts" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Электронные чеки</span>
                </Link>

                <Link href="/returns" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Возвраты</span>
                </Link>

                <Link href="/help" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Помощь</span>
                </Link>

                <Link href="/settings" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Персональные данные</span>
                </Link>
              </nav>

              <div className="profile-divider" />

              <button className="profile-logout" id="logoutButton" onClick={handleLogout}>
                Выход
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-bottom-inner">
                {menuCategories.length > 0 ? (
                  menuCategories.map((category) => {
                    const attrs = category.attributes;
                    const categoryUrl = `/catalog/${category.id}`;
                    const categoryName = attrs.translated_name || attrs.name;

                    return (
                      <Link
                        key={category.id}
                        href={categoryUrl}
                      >
                        {categoryName}
                      </Link>
                    );
                  })
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </header>
  )
}
