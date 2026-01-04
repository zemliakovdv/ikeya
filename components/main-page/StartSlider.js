'use client';

import { useEffect, useRef } from 'react';

export default function StartSlider() {
  const swiperRef = useRef(null);

  useEffect(() => {
    // ✅ Функция инициализации Swiper
    const initSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        const swiperEl = document.querySelector('.start-slider__swiper');
        const paginationEl = document.querySelector('.start-slider__pagination');
        const prevEl = document.querySelector('.start-slider__nav-prev');
        const nextEl = document.querySelector('.start-slider__nav-next');

        // ✅ Отладка: логируем найденные элементы
        console.log('[StartSlider] Элементы найдены:', {
          swiperEl: !!swiperEl,
          paginationEl: !!paginationEl,
          prevEl: !!prevEl,
          nextEl: !!nextEl,
          Swiper: !!window.Swiper,
          swiperRefCurrent: !!swiperRef.current
        });

        if (swiperEl && window.Swiper && !swiperRef.current) {
          console.log('[StartSlider] Инициализация Swiper с навигацией:', {
            prevEl: prevEl ? 'найден' : 'НЕ НАЙДЕН',
            nextEl: nextEl ? 'найден' : 'НЕ НАЙДЕН'
          });

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
                console.log('[StartSlider] Swiper инициализирован!', {
                  navigation: this.navigation,
                  nextButton: this.navigation?.nextEl,
                  prevButton: this.navigation?.prevEl
                });
              },
              slideChange: function () {
                console.log('[StartSlider] Слайд изменен, текущий индекс:', this.activeIndex);
              }
            }
          });

          // ✅ Дополнительная отладка: проверяем, что кнопки привязаны
          if (nextEl) {
            console.log('[StartSlider] nextEl элемент:', nextEl);
            nextEl.addEventListener('click', function(e) {
              console.log('[StartSlider] Клик по nextEl кнопке!', e);
            });
          } else {
            console.warn('[StartSlider] ⚠️ nextEl не найден!');
          }

          if (prevEl) {
            console.log('[StartSlider] prevEl элемент:', prevEl);
            prevEl.addEventListener('click', function(e) {
              console.log('[StartSlider] Клик по prevEl кнопке!', e);
            });
          } else {
            console.warn('[StartSlider] ⚠️ prevEl не найден!');
          }
        } else {
          console.warn('[StartSlider] Условие инициализации не выполнено:', {
            swiperEl: !!swiperEl,
            Swiper: !!window.Swiper,
            swiperRefCurrent: !!swiperRef.current
          });
        }
      } else {
        console.warn('[StartSlider] Swiper не доступен');
      }
    };

    // ✅ Ожидание готовности Swiper с повторными попытками
    let attempts = 0;
    const maxAttempts = 50; // 5 секунд максимум
    const checkSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        initSwiper();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkSwiper, 100);
      }
    };

    const timeoutId = setTimeout(checkSwiper, 100);

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
