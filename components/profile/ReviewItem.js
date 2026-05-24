'use client';

import { useState, useRef, useEffect } from 'react';

import { buildAssetUrl } from '@/lib/config/api';

function parseImages(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

function getImageSrc(product) {
  const localImages = parseImages(product?.local_images);
  if (localImages.length > 0) {
    return buildAssetUrl(localImages[0]);
  }
  const images = parseImages(product?.images);
  if (images.length > 0) {
    return images[0];
  }
  return '/assets/img/placeholder.png';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function StarRating({ rating }) {
  return (
    <div className="review-item__stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.1484 25.6668C19.565 25.6668 18.83 25.4801 17.9084 24.9318L14.665 22.9951C14.3384 22.7968 13.685 22.7968 13.3467 22.9951L10.1034 24.9318C8.19003 26.0751 7.05837 25.6318 6.5567 25.2584C6.04337 24.8851 5.27337 23.9401 5.77503 21.7468L6.54503 18.3868C6.6267 18.0251 6.4517 17.4301 6.19503 17.1618L3.50003 14.4434C2.50837 13.4401 2.13503 12.3434 2.45003 11.3634C2.6367 10.7918 3.22003 9.80011 5.0867 9.48511L8.5517 8.90178C8.8667 8.84344 9.34503 8.49344 9.48503 8.20178L11.3984 4.34011C12.2734 2.57844 13.4167 2.32178 14.0117 2.32178C14.6067 2.32178 15.75 2.59011 16.6134 4.34011L18.5267 8.19011C18.6784 8.49344 19.145 8.84344 19.4717 8.90178L22.9367 9.48511C24.325 9.71844 25.2584 10.3834 25.5734 11.3751C25.76 11.9468 25.865 13.1018 24.5117 14.4551L21.8284 17.1618C21.5717 17.4301 21.3967 18.0251 21.4784 18.3984L22.2484 21.7468C22.75 23.9401 21.98 24.8851 21.4667 25.2584C21.21 25.4451 20.7784 25.6551 20.16 25.6551L20.1484 25.6668Z" fill={star <= rating ? '#FFC107' : '#E0E0E0'} />
        </svg>
      ))}
    </div>
  );
}

function StatusBadge({ status, adminNote }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (status === 'published') return null;

  const isRejected = status === 'rejected';
  const label = isRejected ? 'Отклонён' : 'На проверке';

  return (
    <div className="review-item__badge-wrapper">
      <span
        className={`review-item__badge ${isRejected ? 'review-item__badge--rejected' : 'review-item__badge--pending'}`}
        onMouseEnter={() => isRejected && setShowTooltip(true)}
        onMouseLeave={() => isRejected && setShowTooltip(false)}
        onClick={() => isRejected && setShowTooltip(v => !v)}
      >
        {label}
      </span>
      {isRejected && showTooltip && (
        <div className="review-item__tooltip">
          {adminNote || 'Отзыв не прошёл проверку, поэтому его не опубликовали'}
        </div>
      )}
    </div>
  );
}

export default function ReviewItem({ review, onDelete }) {
  const { id, attributes: a } = review;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const imageSrc = getImageSrc(a.product);
  const date = formatDate(a.created_at);

  // Закрываем меню при клике вне
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  function handleDelete() {
    setMenuOpen(false);
    onDelete(id);
  }

  return (
    <div className="review-item">
      <div className="review-item__inner">

        {/* Фото товара */}
        <div className="review-item__image">
          <img
            src={imageSrc}
            alt={a.product?.name || ''}
            width={64}
            height={64}
          />
        </div>

        {/* Основной контент */}
        <div className="review-item__content">

          {/* Бейдж статуса */}
          <StatusBadge status={a.status} adminNote={a.admin_note} />

          {/* Название товара */}
          <div className="review-item__name">{a.product?.name}</div>

          {/* Атрибуты (цвет и т.д.) — если есть */}
          {a.product?.sku && (
            <div className="review-item__attr">арт. {a.product.sku}</div>
          )}

          {/* Текст отзыва */}
          {a.body && (
            <div className="review-item__body">{a.body}</div>
          )}

          {/* Фото отзыва */}
          {a.photos?.length > 0 && (
            <div className="review-item__photos">
              {a.photos.map((photo, idx) => (
                <div key={idx} className="review-item__photo">
                  <img src={photo} alt={`Фото ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Правая колонка: звёзды, дата, меню */}
        <div className="review-item__right">
          <div className="review-item__meta">
            <StarRating rating={a.rating} />
            <span className="review-item__date">{date}</span>
          </div>

          {/* Меню ⋮ */}
          <div className="review-item__menu" ref={menuRef}>
            <button
              className="review-item__menu-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Меню отзыва"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.7203C11.05 13.7203 10.27 12.9503 10.27 12.0003C10.27 11.0503 11.04 10.2803 11.99 10.2803H12C12.95 10.2803 13.72 11.0503 13.72 12.0003C13.72 12.9503 12.95 13.7203 12 13.7203Z" fill="#757575" />
                <path d="M11.99 21.9996C11.04 21.9996 10.26 21.2296 10.26 20.2796C10.26 19.3296 11.03 18.5596 11.98 18.5596H11.99C12.94 18.5596 13.71 19.3296 13.71 20.2796C13.71 21.2296 12.94 21.9996 11.99 21.9996Z" fill="#757575" />
                <path d="M12.01 5.44977C11.06 5.44977 10.28 4.67977 10.28 3.72977C10.28 2.77977 11.05 2.00977 12 2.00977H12.01C12.96 2.00977 13.73 2.77977 13.73 3.72977C13.73 4.67977 12.96 5.44977 12.01 5.44977Z" fill="#757575" />
              </svg>
            </button>
            {menuOpen && (
              <div className="review-item__dropdown">
                <button
                  className="review-item__dropdown-item review-item__dropdown-item--danger"
                  onClick={handleDelete}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}