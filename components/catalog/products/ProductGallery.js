// components/catalog/products/ProductGallery.js
'use client';

import { useEffect, useRef } from 'react';

export default function ProductGallery({ images, thumbs, galleryId }) {
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);

  useEffect(() => {
    // Проверяем что Swiper загружен
    if (typeof window === 'undefined' || !window.Swiper) return;

    // Инициализация Swiper для миниатюр
    const thumbsSwiper = new window.Swiper(`.product-gallery-thumbs[data-gallery-thumbs="${galleryId}"]`, {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    // Инициализация главного Swiper
    const mainSwiper = new window.Swiper(`.product-gallery-main[data-gallery="${galleryId}"]`, {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
    });

    mainSwiperRef.current = mainSwiper;
    thumbsSwiperRef.current = thumbsSwiper;

    // Cleanup
    return () => {
      if (mainSwiper) mainSwiper.destroy();
      if (thumbsSwiper) thumbsSwiper.destroy();
    };
  }, [galleryId]);

  const hasMoreThumbs = thumbs && thumbs.length > 3;
  const extraThumbsCount = hasMoreThumbs ? thumbs.length - 3 : 0;

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
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>

      {/* Миниатюры */}
      {thumbs && thumbs.length > 0 && (
        <div
          thumbsSlider=""
          className="swiper product-gallery-thumbs"
          data-gallery-thumbs={galleryId}
          style={{ opacity: thumbs.length <= 3 ? 0 : 1 }}
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
