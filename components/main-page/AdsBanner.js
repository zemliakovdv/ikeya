'use client';

import { useEffect } from 'react';

const bannerSlides = [
  [
    '/assets/img/main-page/ads-banner/ads-banner-1.png',
    '/assets/img/main-page/ads-banner/ads-banner-2.png'
  ],
  [
    '/assets/img/main-page/ads-banner/ads-banner-1.png',
    '/assets/img/main-page/ads-banner/ads-banner-2.png'
  ],
  [
    '/assets/img/main-page/ads-banner/ads-banner-1.png',
    '/assets/img/main-page/ads-banner/ads-banner-2.png'
  ]
];

export default function AdsBanner() {
  useEffect(() => {
    // ✅ Функция инициализации слайдера
    const initSlider = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        const swiperEl = document.querySelector('.ads-banner-inner');
        const prevEl = document.querySelector('.ads-banner-slider__nav-prev');
        const nextEl = document.querySelector('.ads-banner-slider__nav-next');
        const paginationEl = document.querySelector('.ads-banner-slider__pagination');

        if (swiperEl) {
          // ✅ Уничтожаем старый экземпляр
          if (swiperEl.swiper) {
            swiperEl.swiper.destroy(true, true);
          }

          new window.Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 600,
            loop: true,
            pagination: {
              el: paginationEl,
              clickable: true,
            },
            navigation: {
              nextEl: nextEl,
              prevEl: prevEl,
            },
            on: {
              init: () => console.log('AdsBanner слайдер инициализирован'),
            }
          });
        }
      }
    };

    // ✅ Ожидание готовности Swiper с повторными попытками
    let attempts = 0;
    const maxAttempts = 50; // 5 секунд максимум
    const checkSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        initSlider();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkSwiper, 100);
      }
    };

    const timer = setTimeout(checkSwiper, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="ads-banner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="ads-banner-slider">
              <div className="ads-banner-inner swiper">
                <div className="swiper-wrapper">
                  {bannerSlides.map((banners, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="ads-banner-item d-flex gap-3 h-100 w-100">
                        <a href="#" className="flex-fill">
                          <img 
                            src={banners[0]} 
                            alt="Рекламный баннер 1" 
                            className="w-100 h-100 object-fit-cover rounded" 
                          />
                        </a>
                        <a href="#" className="flex-fill">
                          <img 
                            src={banners[1]} 
                            alt="Рекламный баннер 2" 
                            className="w-100 h-100 object-fit-cover rounded" 
                          />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Навигационные кнопки */}
                <button 
                  type="button" 
                  className="ads-banner-slider__nav ads-banner-slider__nav-prev"
                >
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  className="ads-banner-slider__nav ads-banner-slider__nav-next"
                >
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Пагинация */}
                <div className="ads-banner-slider__pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
