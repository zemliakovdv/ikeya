'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useCallback, useEffect, useState } from 'react';

import 'swiper/css';
import 'swiper/css/pagination';

const API_BASE_URL = 'https://test.ikeya.by';
const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductMobileGallery({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const validImages = Array.isArray(images) && images.length > 0
    ? images.map((img) => img?.replace(/^\/+/, '')).filter(Boolean)
    : [];

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((index) => (index - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((index) => (index + 1) % validImages.length);
  }, [validImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (event) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') lightboxPrev();
      if (event.key === 'ArrowRight') lightboxNext();
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  if (!validImages.length) {
    return (
      <div className="product-mobile-gallery">
        <div className="product-mobile-gallery__item">
          <img
            src={PLACEHOLDER_IMAGE}
            alt="Изображение недоступно"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-mobile-gallery">
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: '.product-mobile-gallery__pagination',
          }}
          spaceBetween={0}
          slidesPerView={1}
          className="product-mobile-gallery__slider"
        >
          {validImages.map((image, index) => (
            <SwiperSlide key={image || index} className="product-mobile-gallery__slide">
              <button
                type="button"
                className="product-mobile-gallery__item"
                onClick={() => openLightbox(index)}
                aria-label={`Открыть фото товара ${index + 1}`}
              >
                <img
                  src={`${API_BASE_URL}/${image}`}
                  alt={`Фото товара ${index + 1}`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {validImages.length > 1 && (
          <div className="product-mobile-gallery__pagination" />
        )}
      </div>

      {lightboxOpen && (
        <div
          className="product-mobile-gallery-lightbox"
          onClick={closeLightbox}
          role="presentation"
        >
          <button
            className="product-mobile-gallery-lightbox__close"
            onClick={closeLightbox}
            type="button"
            aria-label="Закрыть"
          >
            ✕
          </button>

          {validImages.length > 1 && (
            <button
              className="product-mobile-gallery-lightbox__prev"
              onClick={(event) => {
                event.stopPropagation();
                lightboxPrev();
              }}
              type="button"
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
          )}

          <img
            src={`${API_BASE_URL}/${validImages[lightboxIndex]}`}
            alt={`Фото товара ${lightboxIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
          />

          {validImages.length > 1 && (
            <button
              className="product-mobile-gallery-lightbox__next"
              onClick={(event) => {
                event.stopPropagation();
                lightboxNext();
              }}
              type="button"
              aria-label="Следующее фото"
            >
              ›
            </button>
          )}

          {validImages.length > 1 && (
            <div className="product-mobile-gallery-lightbox__counter">
              {lightboxIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}