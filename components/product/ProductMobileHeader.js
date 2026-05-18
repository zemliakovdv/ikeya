'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/contexts/FavoritesContext';

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18L9 12L15 6"
        stroke="#181818"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 25 22" fill="none">
      {active ? (
        <path
          d="M12.5 21.525C11.675 21.525 10.8375 21.2625 10.125 20.725C7.075 18.45 0 12.55 0 6.9125C0 3.0375 2.9375 0 6.6875 0C8.7625 0 10.5375 0.775 12.5 2.575C14.4625 0.775 16.2375 0 18.3125 0C22.0625 0 25 3.0375 25 6.9125C25 12.5375 17.9125 18.4375 14.875 20.725C14.1625 21.25 13.3375 21.525 12.5 21.525Z"
          fill="#CE0061"
        />
      ) : (
        <path
          d="M12.5 21.525C11.675 21.525 10.8375 21.2625 10.125 20.725C7.075 18.45 0 12.55 0 6.9125C0 3.0375 2.9375 0 6.6875 0C8.7625 0 10.5375 0.775 12.5 2.575C14.4625 0.775 16.2375 0 18.3125 0C22.0625 0 25 3.0375 25 6.9125C25 12.5375 17.9125 18.4375 14.875 20.725C14.1625 21.25 13.3375 21.525 12.5 21.525ZM6.6875 1.75C3.875 1.75 1.75 3.975 1.75 6.9125C1.75 11.8875 8.9625 17.6625 11.175 19.325C11.9625 19.9125 13.0375 19.9125 13.825 19.325C16.0375 17.675 23.25 11.8875 23.25 6.9125C23.25 3.9625 21.125 1.75 18.3125 1.75C16.9875 1.75 15.45 2.075 13.1125 4.4C12.775 4.7375 12.225 4.7375 11.875 4.4C9.55 2.075 8 1.75 6.675 1.75H6.6875Z"
          fill="#181818"
        />
      )}
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08259 9.03799C7.54303 8.39997 6.73684 8 5.83333 8C4.177 8 2.83333 9.34315 2.83333 11C2.83333 12.6569 4.177 14 5.83333 14C6.73684 14 7.54303 13.6 8.08259 12.962L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0965 14 16.2903 14.4 15.7507 15.038L8.81063 11.3706C8.82562 11.2492 8.83333 11.1255 8.83333 11C8.83333 10.8745 8.82562 10.7508 8.81063 10.6294L15.7507 6.96201C16.2903 7.60003 17.0965 8 18 8Z"
        stroke="#181818"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductMobileHeader({ product }) {
  const router = useRouter();
  const { isFavorite, add, remove } = useFavorites();

  const attr = product?.attributes || {};
  const sku = attr.sku || product?.id;

  const title = useMemo(() => {
    return attr.small_desc_name || attr.name_ru || attr.name || 'Товар';
  }, [attr.small_desc_name, attr.name_ru, attr.name]);

  const shortTitle = useMemo(() => {
    if (!title) return 'Товар';
    return title.length > 34 ? `${title.slice(0, 34).trim()}…` : title;
  }, [title]);

  const isLiked = sku ? isFavorite(sku) : false;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleFavorite = useCallback(async () => {
    if (!sku) return;

    try {
      if (isLiked) {
        await remove(sku);
      } else {
        await add(sku);
      }
    } catch (error) {
      console.error('Ошибка избранного:', error);
    }
  }, [sku, isLiked, add, remove]);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const shareData = {
      title,
      text: title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error('Ошибка шаринга:', error);
    }
  }, [title]);

  return (
    <div className="product-mobile-header">
      <button
        className="product-mobile-header__back"
        type="button"
        onClick={handleBack}
        aria-label="Назад"
      >
        <BackIcon />
      </button>

      <p className="product-mobile-header__title">{shortTitle}</p>

      <div className="product-mobile-header__actions">
        <button
          className="product-mobile-header__action"
          type="button"
          onClick={handleFavorite}
          aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <HeartIcon active={isLiked} />
        </button>

        <button
          className="product-mobile-header__action"
          type="button"
          onClick={handleShare}
          aria-label="Поделиться"
        >
          <ShareIcon />
        </button>
      </div>
    </div>
  );
}