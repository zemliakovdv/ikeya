'use client';

import { useEffect, useRef } from 'react';
import PromoCard from '../shared/PromoCard';

const promoCards = [
  { image: 'promo-card-1.png', title: 'SLATTUM', description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см', price: '135' },
  { image: 'promo-card-2.png', title: 'SLATTUM', description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см', price: '135' },
  { image: 'promo-card-3.png', title: 'SLATTUM', description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см', price: '135' },
  { image: 'promo-card-1.png', title: 'SLATTUM', description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см', price: '135' },
  { image: 'promo-card-2.png', title: 'SLATTUM', description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см', price: '135' },
  { image: 'promo-card-3.png', title: 'SLATTUM', description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см', price: '135' },
];

export default function PromoBlock() {
  const swiperRef = useRef(null);

  useEffect(() => {
    // ✅ Функция инициализации слайдера
    const initSlider = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        const swiperEl = document.querySelector('.promo-card-inner');
        const paginationEl = document.querySelector('.promo-cards-slider__pagination');
        const prevEl = document.querySelector('.promo-cards-slider__nav-prev');
        const nextEl = document.querySelector('.promo-cards-slider__nav-next');

        if (swiperEl) {
          // ✅ Уничтожаем старый экземпляр перед созданием нового
          if (swiperRef.current) {
            swiperRef.current.destroy(true, true);
            swiperRef.current = null;
          }

          swiperRef.current = new window.Swiper(swiperEl, {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: false,
            speed: 600,
            watchOverflow: true,
            navigation: {
              nextEl: nextEl,
              prevEl: prevEl,
            },
            pagination: {
              el: paginationEl,
              clickable: true,
            },
            breakpoints: {
              320: { slidesPerView: 1, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              992: { slidesPerView: 2, spaceBetween: 20 },
              1200: { slidesPerView: 3, spaceBetween: 20 },
            },
            on: {
              init: () => console.log('PromoBlock слайдер инициализирован'),
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

    return () => {
      clearTimeout(timer);
      // ✅ Очистка при размонтировании компонента
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, []);

  return (
    <section className="promo-block">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="promo-block-inner">
              
              {/* Левый баннер */}
              <div className="promo-block-info">
                <a href="#">
                  <img src="/assets/img/main-page/promo-block/left-banner.png" alt="Промо-баннер" />
                </a>
              </div>

              {/* Карточки */}
              <div className="promo-block-card">
                <div className="promo-cards-slider">
                  <div className="promo-card-inner swiper">
                    <div className="swiper-wrapper">
                      {promoCards.map((card, index) => (
                        <div key={index} className="swiper-slide">
                          <PromoCard {...card} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Навигация */}
                  <button className="promo-cards-slider__nav promo-cards-slider__nav-prev">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="promo-cards-slider__nav promo-cards-slider__nav-next">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Пагинация */}
                  <div className="promo-cards-slider__pagination"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
