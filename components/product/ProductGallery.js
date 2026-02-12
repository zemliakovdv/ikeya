'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState } from 'react';

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export default function ProductGallery({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Если нет изображений, показываем заглушку
  if (!images || images.length === 0) {
    return (
      <div className="goods-images">
        <div className="goods-images__inner">
          <div className="goods-images__main">
            <img src="/assets/img/no-image.png" alt="Нет изображения" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="goods-images">
      <div className="goods-images__inner">
        
        {/* Основной слайдер */}
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          spaceBetween={10}
          className="swiper mySwiper2 goods-images__main"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="goods-main__item">
              <img 
                src={`http://45.135.234.22/${image}`} 
                alt={`Фото ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Миниатюры */}
        {images.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            className="swiper mySwiper goods-images__minis"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="goods-minis__item">
                <img 
                  src={`http://45.135.234.22/${image}`} 
                  alt={`Миниатюра ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        
      </div>
    </div>
  );
}
