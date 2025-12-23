'use client';

import { useEffect, useRef } from 'react';

export default function StartSlider() {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Ждём полной загрузки Swiper
    const initSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        const swiperEl = document.querySelector('.start-slider__swiper');
        const paginationEl = document.querySelector('.start-slider__pagination');
        const prevEl = document.querySelector('.start-slider__nav-prev');
        const nextEl = document.querySelector('.start-slider__nav-next');

        if (swiperEl && window.Swiper && !swiperRef.current) {
          swiperRef.current = new window.Swiper(swiperEl, {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 600,
            pagination: {
              el: paginationEl,
              clickable: true,
            },
            navigation: {
              nextEl: nextEl,
              prevEl: prevEl,
            },
            autoplay: {
              delay: 5000,
              disableOnInteraction: false,
            },
            on: {
              init: function () {
                console.log('StartSlider инициализирован!'); // ← проверка в консоли
              },
            }
          });
        }
      }
    };

    // Инициализируем после монтирования DOM
    const timeoutId = setTimeout(initSwiper, 100);

    return () => {
      clearTimeout(timeoutId);
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, []);

  return (
    <section className="start-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <div className="swiper start-slider__swiper">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <a href="#">
                      <img src="/assets/img/main-page/start-slider/start-slider-banner.jpg" alt="Слайд 1" />
                    </a>
                  </div>
                  <div className="swiper-slide">
                    <a href="#">
                      <img src="/assets/img/main-page/start-slider/start-slider-banner.jpg" alt="Слайд 2" />
                    </a>
                  </div>
                  <div className="swiper-slide">
                    <a href="#">
                      <img src="/assets/img/main-page/start-slider/start-slider-banner.jpg" alt="Слайд 3" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="start-slider__pagination"></div>
              <div className="start-slider__nav-prev">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="start-slider__nav-next">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
