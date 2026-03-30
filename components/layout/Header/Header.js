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
import PhoneDropdown from './PhoneDropdown'

const FALLBACK_CATEGORIES = [
  { key: 'sofas', href: '/catalog', label: 'Диваны' },
  { key: 'armchair', href: '/catalog', label: 'Кресла' },
  { key: 'beds', href: '/catalog', label: 'Кровати' },
  { key: 'mattress', href: '/catalog', label: 'Матрасы' },
  { key: 'textile', href: '/catalog', label: 'Текстиль' },
  { key: 'light', href: '/catalog', label: 'Освещение' },
  { key: 'dishes', href: '/catalog', label: 'Посуда' },
  { key: 'kitchen', href: '/catalog', label: 'Кухонная утварь' },
]

export default function Header() {
  const { itemsCount } = useCart()
  const { isAuth, user, logout } = useAuth()
  const { openLogin } = useAuthModals()
  const { count } = useFavorites()

  const [menuCategories, setMenuCategories] = useState([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)
  const swiperElRef = useRef(null)
  const swiperInst = useRef(null)

  // ─── Sticky ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ─── Топ-категории ────────────────────────────────────────────────────────────
  useEffect(() => {
    getTopCategories()
      .then(res => setMenuCategories(res.data || []))
      .catch(() => { })
  }, [])

  // ─── Закрытие дропдауна профиля ──────────────────────────────────────────────
  useEffect(() => {
    function onDocClick(e) {
      if (!isProfileOpen) return
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        toggleRef.current && !toggleRef.current.contains(e.target)
      ) setIsProfileOpen(false)
    }
    function onEsc(e) { if (e.key === 'Escape') setIsProfileOpen(false) }
    document.addEventListener('click', onDocClick)
    window.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      window.removeEventListener('keydown', onEsc)
    }
  }, [isProfileOpen])

  // ─── Swiper инициализация ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!swiperElRef.current) return

    const init = () => {
      if (!window.Swiper || swiperInst.current) return
      swiperInst.current = new window.Swiper(swiperElRef.current, {
        slidesPerView: 'auto',
        spaceBetween: 8,
        speed: 300,
        freeMode: true,
        watchOverflow: true,
        grabCursor: true,        // ← курсор-рука при наведении
        mousewheel: {            // ← скролл колёсиком
          forceToAxis: true,
        },
      })
    }

    if (window.Swiper) {
      init()
    } else {
      window.addEventListener('swiper-ready', init, { once: true })
    }

    return () => {
      window.removeEventListener('swiper-ready', init)
      if (swiperInst.current) {
        swiperInst.current.destroy(true, true)
        swiperInst.current = null
      }
    }
  }, [])

  // ─── Обновляем Swiper когда загрузились категории ────────────────────────────
  useEffect(() => {
    if (menuCategories.length > 0 && swiperInst.current) {
      swiperInst.current.update()
    }
  }, [menuCategories])

  // ─── Данные для нижней строки (макс. 8) ──────────────────────────────────────
  const bottomItems = (
    menuCategories.length > 0
      ? menuCategories.map((cat) => {
        const a = cat.attributes || {}
        return {
          key: cat.id,
          href: `/catalog/${a.slug}`,
          label: a.translated_name || a.name || 'Категория',
        }
      })
      : FALLBACK_CATEGORIES
  )

  function handleLogout() {
    logout()
    setIsProfileOpen(false)
  }

  return (
    <header className={`header${isSticky ? ' sticky' : ''}`}>

      {/* ─── Топ-бар ─────────────────────────────────────────────────────────── */}
      <div className="header-top" style={isSticky ? { display: 'none' } : {}}>
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
                  <PhoneDropdown />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Средняя часть ───────────────────────────────────────────────────── */}
      <div className="header-middle">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-middle-inner">
                <div className="header-middle-start">
                  <Link href="/" className="logo">
                    <img src="/assets/img/logo.svg" alt="Логотип" />
                  </Link>
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
                    >
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 25.7623C14.175 25.7623 13.3375 25.4998 12.625 24.9623C9.575 22.6873 2.5 16.7873 2.5 11.1498C2.5 7.2748 5.4375 4.2373 9.1875 4.2373C11.2625 4.2373 13.0375 5.0123 15 6.8123C16.9625 5.0123 18.7375 4.2373 20.8125 4.2373C24.5625 4.2373 27.5 7.2748 27.5 11.1498C27.5 16.7748 20.4125 22.6748 17.375 24.9623C16.6625 25.4873 15.8375 25.7623 15 25.7623ZM9.1875 5.9873C6.375 5.9873 4.25 8.2123 4.25 11.1498C4.25 16.1248 11.4625 21.8998 13.675 23.5623C14.4625 24.1498 15.5375 24.1498 16.325 23.5623C18.5375 21.9123 25.75 16.1248 25.75 11.1498C25.75 8.1998 23.625 5.9873 20.8125 5.9873C19.4875 5.9873 17.95 6.3123 15.6125 8.6373C15.275 8.9748 14.725 8.9748 14.375 8.6373C12.05 6.3123 10.5 5.9873 9.175 5.9873H9.1875Z" fill="#181818" />
                      </svg>
                      <p>Избранное</p>
                      {count > 0 && <span>{count}</span>}
                    </Link>
                  </div>

                  {!isAuth ? (
                    <div className="header-panel-item">
                      <button
                        type="button"
                        className="panel-item-button"
                        onClick={openLogin}
                        style={{ background: 'transparent', border: 0, padding: 0 }}
                      >
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.8125 16.9125C21.1375 15.5875 22.7125 13.0875 22.7125 10.2125C22.7125 5.9625 19.25 2.5 15 2.5C10.75 2.5 7.28755 5.9625 7.28755 10.2125C7.28755 13.075 8.86255 15.575 11.1875 16.9125C7.31255 18.4375 4.55005 22.2125 4.55005 26.6375C4.55005 27.125 4.93755 27.5125 5.42505 27.5125C5.91255 27.5125 6.30005 27.125 6.30005 26.6375C6.30005 21.8375 10.2 17.9375 15 17.9375C19.8 17.9375 23.7 21.8375 23.7 26.6375C23.7 27.125 24.0875 27.5125 24.5751 27.5125C25.0625 27.5125 25.4501 27.125 25.4501 26.6375C25.4501 22.225 22.6875 18.45 18.8125 16.925V16.9125ZM9.03755 10.2125C9.03755 6.925 11.7125 4.25 15 4.25C18.2875 4.25 20.9625 6.925 20.9625 10.2125C20.9625 13.5 18.2875 16.175 15 16.175C11.7125 16.175 9.03755 13.5 9.03755 10.2125Z" fill="#181818" />
                        </svg>
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
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.8125 16.9125C21.1375 15.5875 22.7125 13.0875 22.7125 10.2125C22.7125 5.9625 19.25 2.5 15 2.5C10.75 2.5 7.28755 5.9625 7.28755 10.2125C7.28755 13.075 8.86255 15.575 11.1875 16.9125C7.31255 18.4375 4.55005 22.2125 4.55005 26.6375C4.55005 27.125 4.93755 27.5125 5.42505 27.5125C5.91255 27.5125 6.30005 27.125 6.30005 26.6375C6.30005 21.8375 10.2 17.9375 15 17.9375C19.8 17.9375 23.7 21.8375 23.7 26.6375C23.7 27.125 24.0875 27.5125 24.5751 27.5125C25.0625 27.5125 25.4501 27.125 25.4501 26.6375C25.4501 22.225 22.6875 18.45 18.8125 16.925V16.9125ZM9.03755 10.2125C9.03755 6.925 11.7125 4.25 15 4.25C18.2875 4.25 20.9625 6.925 20.9625 10.2125C20.9625 13.5 18.2875 16.175 15 16.175C11.7125 16.175 9.03755 13.5 9.03755 10.2125Z" fill="#181818" />
                        </svg>
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

        {/* Дропдаун профиля */}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.5901 22C20.5901 18.13 16.7402 15 12.0002 15C7.26015 15 3.41016 18.13 3.41016 22" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="profile-header__info">
                  <h6 className="profile-name">{user?.username || 'Профиль'}</h6>
                  <Link href="/profile/personal-data/" className="profile-details-link" onClick={() => setIsProfileOpen(false)}>
                    Личные данные
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M5.94 13.28L10.2867 8.93333C10.8 8.42 10.8 7.58 10.2867 7.06667L5.94 2.72" stroke="#0058A3" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="profile-divider" />

              <nav className="profile-menu">
                <Link href="/profile/orders/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <span className="menu-item-text">Заказы</span>
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

      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

      {/* ─── Нижняя строка с категориями ─────────────────────────────────────── */}
      <div className={`header-bottom${isSticky ? ' hidden' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-bottom-inner">
                <div className="swiper header-bottom-swiper" ref={swiperElRef}>
                  <div className="swiper-wrapper">
                    {bottomItems.map((it) => (
                      <div className="swiper-slide header-bottom-slide" key={it.key}>
                        <Link href={it.href}>{it.label}</Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </header>
  )
}