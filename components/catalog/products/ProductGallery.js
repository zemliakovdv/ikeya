'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductGallery({ images = [], galleryId = 'gallery-1' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="product-card__gallery">
      <div 
        style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
        className="swiper product-gallery-main" 
        data-gallery={galleryId}
      >
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          spaceBetween={0}
          slidesPerView={1}
          className="swiper-wrapper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt="Товар" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>

      {images.length > 1 && (
        <div 
          className="swiper product-gallery-thumbs" 
          data-gallery-thumbs={galleryId}
          style={{ opacity: images.length > 4 ? 0 : 1 }}
        >
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={4}
            watchSlidesProgress={true}
            className="swiper-wrapper"
          >
            {images.slice(0, 3).map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt="Миниатюра" />
              </SwiperSlide>
            ))}
            {images.length > 4 && (
              <SwiperSlide>
                <div className="product-gallery-thumbs__more">
                  <span className="product-gallery-thumbs__count">+{images.length - 3}</span>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      )}
    </div>
  );
}
