// components/catalog/products/ProductGallery.js
'use client';

import { useEffect, useRef } from 'react';

export default function ProductGallery({ images, thumbs, galleryId }) {
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);

  useEffect(() => {
    // Проверяем что Swiper загружен
    if (typeof window === 'undefined' || !window.Swiper) return;

    // Проверка: Элементы должны существовать в DOM
    const mainElement = document.querySelector(`.product-gallery-main[data-gallery="${galleryId}"]`);
    const thumbsElement = document.querySelector(`.product-gallery-thumbs[data-gallery-thumbs="${galleryId}"]`);

    if (!mainElement) {
      return;
    }

    // Небольшая задержка для гарантии рендеринга
    const timer = setTimeout(() => {
      try {
        // Инициализация Swiper для миниатюр (если есть)
        if (thumbsElement && thumbs && thumbs.length > 1) {
          thumbsSwiperRef.current = new window.Swiper(`.product-gallery-thumbs[data-gallery-thumbs="${galleryId}"]`, {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
          });
        }

        // Инициализация главного Swiper
        mainSwiperRef.current = new window.Swiper(`.product-gallery-main[data-gallery="${galleryId}"]`, {
          spaceBetween: 10,
          navigation: {
            nextEl: `.product-gallery-main[data-gallery="${galleryId}"] .swiper-button-next`,
            prevEl: `.product-gallery-main[data-gallery="${galleryId}"] .swiper-button-prev`,
          },
          thumbs: thumbsSwiperRef.current ? {
            swiper: thumbsSwiperRef.current,
          } : undefined,
        });
      } catch (error) {
        console.error('Swiper initialization error:', error);
      }
    }, 50);

    // Cleanup
    return () => {
      clearTimeout(timer);
      
      try {
        if (mainSwiperRef.current && typeof mainSwiperRef.current.destroy === 'function') {
          mainSwiperRef.current.destroy(true, true);
        }
      } catch (e) {
        console.error('Main swiper destroy error:', e);
      }
      
      try {
        if (thumbsSwiperRef.current && typeof thumbsSwiperRef.current.destroy === 'function') {
          thumbsSwiperRef.current.destroy(true, true);
        }
      } catch (e) {
        console.error('Thumbs swiper destroy error:', e);
      }
      
      mainSwiperRef.current = null;
      thumbsSwiperRef.current = null;
    };
  }, [galleryId, thumbs]);

  // Проверяем: если заглушка — не показываем thumbs
  const isPlaceholder = images.length === 1 && images[0].includes('no-image.jpg');
  const hasMoreThumbs = thumbs && thumbs.length > 3;
  const extraThumbsCount = hasMoreThumbs ? thumbs.length - 3 : 0;
  
  // Показываем thumbs только если: не заглушка И больше 1 изображения
const showThumbs = thumbs && thumbs.length >= 1;


  return (
    <div className="product-card__gallery">
      {/* Главная галерея */}
      <div
        style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
        className="swiper product-gallery-main"
        data-gallery={galleryId}
      >
        <div className="swiper-wrapper">
          {images.map((image, index) => (
            <div key={index} className="swiper-slide">
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
        {/* Показываем навигацию только если больше 1 изображения */}
        {images.length > 1 && (
          <>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </>
        )}
      </div>

      {/* Миниатюры - показываем только если есть реальные картинки */}
      {showThumbs && (
        <div
          className="swiper product-gallery-thumbs"
          data-gallery-thumbs={galleryId}
          style={{ opacity: 1 }}
        >
          <div className="swiper-wrapper">
            {thumbs.slice(0, 3).map((thumb, index) => (
              <div key={index} className="swiper-slide">
                <img src={thumb} alt={`Thumb ${index + 1}`} />
              </div>
            ))}
            {hasMoreThumbs && (
              <div className="swiper-slide product-gallery-thumbs__more">
                <span className="product-gallery-thumbs__count">+{extraThumbsCount}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
