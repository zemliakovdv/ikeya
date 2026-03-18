// components/layout/Header/Header.js
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthModals } from '@/components/auth/AuthModalsHost'
import { useFavorites } from '@/contexts/FavoritesContext'
import { getTopCategories } from '@/lib/api/ikea'
import MegaMenu from './MegaMenu'
import SearchBox from './SearchBox'

export default function Header() {
  const { itemsCount } = useCart()
  const { isAuth, user, logout } = useAuth()
  const { openLogin } = useAuthModals()

  const { count } = useFavorites();

  const [menuCategories, setMenuCategories] = useState([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false) // ← добавлено
  const [isSticky, setIsSticky] = useState(false)

  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)

  // Swiper for header-bottom categories (<=1200)
  const bottomSwiperElRef = useRef(null)
  const bottomSwiperInstanceRef = useRef(null)

  // Sticky header при скролле
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Загружаем топ-категории при монтировании
  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await getTopCategories()
        setMenuCategories(response.data || [])
      } catch (error) {
        console.error('Не удалось загрузить меню:', error)
      }
    }
    loadMenu()
  }, [])

  // закрытие дропдауна по клику вне
  useEffect(() => {
    function onDocClick(e) {
      if (!isProfileOpen) return
      const t = e.target
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(t) &&
        toggleRef.current &&
        !toggleRef.current.contains(t)
      ) {
        setIsProfileOpen(false)
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') setIsProfileOpen(false)
    }
    document.addEventListener('click', onDocClick)
    window.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      window.removeEventListener('keydown', onEsc)
    }
  }, [isProfileOpen])

  // Init/destroy Swiper for header-bottom on <=1200
  useEffect(() => {
    let destroyed = false

    async function ensureSwiper() {
      if (typeof window === 'undefined') return;

      const shouldEnable = window.innerWidth <= 1200;

      // ВКЛЮЧАЕМ swiper
      if (shouldEnable && !bottomSwiperInstanceRef.current && bottomSwiperElRef.current) {
        const { default: Swiper } = await import('swiper');
        const { Navigation } = await import('swiper/modules');

        // Проверяем, не был ли компонент размонтирован пока шёл импорт
        if (destroyed) return;

        const prevBtn = document.querySelector('.header-bottom-swiper-prev')
        const nextBtn = document.querySelector('.header-bottom-swiper-next')

        function updateButtons(swiper) {
          if (prevBtn) prevBtn.style.display = swiper.isBeginning ? 'none' : 'inline-flex'
          if (nextBtn) nextBtn.style.display = swiper.isEnd ? 'none' : 'inline-flex'
        }

        bottomSwiperInstanceRef.current = new Swiper(bottomSwiperElRef.current, {
          modules: [Navigation],
          slidesPerView: 'auto',
          spaceBetween: 8,
          speed: 300,
          freeMode: false,
          watchOverflow: true,
          navigation: {
            nextEl: '.header-bottom-swiper-next',
            prevEl: '.header-bottom-swiper-prev',
            disabledClass: 'is-disabled',
          },
          on: {
            init: updateButtons,
            slideChange: updateButtons,
          },
        });
      }

      // ВЫКЛЮЧАЕМ swiper (когда ширина >1200)
      if (!shouldEnable && bottomSwiperInstanceRef.current) {
        bottomSwiperInstanceRef.current.destroy(true, true);
        bottomSwiperInstanceRef.current = null;
      }
    }

    function onResize() {
      ensureSwiper()
    }

    // Инициализируем сразу при монтировании, не только при resize
    ensureSwiper()

    window.addEventListener('resize', onResize)
    return () => {
      destroyed = true
      window.removeEventListener('resize', onResize)
      if (bottomSwiperInstanceRef.current) {
        bottomSwiperInstanceRef.current.destroy(true, true)
        bottomSwiperInstanceRef.current = null
      }
    }
  }, [])

  function handleLogout() {
    logout()
    setIsProfileOpen(false)
  }

  const fallbackCategories = [
    { key: 'sofas', href: '/catalog', label: 'Диваны' },
    { key: 'armchairs', href: '/catalog', label: 'Кресла' },
    { key: 'beds', href: '/catalog', label: 'Кровати' },
    { key: 'mattresses', href: '/catalog', label: 'Матрасы' },
    { key: 'textile', href: '/catalog', label: 'Текстиль' },
    { key: 'light', href: '/catalog', label: 'Освещение' },
    { key: 'dishes', href: '/catalog', label: 'Посуда' },
    { key: 'kitchen', href: '/catalog', label: 'Кухонная утварь' },
    { key: 'decor', href: '/catalog', label: 'Украшения' },
    { key: 'storage', href: '/catalog', label: 'Системы хранения' },
    { key: 'dressers', href: '/catalog', label: 'Комоды и тумбочки' },
  ]

  const bottomItems =
    menuCategories.length > 0
      ? menuCategories.map((category) => {
        const attrs = category.attributes || {}
        return {
          key: category.id,
          href: `/catalog/${attrs.slug}`,
          label: attrs.translated_name || attrs.name || 'Категория',
        }
      })
      : fallbackCategories

  return (
    <header className={`header${isSticky ? ' sticky' : ''}`}>
      <div className="header-top" style={isSticky ? { display: 'none' } : {}}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-top-inner">
                <div className="header-top-menu">
                  <ul>
                    <li>
                      <Link href="#">О компании</Link>
                    </li>
                    <li>
                      <Link href="#">Доставка</Link>
                    </li>
                    <li>
                      <Link href="#">Оплата</Link>
                    </li>
                    <li>
                      <Link href="/pvz">Пункты выдачи</Link>
                    </li>
                    <li>
                      <Link href="#">Сотрудничество</Link>
                    </li>
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
                  {/* ← добавлен только onClick */}
                  <button
                    id="catalogButton"
                    className="catalog-btn"
                    type="button"
                    onClick={() => setIsMegaMenuOpen((v) => !v)}
                  >
                    {isMegaMenuOpen ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <img src="/assets/img/icons/catalog-button.svg" alt="Каталог" />
                    )}
                    <p>Каталог</p>
                  </button>
                  <Link href="#">Услуги</Link>
                </div>

                <SearchBox />

                <div className="header-middle-panel">
                  <div className="header-panel-item">
                    <Link
                      href="/profile/favorite"
                      onClick={e => {
                        if (!isAuth) {
                          e.preventDefault();
                          openLogin();
                        }
                      }}
                    >
                      <img src="/assets/img/icons/header-favorite.svg" alt="Избранное" />
                      <p>Избранное</p>
                      {count > 0 && <span>{count}</span>}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                      stroke="#BDBDBD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M20.5901 22C20.5901 18.13 16.7402 15 12.0002 15C7.26015 15 3.41016 18.13 3.41016 22"
                      stroke="#BDBDBD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>

                <div className="profile-header__info">
                  <h6 className="profile-name">{user?.username || 'Профиль'}</h6>
                  <Link href="/profile/personal-data/" className="profile-details-link" onClick={() => setIsProfileOpen(false)}>
                    Личные данные
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5.94 13.28L10.2867 8.93333C10.8 8.42 10.8 7.58 10.2867 7.06667L5.94 2.72"
                        stroke="#0058A3"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="profile-divider" />

              <nav className="profile-menu">
                <Link href="/profile/orders/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Заказы</span>
                  <span className="menu-item-badge" style={{ display: 'flex' }}>
                    3
                  </span>
                </Link>

                <Link href="/profile/favorite/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Избранное</span>
                </Link>

                <Link href="/profile/reviews/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Отзывы</span>
                </Link>
              </nav>

              <div className="profile-divider" />

              <nav className="profile-menu">
                <Link href="/profile/electronic-receipts/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Электронные чеки</span>
                </Link>

                <Link href="/profile/returns/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Возвраты</span>
                </Link>

                <Link href="/help" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Помощь</span>
                </Link>

                <Link href="/profile/settings/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
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

      {/* ← мегаменю рендерится здесь, между header-middle и header-bottom */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

      <div className={`header-bottom${isSticky ? ' hidden' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-bottom-inner">
                {/* Desktop links (default) */}
                <div className="header-bottom-links">
                  {bottomItems.map((it) => (
                    <Link key={it.key} href={it.href}>
                      {it.label}
                    </Link>
                  ))}
                </div>

                {/* Swiper (<=1200) */}
                <div className="header-bottom-swiper">
                  <div className="swiper" ref={bottomSwiperElRef}>
                    <div className="swiper-wrapper">
                      {bottomItems.map((it) => (
                        <div className="swiper-slide" key={it.key}>
                          <Link href={it.href}>{it.label}</Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="header-bottom-swiper-prev"
                    aria-label="Назад"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="header-bottom-swiper-next"
                    aria-label="Вперёд"
                  >
                    ›
                  </button>
                </div>
                {/* CSS в responsive.css должен скрывать/показывать header-bottom-links/swiper по ширине */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}