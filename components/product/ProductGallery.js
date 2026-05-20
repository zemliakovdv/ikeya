'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductMobileGallery from '@/components/product/ProductMobileGallery';
import { resolveImageUrl } from '@/lib/api/ikea';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductGallery({ images = [] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const validImages = useMemo(() => {
    if (!Array.isArray(images)) return [];

    return images
      .map((image) => resolveImageUrl(image))
      .filter(Boolean);
  }, [images]);

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
  }, [lightboxOpen, lightboxPrev, lightboxNext, closeLightbox]);

  if (!validImages.length) {
    return (
      <div className="goods-images">
        <div className="product-gallery-desktop">
          <div className="goods-images__inner">
            <div className="goods-images__main">
              <div className="placeholder-image">
                <img
                  src={PLACEHOLDER_IMAGE}
                  alt="Изображение недоступно"
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="product-gallery-mobile">
          <ProductMobileGallery images={images} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="goods-images">
        <div className="product-gallery-desktop">
          <div className="goods-images__inner">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation={{
                prevEl: '.goods-images__main .swiper-button-prev',
                nextEl: '.goods-images__main .swiper-button-next',
              }}
              thumbs={{
                swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              spaceBetween={10}
              className="swiper mySwiper2 goods-images__main"
            >
              {validImages.map((image, index) => (
                <SwiperSlide key={`${image}-${index}`} className="goods-main__item">
                  <img
                    src={image}
                    alt={`Фото товара ${index + 1}`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    onClick={() => openLightbox(index)}
                    style={{ cursor: 'zoom-in' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {validImages.length > 1 && (
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
                freeMode
                className="swiper mySwiper goods-images__minis"
              >
                {validImages.map((image, index) => (
                  <SwiperSlide key={`${image}-${index}`} className="goods-minis__item">
                    <img
                      src={image}
                      alt={`Миниатюра ${index + 1}`}
                      loading="lazy"
                      width="80"
                      height="80"
                      onError={(event) => {
                        event.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        <div className="product-gallery-mobile">
          <ProductMobileGallery images={images} />
        </div>
      </div>

      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            type="button"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 32,
              lineHeight: 1,
              zIndex: 1,
            }}
            aria-label="Закрыть"
          >
            ✕
          </button>

          {validImages.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                lightboxPrev();
              }}
              type="button"
              style={{
                position: 'absolute',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                cursor: 'pointer',
                color: '#fff',
                fontSize: 20,
              }}
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
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />

          {validImages.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                lightboxNext();
              }}
              type="button"
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                cursor: 'pointer',
                color: '#fff',
                fontSize: 20,
              }}
              aria-label="Следующее фото"
            >
              ›
            </button>
          )}

          {validImages.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                fontSize: 14,
                opacity: 0.7,
              }}
            >
              {lightboxIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}