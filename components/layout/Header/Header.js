// components/layout/Header/Header.js
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthModals } from '@/components/auth/AuthModalsHost'
import { useFavorites } from '@/contexts/FavoritesContext'
import { getTopCategories } from '@/lib/api/ikea'
import MegaMenu from './MegaMenu'
import SearchBox from './SearchBox'
import PhoneDropdown from './PhoneDropdown'
import MobilePhoneDropdown from './MobilePhoneDropdown'

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
  const router = useRouter()
  const pathname = usePathname()
  const { openLogin } = useAuthModals()
  const { count } = useFavorites()

  const [menuCategories, setMenuCategories] = useState([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktopSlider, setIsDesktopSlider] = useState(false)

  // Состояние навигационных кнопок слайдера
  const [showPrev, setShowPrev] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)
  const swiperElRef = useRef(null)
  const swiperInst = useRef(null)

  useEffect(() => {
    setIsMounted(true)

    const media = window.matchMedia('(min-width: 1200px)')
    const syncDesktopState = () => setIsDesktopSlider(media.matches)

    syncDesktopState()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', syncDesktopState)
      return () => media.removeEventListener('change', syncDesktopState)
    }

    media.addListener(syncDesktopState)
    return () => media.removeListener(syncDesktopState)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMegaMenuOpen(false)
    setIsProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    getTopCategories()
      .then(res => setMenuCategories(res.data || []))
      .catch(() => { })
  }, [])

  useEffect(() => {
    function onDocClick(e) {
      if (!isProfileOpen) return
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        toggleRef.current && !toggleRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false)
      }
    }

    function onEsc(e) {
      if (e.key === 'Escape') {
        setIsProfileOpen(false)
        setIsMegaMenuOpen(false)
      }
    }

    document.addEventListener('click', onDocClick)
    window.addEventListener('keydown', onEsc)

    return () => {
      document.removeEventListener('click', onDocClick)
      window.removeEventListener('keydown', onEsc)
    }
  }, [isProfileOpen])

  // Обновляем состояние кнопок по текущей позиции слайдера
  function syncNavButtons(swiper) {
    if (!swiper) return
    setShowPrev(!swiper.isBeginning)
    setShowNext(!swiper.isEnd)
  }

  useEffect(() => {
    if (!isMounted || !isDesktopSlider || !swiperElRef.current) return

    const destroy = () => {
      if (swiperInst.current) {
        swiperInst.current.destroy(true, true)
        swiperInst.current = null
        setShowPrev(false)
        setShowNext(false)
      }
    }

    const init = () => {
      if (!window.Swiper || swiperInst.current || !swiperElRef.current) return false

      swiperInst.current = new window.Swiper(swiperElRef.current, {
        slidesPerView: 'auto',
        speed: 300,
        freeMode: true,
        watchOverflow: true,
        grabCursor: true,
        mousewheel: { forceToAxis: true },
        breakpoints: {
          1200: { spaceBetween: 8 },
          1400: { spaceBetween: 16 },
        },
        on: {
          init(swiper) { syncNavButtons(swiper) },
          slideChange(swiper) { syncNavButtons(swiper) },
          scroll(swiper) { syncNavButtons(swiper) },
          reachBeginning(swiper) { syncNavButtons(swiper) },
          reachEnd(swiper) { syncNavButtons(swiper) },
          fromEdge(swiper) { syncNavButtons(swiper) },
          setTranslate(swiper) { syncNavButtons(swiper) },
        },
      })

      syncNavButtons(swiperInst.current)
      return true
    }

    let raf = 0
    let timeoutId = 0
    let cancelled = false

    const waitForSwiper = (attempt = 0) => {
      if (cancelled) return

      if (init()) return

      if (attempt >= 50) {
        setShowPrev(false)
        setShowNext(false)
        return
      }

      timeoutId = window.setTimeout(() => {
        waitForSwiper(attempt + 1)
      }, 100)
    }

    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!swiperInst.current) return
        swiperInst.current.update()
        syncNavButtons(swiperInst.current)
      })
    }

    waitForSwiper()
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
      destroy()
    }
  }, [isMounted, isDesktopSlider])

  useEffect(() => {
    if (menuCategories.length > 0 && swiperInst.current) {
      swiperInst.current.update()
      syncNavButtons(swiperInst.current)
    }
  }, [menuCategories])

  function handleSlideNext() {
    swiperInst.current?.slideNext()
  }

  function handleSlidePrev() {
    swiperInst.current?.slidePrev()
  }

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

  function handleCatalogToggle() {
    setIsProfileOpen(false)
    setIsMegaMenuOpen((value) => !value)
  }

  function handleProfileToggle() {
    setIsMegaMenuOpen(false)
    setIsProfileOpen((value) => !value)
  }

  function handleLoginClick() {
    setIsMegaMenuOpen(false)
    setIsProfileOpen(false)
    openLogin()
  }

  function handleLogout() {
    logout()
    setIsProfileOpen(false)
    setIsMegaMenuOpen(false)
    if (pathname.startsWith('/profile')) {
      router.push('/')
    }
  }

  return (
    <header className={`header${isSticky ? ' sticky' : ''}`}>

      <div className="header-top" style={isSticky ? { display: 'none' } : {}}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-top-inner">
                <div className="header-top-menu">
                  <ul>
                    <li><a href="/about">О компании</a></li>
                    <li><a href="/help/delivery">Доставка</a></li>
                    <li><a href="/help/payment">Оплата</a></li>
                    <li><a href="/pvz">Пункты выдачи</a></li>
                    <li><a href="/partner">Сотрудничество</a></li>
                  </ul>
                </div>
                <div className="header-top-phone header-top-phone--desktop">
                  <PhoneDropdown />
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
                    <img src="/assets/img/logo.svg" alt="IKEYA — главная" />
                  </Link>

                  <div className="header-middle-phone--mobile">
                    <MobilePhoneDropdown />
                  </div>

                  <button
                    id="catalogButton"
                    className="catalog-btn"
                    type="button"
                    aria-label={isMegaMenuOpen ? 'Закрыть каталог' : 'Открыть каталог'}
                    aria-expanded={isMegaMenuOpen}
                    onClick={handleCatalogToggle}
                  >
                    {isMegaMenuOpen ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <img src="/assets/img/icons/catalog-button.svg" alt="" aria-hidden="true" />
                    )}
                    <p>Каталог</p>
                  </button>

                  <Link href="/services">Услуги</Link>
                </div>

                <SearchBox />

                <div className="header-middle-panel">
                  <div className="header-panel-item">
                    <Link href="/profile/favorite">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                        onClick={handleLoginClick}
                        aria-label="Войти в профиль"
                        style={{ background: 'transparent', border: 0, padding: 0 }}
                      >
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M18.8125 16.9125C21.1375 15.5875 22.7125 13.0875 22.7125 10.2125C22.7125 5.9625 19.25 2.5 15 2.5C10.75 2.5 7.28755 5.9625 7.28755 10.2125C7.28755 13.075 8.86255 15.575 11.1875 16.9125C7.31255 18.4375 4.55005 22.2125 4.55005 26.6375C4.55005 27.125 4.93755 27.5125 5.42505 27.5125C5.91255 27.5125 6.30005 27.125 6.30005 26.6375C6.30005 21.8375 10.2 17.9375 15 17.9375C19.8 17.9375 23.7 21.8375 23.7 26.6375C23.7 27.125 24.0875 27.5125 24.5751 27.5125C25.0625 27.5125 25.4501 27.125 25.4501 26.6375C25.4501 22.225 22.6875 18.45 18.8125 16.925V16.9125ZM9.03755 10.2125C9.03755 6.925 11.7125 4.25 15 4.25C18.2875 4.25 20.9625 6.925 20.9625 10.2125C20.9625 13.5 18.2875 16.175 15 16.175C11.7125 16.175 9.03755 13.5 9.03755 10.2125Z" fill="#181818" />
                        </svg>
                        <p>Войти</p>
                      </button>
                    </div>
                  ) : (
                    <div className="header-panel-item head-profile">
                      <button
                        ref={toggleRef}
                        type="button"
                        className="panel-item-button"
                        id="profileMenuToggle"
                        aria-label="Открыть меню профиля"
                        aria-expanded={isProfileOpen}
                        onClick={handleProfileToggle}
                      >
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M18.8125 16.9125C21.1375 15.5875 22.7125 13.0875 22.7125 10.2125C22.7125 5.9625 19.25 2.5 15 2.5C10.75 2.5 7.28755 5.9625 7.28755 10.2125C7.28755 13.075 8.86255 15.575 11.1875 16.9125C7.31255 18.4375 4.55005 22.2125 4.55005 26.6375C4.55005 27.125 4.93755 27.5125 5.42505 27.5125C5.91255 27.5125 6.30005 27.125 6.30005 26.6375C6.30005 21.8375 10.2 17.9375 15 17.9375C19.8 17.9375 23.7 21.8375 23.7 26.6375C23.7 27.125 24.0875 27.5125 24.5751 27.5125C25.0625 27.5125 25.4501 27.125 25.4501 26.6375C25.4501 22.225 22.6875 18.45 18.8125 16.925V16.9125ZM9.03755 10.2125C9.03755 6.925 11.7125 4.25 15 4.25C18.2875 4.25 20.9625 6.925 20.9625 10.2125C20.9625 13.5 18.2875 16.175 15 16.175C11.7125 16.175 9.03755 13.5 9.03755 10.2125Z" fill="#181818" />
                        </svg>
                        <p>Профиль</p>
                      </button>
                    </div>
                  )}

                  <div className="header-panel-item">
                    <Link href="/cart" aria-label={`Корзина${itemsCount > 0 ? `, ${itemsCount} товаров` : ''}`}>
                      <img src="/assets/img/icons/header-card.svg" alt="" aria-hidden="true" />
                      <p>Корзина</p>
                      {itemsCount > 0 && <span className="cart-count">{itemsCount}</span>}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.5901 22C20.5901 18.13 16.7402 15 12.0002 15C7.26015 15 3.41016 18.13 3.41016 22" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="profile-header__info">
                  <h6 className="profile-name">{user?.first_name || user?.username || 'Профиль'}</h6>
                  <Link href="/profile/personal-data/" className="profile-details-link" onClick={() => setIsProfileOpen(false)}>
                    Личные данные
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M5.94 13.28L10.2867 8.93333C10.8 8.42 10.8 7.58 10.2867 7.06667L5.94 2.72" stroke="#0058A3" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="profile-divider" />

              <nav className="profile-menu">
                <Link href="/profile/orders/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M7.26668 13.6833H12.5333C16.575 13.6833 17.15 10.85 17.75 7.84167C17.9584 6.79167 18.075 6.21667 17.7084 5.70001C17.3084 5.15001 16.6834 5.15001 15.7333 5.15001H5.82502L5.43335 3.27501C5.19168 2.32501 4.34168 1.65834 3.36668 1.65834H2.64168C2.31668 1.65834 2.05835 1.91667 2.05835 2.24167C2.05835 2.56667 2.31668 2.82501 2.64168 2.82501H3.36668C3.80835 2.82501 4.20002 3.12501 4.30002 3.54167L6.23335 12.7583C5.37502 13.1667 4.76668 14.0583 4.76668 15.1C4.76668 15.6083 5.16668 16.0167 5.66668 16.0167H7.20002C7.13335 16.2 7.09168 16.3917 7.09168 16.6C7.09168 17.5583 7.87502 18.3417 8.83335 18.3417C9.79168 18.3417 10.575 17.5583 10.575 16.6C10.575 16.3917 10.5333 16.2 10.4667 16.0167H12.6167C12.55 16.2 12.5084 16.3917 12.5084 16.6C12.5084 17.5583 13.2917 18.3417 14.25 18.3417C15.2084 18.3417 15.9917 17.5583 15.9917 16.6C15.9917 15.6417 15.2084 14.8583 14.25 14.8583H5.95002C6.05835 14.2 6.60835 13.6917 7.25835 13.6917L7.26668 13.6833ZM9.42502 16.5917C9.42502 16.9083 9.16668 17.175 8.84168 17.175C8.51668 17.175 8.25835 16.9167 8.25835 16.5917C8.25835 16.2667 8.51668 16.0083 8.84168 16.0083C9.16668 16.0083 9.42502 16.2667 9.42502 16.5917ZM14.2667 17.175C13.95 17.175 13.6833 16.9167 13.6833 16.5917C13.6833 16.2667 13.9417 16.0083 14.2667 16.0083C14.5917 16.0083 14.85 16.2667 14.85 16.5917C14.85 16.9167 14.5917 17.175 14.2667 17.175ZM15.7333 6.32501C16.175 6.32501 16.6667 6.32501 16.7667 6.39167C16.8417 6.49167 16.7167 7.09167 16.6084 7.61667C15.9417 10.9333 15.4917 12.525 12.5333 12.525H7.37502L6.07502 6.32501H15.7417H15.7333Z" fill="#181818" />
                  </svg>
                  <span className="menu-item-text">Заказы</span>
                </Link>
                <Link href="/profile/favorite/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9.99996 17.175C9.44996 17.175 8.89163 17 8.41663 16.6417C6.38329 15.125 1.66663 11.1917 1.66663 7.43333C1.66663 4.85 3.62496 2.825 6.12496 2.825C7.50829 2.825 8.69163 3.34166 9.99996 4.54166C11.3083 3.34166 12.4916 2.825 13.875 2.825C16.375 2.825 18.3333 4.85 18.3333 7.43333C18.3333 11.1833 13.6083 15.1167 11.5833 16.6417C11.1083 16.9917 10.5583 17.175 9.99996 17.175ZM6.12496 3.99166C4.24996 3.99166 2.83329 5.475 2.83329 7.43333C2.83329 10.75 7.64163 14.6 9.11663 15.7083C9.64163 16.1 10.3583 16.1 10.8833 15.7083C12.3583 14.6083 17.1666 10.75 17.1666 7.43333C17.1666 5.46666 15.75 3.99166 13.875 3.99166C12.9916 3.99166 11.9666 4.20833 10.4083 5.75833C10.1833 5.98333 9.81663 5.98333 9.58329 5.75833C8.03329 4.20833 6.99996 3.99166 6.11663 3.99166H6.12496Z" fill="#181818" />
                  </svg>
                  <span className="menu-item-text">Избранное</span>
                </Link>
                <Link href="/profile/reviews/" className="profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M14.3916 18.3333C13.975 18.3333 13.45 18.2 12.7916 17.8083L10.475 16.425C10.2416 16.2833 9.77495 16.2833 9.53329 16.425L7.21662 17.8083C5.84995 18.625 5.04162 18.3083 4.68329 18.0417C4.31662 17.775 3.76662 17.1 4.12495 15.5333L4.67495 13.1333C4.73329 12.875 4.60829 12.45 4.42495 12.2583L2.49995 10.3167C1.79162 9.59999 1.52495 8.81666 1.74995 8.11666C1.88329 7.70833 2.29995 6.99999 3.63329 6.77499L6.10829 6.35833C6.33329 6.31666 6.67495 6.06666 6.77495 5.85833L8.14162 3.09999C8.76662 1.84166 9.58329 1.65833 10.0083 1.65833C10.4333 1.65833 11.25 1.84999 11.8666 3.09999L13.2333 5.84999C13.3416 6.06666 13.675 6.31666 13.9083 6.35833L16.3833 6.77499C17.375 6.94166 18.0416 7.41666 18.2666 8.12499C18.4 8.53333 18.475 9.35833 17.5083 10.325L15.5916 12.2583C15.4083 12.45 15.2833 12.875 15.3416 13.1417L15.8916 15.5333C16.25 17.1 15.7 17.775 15.3333 18.0417C15.15 18.175 14.8416 18.325 14.4 18.325L14.3916 18.3333Z" fill="#181818" />
                  </svg>
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

              <button className="profile-logout" id="logoutButton" onClick={handleLogout} type="button">
                Выход
              </button>
            </div>
          </div>
        )}
      </div>

      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

      {isMounted && isDesktopSlider && (
        <div className={`header-bottom${isSticky ? ' hidden' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-bottom-inner">

                {/* Кнопка назад */}
                {showPrev && (
                  <button
                    type="button"
                    className="header-bottom-nav header-bottom-nav--prev"
                    onClick={handleSlidePrev}
                    aria-label="Назад"
                  >
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                      <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}

                <div className="swiper header-bottom-swiper" ref={swiperElRef}>
                  <div className="swiper-wrapper">
                    {bottomItems.map((it) => (
                      <div className="swiper-slide header-bottom-slide" key={it.key}>
                        <Link href={it.href}>{it.label}</Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Кнопка вперёд */}
                {showNext && (
                  <button
                    type="button"
                    className="header-bottom-nav header-bottom-nav--next"
                    onClick={handleSlideNext}
                    aria-label="Вперёд"
                  >
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                      <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
        </div>
      )}

    </header>
  )
}
