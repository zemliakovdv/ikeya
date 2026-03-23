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
                      onClick={e => { if (!isAuth) { e.preventDefault(); openLogin() } }}
                    >
                      <img src="/assets/img/icons/header-favorite.svg" alt="Избранное" />
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