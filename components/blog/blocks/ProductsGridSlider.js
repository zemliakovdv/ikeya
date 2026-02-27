'use client';

import { useEffect, useRef } from 'react';
import ProductCard from '@/components/ui/ProductCard';

export default function ProductsGridSlider({ slides, blockId }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Swiper) return;

    const timer = setTimeout(() => {
      const el = document.querySelector(`.products-slider[data-slider="${blockId}"]`);
      if (!el) return;

      // Инициализируем галереи карточек
      document.querySelectorAll('.product-gallery-main').forEach((gallery) => {
        const galleryId = gallery.getAttribute('data-gallery');
        const thumbs = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`);
        let thumbsSwiper = null;
        if (thumbs) {
          thumbsSwiper = new window.Swiper(thumbs, {
            spaceBetween: 8,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesProgress: true,
          });
        }
        new window.Swiper(gallery, {
          spaceBetween: 10,
          navigation: {
            nextEl: gallery.querySelector('.swiper-button-next'),
            prevEl: gallery.querySelector('.swiper-button-prev'),
          },
          thumbs: thumbsSwiper ? { swiper: thumbsSwiper } : undefined,
        });
      });

      swiperRef.current = new window.Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
        pagination: {
          el: el.querySelector('.products-slider__pagination'),
          clickable: true,
        },
        navigation: {
          nextEl: el.querySelector('.products-slider__nav-next'),
          prevEl: el.querySelector('.products-slider__nav-prev'),
        },
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (swiperRef.current) swiperRef.current.destroy(true, true);
    };
  }, [slides, blockId]);

  return (
    <div className="products-card-slider">
      <div className="products-slider swiper" data-slider={blockId}>
        <div className="swiper-wrapper">
          {slides.map((slideProducts, index) => (
            <div key={index} className="swiper-slide">
              <div className="row g-4 swiper-slide-inner">
                {slideProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    gallery={`${blockId}-${product.id}`}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    images={product.images}
                    url={product.url}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {slides.length > 1 && <div className="products-slider__pagination"></div>}
        {slides.length > 1 && (
          <>
            <button className="products-slider__nav products-slider__nav-prev">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="products-slider__nav products-slider__nav-next">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
