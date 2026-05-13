'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import MegaMenu from '@/components/layout/Header/MegaMenu';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemsCount } = useCart();
  const { count: favoritesCount } = useFavorites();
  const { isAuth } = useAuth();
  const { openLogin } = useAuthModals();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleCatalogClick = () => {
    setIsCatalogOpen((current) => !current);
  };

  const handleCatalogClose = () => {
    setIsCatalogOpen(false);
  };

  const handleProfileClick = (e) => {
    if (isAuth) return;

    e.preventDefault();
    openLogin();
  };

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Нижняя мобильная навигация">
        <Link
          href="/"
          className={`mobile-bottom-nav__item${isActive('/') ? ' active' : ''}`}
          aria-label="Главная"
          onClick={handleCatalogClose}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 10.7L12 3L21 10.7V20C21 20.55 20.55 21 20 21H15.5V14.5H8.5V21H4C3.45 21 3 20.55 3 20V10.7Z"
              fill="currentColor"
            />
          </svg>
        </Link>

        <button
          type="button"
          className={`mobile-bottom-nav__item${isCatalogOpen || isActive('/catalog') ? ' active' : ''}`}
          aria-label="Каталог"
          aria-expanded={isCatalogOpen}
          onClick={handleCatalogClick}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
            <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
            <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
            <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>

        <Link
          href="/cart"
          className={`mobile-bottom-nav__item${isActive('/cart') ? ' active' : ''}`}
          aria-label={`Корзина${itemsCount > 0 ? `, ${itemsCount} товаров` : ''}`}
          onClick={handleCatalogClose}
        >
          <span className="mobile-bottom-nav__icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7.2 8.2H20.2L18.9 15.2C18.75 16.05 18 16.67 17.13 16.67H9.2L7.2 4.8H4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.3" fill="currentColor" />
              <circle cx="17" cy="20" r="1.3" fill="currentColor" />
            </svg>

            {itemsCount > 0 && (
              <span className="mobile-bottom-nav__badge">
                {itemsCount > 99 ? '99+' : itemsCount}
              </span>
            )}
          </span>
        </Link>

        <Link
          href="/profile/favorite"
          className={`mobile-bottom-nav__item${isActive('/profile/favorite') ? ' active' : ''}`}
          aria-label={`Избранное${favoritesCount > 0 ? `, ${favoritesCount} товаров` : ''}`}
          onClick={handleCatalogClose}
        >
          <span className="mobile-bottom-nav__icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 20.5C11.5 20.5 11 20.34 10.57 20.02C8.22 18.27 3 13.88 3 9.7C3 6.8 5.17 4.5 7.95 4.5C9.42 4.5 10.7 5.05 12 6.24C13.3 5.05 14.58 4.5 16.05 4.5C18.83 4.5 21 6.8 21 9.7C21 13.88 15.78 18.27 13.43 20.02C13 20.34 12.5 20.5 12 20.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>

            {favoritesCount > 0 && (
              <span className="mobile-bottom-nav__badge">
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </span>
            )}
          </span>
        </Link>

        <Link
          href="/profile"
          className={`mobile-bottom-nav__item${isActive('/profile') && !isActive('/profile/favorite') ? ' active' : ''}`}
          aria-label={isAuth ? 'Профиль' : 'Войти в профиль'}
          onClick={(e) => {
            handleCatalogClose();
            handleProfileClick(e);
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 12.2C14.2 12.2 16 10.4 16 8.2C16 6 14.2 4.2 12 4.2C9.8 4.2 8 6 8 8.2C8 10.4 9.8 12.2 12 12.2Z"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M5 20.2C5 16.9 8.13 14.2 12 14.2C15.87 14.2 19 16.9 19 20.2"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </nav>

      <div className="mobile-bottom-nav-catalog">
        <MegaMenu isOpen={isCatalogOpen} onClose={handleCatalogClose} />
      </div>
    </>
  );
}