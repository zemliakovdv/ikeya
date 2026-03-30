'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState, useEffect, useCallback } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const API_BASE_URL = 'http://45.135.234.22';
const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductGallery({ images = [] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const validImages = Array.isArray(images) && images.length > 0
    ? images.map(img => img?.replace(/^\/+/, '')).filter(Boolean)
    : [];

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(i => (i - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex(i => (i + 1) % validImages.length);
  }, [validImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, lightboxPrev, lightboxNext, closeLightbox]);

  if (!validImages.length) {
    return (
      <div className="goods-images">
        <div className="goods-images__inner">
          <div className="goods-images__main">
            <div className="placeholder-image">
              <img src={PLACEHOLDER_IMAGE} alt="Изображение недоступно" width="100%" height="100%" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  return (
    <>
      <div className="goods-images">
        <div className="goods-images__inner">

          {/* Основной слайдер */}
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation={{
              prevEl: '.goods-images__main .swiper-button-prev',
              nextEl: '.goods-images__main .swiper-button-next',
            }}
            thumbs={{
              swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
            }}
            spaceBetween={10}
            className="swiper mySwiper2 goods-images__main"
          >
            {validImages.map((image, index) => (
              <SwiperSlide key={index} className="goods-main__item">
                <img
                  src={`${API_BASE_URL}/${image}`}
                  alt={`Фото товара ${index + 1}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  onClick={() => openLightbox(index)}
                  style={{ cursor: 'zoom-in' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Миниатюры */}
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
                <SwiperSlide key={index} className="goods-minis__item">
                  <img
                    src={`${API_BASE_URL}/${image}`}
                    alt={`Миниатюра ${index + 1}`}
                    loading="lazy"
                    width="80"
                    height="80"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* Лайтбокс */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={closeLightbox}
        >
          {/* Закрыть */}
          <button
            onClick={closeLightbox}
            type="button"
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 32, lineHeight: 1, zIndex: 1,
            }}
          >
            ✕
          </button>

          {/* Предыдущее */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              type="button"
              style={{
                position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                width: 48, height: 48, cursor: 'pointer', color: '#fff', fontSize: 20,
              }}
            >
              ‹
            </button>
          )}

          {/* Изображение */}
          <img
            src={`${API_BASE_URL}/${validImages[lightboxIndex]}`}
            alt={`Фото товара ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '90vh',
              objectFit: 'contain', borderRadius: 8,
            }}
          />

          {/* Следующее */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              type="button"
              style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                width: 48, height: 48, cursor: 'pointer', color: '#fff', fontSize: 20,
              }}
            >
              ›
            </button>
          )}

          {/* Счётчик */}
          {validImages.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              color: '#fff', fontSize: 14, opacity: 0.7,
            }}>
              {lightboxIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}