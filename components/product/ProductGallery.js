'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState } from 'react';

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const API_BASE_URL = 'http://45.135.234.22';
const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductGallery({ images = [] }) { // ← Дефолт []
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loadedImages, setLoadedImages] = useState({}); // ← Трекер загрузки

  // Нормализуем изображения
  const validImages = Array.isArray(images) && images.length > 0 
    ? images
        .map(img => img?.replace(/^\/+/, '')) // Убираем ведущие слеши
        .filter(Boolean)
    : [];

  // ← Улучшенная заглушка
  if (!validImages.length) {
    return (
      <div className="goods-images">
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
    );
  }

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  return (
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
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE; // Fallback на ошибке
                }}
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
            freeMode // Плавный скролл миниатюр
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
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
