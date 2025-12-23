'use client';

import { useEffect, useRef } from 'react';

export default function ProductGallery({ images, thumbnails }) {
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      // Инициализация слайдера миниатюр
      const thumbsSwiper = new window.Swiper(thumbsSwiperRef.current, {
        spaceBetween: 10,
        slidesPerView: 'auto',
        freeMode: true,
        watchSlidesProgress: true,
      });

      // Инициализация основного слайдера
      const mainSwiper = new window.Swiper(mainSwiperRef.current, {
        spaceBetween: 10,
        navigation: {
          nextEl: '.goods-images .swiper-button-next',
          prevEl: '.goods-images .swiper-button-prev',
        },
        thumbs: {
          swiper: thumbsSwiper,
        },
      });

      return () => {
        if (mainSwiper) mainSwiper.destroy();
        if (thumbsSwiper) thumbsSwiper.destroy();
      };
    }
  }, []);

  return (
    <div className="goods-images">
      <div className="goods-images__inner">
        {/* Основной слайдер */}
        <div ref={mainSwiperRef} className="swiper mySwiper2 goods-images__main">
          <div className="swiper-wrapper">
            {images.map((image, index) => (
              <div key={index} className="swiper-slide goods-main__item">
                <img src={image} alt={`Product ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>

        {/* Миниатюры */}
        <div ref={thumbsSwiperRef} className="swiper mySwiper goods-images__minis">
          <div className="swiper-wrapper">
            {thumbnails.map((thumb, index) => (
              <div key={index} className="swiper-slide goods-minis__item">
                <img src={thumb} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
