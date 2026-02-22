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
            className={`profile-dropdown ${isProfileOpen ? 'active' : ''}`}
            id="profileDropdown"
            style={{ display: isProfileOpen ? 'block' : 'none' }}
          >
            <div className="profile-dropdown__content">

              {/* Шапка профиля */}
              <div className="profile-header">
                <div className="profile-header__avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.5901 22C20.5901 18.13 16.7402 15 12.0002 15C7.26015 15 3.41016 18.13 3.41016 22" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="profile-header__info">
                  <h6 className="profile-name">{user?.username || 'Профиль'}</h6>
                  <Link
                    href="/profile/personal-data"
                    className="profile-details-link"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Личные данные
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.94 13.28L10.2867 8.93333C10.8 8.42 10.8 7.58 10.2867 7.06667L5.94 2.72" stroke="#0058A3" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="profile-divider" />

              {/* Основное меню */}
              <nav className="profile-menu">
                <Link href="/profile/orders" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.26668 13.6833H12.5333C16.575 13.6833 17.15 10.85 17.75 7.84167C17.9584 6.79167 18.075 6.21667 17.7084 5.70001C17.3084 5.15001 16.6834 5.15001 15.7334 5.15001H5.82502L5.43335 3.27501C5.19168 2.32501 4.34168 1.65834 3.36668 1.65834H2.64168C2.31668 1.65834 2.05835 1.91667 2.05835 2.24167C2.05835 2.56667 2.31668 2.82501 2.64168 2.82501H3.36668C3.80835 2.82501 4.20002 3.12501 4.30002 3.54167L6.23335 12.7583C5.37502 13.1667 4.76668 14.0583 4.76668 15.1C4.76668 15.6083 5.16668 16.0167 5.66668 16.0167H7.20002C7.13335 16.2 7.09168 16.3917 7.09168 16.6C7.09168 17.5583 7.87502 18.3417 8.83335 18.3417C9.79168 18.3417 10.575 17.5583 10.575 16.6C10.575 16.3917 10.5334 16.2 10.4667 16.0167H12.6167C12.55 16.2 12.5084 16.3917 12.5084 16.6C12.5084 17.5583 13.2917 18.3417 14.25 18.3417C15.2084 18.3417 15.9917 17.5583 15.9917 16.6C15.9917 15.6417 15.2084 14.8583 14.25 14.8583H5.95002C6.05835 14.2 6.60835 13.6917 7.25835 13.6917L7.26668 13.6833Z" fill="#181818" />
                    </svg>
                  </span>
                  <span className="menu-item-text">Заказы</span>
                </Link>

                <Link href="/favorites" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.99996 17.175C9.44996 17.175 8.89163 17 8.41663 16.6417C6.38329 15.125 1.66663 11.1917 1.66663 7.43333C1.66663 4.85 3.62496 2.825 6.12496 2.825C7.50829 2.825 8.69163 3.34166 9.99996 4.54166C11.3083 3.34166 12.4916 2.825 13.875 2.825C16.375 2.825 18.3333 4.85 18.3333 7.43333C18.3333 11.1833 13.6083 15.1167 11.5833 16.6417C11.1083 16.9917 10.5583 17.175 9.99996 17.175Z" fill="#181818" />
                    </svg>
                  </span>
                  <span className="menu-item-text">Избранное</span>
                </Link>

                <Link href="/profile/reviews" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.3916 18.3333C13.975 18.3333 13.45 18.2 12.7916 17.8083L10.475 16.425C10.2416 16.2833 9.77495 16.2833 9.53329 16.425L7.21662 17.8083C5.84995 18.625 5.04162 18.3083 4.68329 18.0417C4.31662 17.775 3.76662 17.1 4.12495 15.5333L4.67495 13.1333C4.73329 12.875 4.60829 12.45 4.42495 12.2583L2.49995 10.3167C1.79162 9.59999 1.52495 8.81666 1.74995 8.11666C1.88329 7.70833 2.29995 6.99999 3.63329 6.77499L6.10829 6.35833C6.33329 6.31666 6.67495 6.06666 6.77495 5.85833L8.14162 3.09999C8.76662 1.84166 9.58329 1.65833 10.0083 1.65833C10.4333 1.65833 11.25 1.84999 11.8666 3.09999L13.2333 5.84999C13.3416 6.06666 13.675 6.31666 13.9083 6.35833L16.3833 6.77499C17.375 6.94166 18.0416 7.41666 18.2666 8.12499C18.4 8.53333 18.475 9.35833 17.5083 10.325L15.5916 12.2583C15.4083 12.45 15.2833 12.875 15.3416 13.1417L15.8916 15.5333C16.25 17.1 15.7 17.775 15.3333 18.0417C15.15 18.175 14.8416 18.325 14.4 18.325L14.3916 18.3333Z" fill="#181818" />
                    </svg>
                  </span>
                  <span className="menu-item-text">Отзывы</span>
                </Link>
              </nav>

              <div className="profile-divider" />

              {/* Дополнительные пункты */}
              <nav className="profile-menu">
                <Link href="/profile/receipts" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Электронные чеки</span>
                </Link>
                <Link href="/profile/returns" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Возвраты</span>
                </Link>
                <Link href="/help" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Помощь</span>
                </Link>
                <Link href="/profile/personal-data" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Персональные данные</span>
                </Link>
              </nav>

              <div className="profile-divider" />

              {/* Выход */}
              <button className="profile-logout" onClick={handleLogout}>
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
