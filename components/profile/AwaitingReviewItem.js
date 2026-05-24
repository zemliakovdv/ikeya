'use client';

import { useState } from 'react';

import { buildAssetUrl } from '@/lib/config/api';

function parseImages(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

function getImageSrc(product) {
  const localImages = parseImages(product.local_images);
  if (localImages.length > 0) {
    return buildAssetUrl(localImages[0]);
  }
  const images = parseImages(product.images);
  if (images.length > 0) {
    return images[0];
  }
  return '/assets/img/placeholder.png';
}

function formatDeliveryDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `Доставлен ${date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;
}

export default function AwaitingReviewItem({ product, onOpenDrawer }) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const imageSrc = getImageSrc(product);

  function handleStarClick(rating) {
    onOpenDrawer({ ...product, initialRating: rating });
  }

  return (
    <div className="awaiting-review-item">
      <div className="awaiting-review-item__inner">

        {/* Фото */}
        <div className="awaiting-review-item__image">
          <img
            src={imageSrc}
            alt={product.name}
            width={80}
            height={80}
          />
        </div>

        {/* Контент */}
        <div className="awaiting-review-item__content">
          <div className="awaiting-review-item__name">{product.name}</div>

          {/* Звёзды */}
          <div className="awaiting-review-item__stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`awaiting-review-item__star ${hoveredStar >= star ? 'awaiting-review-item__star--active' : ''}`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleStarClick(star)}
                aria-label={`Оценить на ${star}`}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.1484 25.6668C19.565 25.6668 18.83 25.4801 17.9084 24.9318L14.665 22.9951C14.3384 22.7968 13.685 22.7968 13.3467 22.9951L10.1034 24.9318C8.19003 26.0751 7.05837 25.6318 6.5567 25.2584C6.04337 24.8851 5.27337 23.9401 5.77503 21.7468L6.54503 18.3868C6.6267 18.0251 6.4517 17.4301 6.19503 17.1618L3.50003 14.4434C2.50837 13.4401 2.13503 12.3434 2.45003 11.3634C2.6367 10.7918 3.22003 9.80011 5.0867 9.48511L8.5517 8.90178C8.8667 8.84344 9.34503 8.49344 9.48503 8.20178L11.3984 4.34011C12.2734 2.57844 13.4167 2.32178 14.0117 2.32178C14.6067 2.32178 15.75 2.59011 16.6134 4.34011L18.5267 8.19011C18.6784 8.49344 19.145 8.84344 19.4717 8.90178L22.9367 9.48511C24.325 9.71844 25.2584 10.3834 25.5734 11.3751C25.76 11.9468 25.865 13.1018 24.5117 14.4551L21.8284 17.1618C21.5717 17.4301 21.3967 18.0251 21.4784 18.3984L22.2484 21.7468C22.75 23.9401 21.98 24.8851 21.4667 25.2584C21.21 25.4451 20.7784 25.6551 20.16 25.6551L20.1484 25.6668Z" fill={hoveredStar >= star ? '#FFC107' : '#E0E0E0'} />
                </svg>
              </button>
            ))}
          </div>

          {/* Дата доставки */}
          {product.delivered_at && (
            <div className="awaiting-review-item__date">
              {formatDeliveryDate(product.delivered_at)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}