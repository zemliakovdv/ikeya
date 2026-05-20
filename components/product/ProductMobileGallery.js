'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { resolveImageUrl } from '@/lib/api/ikea';

import 'swiper/css';
import 'swiper/css/pagination';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductMobileGallery({ images = [] }) {
  const paginationRef = useRef(null);

  const [swiperReady, setSwiperReady] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const validImages = useMemo(() => {
    if (!Array.isArray(images)) return [];

    return images
      .map((image) => resolveImageUrl(image))
      .filter(Boolean);
  }, [images]);

  useEffect(() => {
    setSwiperReady(true);
  }, []);

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

    const previousOverflow = document.body.style.overflow;

    const handleKey = (event) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') lightboxPrev();
      if (event.key === 'ArrowRight') lightboxNext();
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
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
          pagination={
            swiperReady && paginationRef.current
              ? {
                  clickable: true,
                  el: paginationRef.current,
                }
              : false
          }
          onBeforeInit={(swiper) => {
            if (!paginationRef.current) return;
            swiper.params.pagination.el = paginationRef.current;
          }}
          onSwiper={(swiper) => {
            if (!paginationRef.current) return;
            swiper.params.pagination.el = paginationRef.current;
            swiper.pagination?.destroy?.();
            swiper.pagination?.init?.();
            swiper.pagination?.render?.();
            swiper.pagination?.update?.();
          }}
          spaceBetween={0}
          slidesPerView={1}
          className="product-mobile-gallery__slider"
        >
          {validImages.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`} className="product-mobile-gallery__slide">
              <button
                type="button"
                className="product-mobile-gallery__item"
                onClick={() => openLightbox(index)}
                aria-label={`Открыть фото товара ${index + 1}`}
              >
                <img
                  src={image}
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
          <div className="product-mobile-gallery__pagination" ref={paginationRef} />
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
            src={validImages[lightboxIndex]}
            alt={`Фото товара ${lightboxIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
            onError={(event) => {
              event.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
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