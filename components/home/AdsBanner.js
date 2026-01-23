'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdsBanner() {
  useEffect(() => {
    // Инициализация Swiper после загрузки
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.ads-banner-inner', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        pagination: {
          el: '.ads-banner-slider__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.ads-banner-slider__nav-next',
          prevEl: '.ads-banner-slider__nav-prev',
        },
      })
    }
  }, [])

  return (
    <section className="ads-banner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="ads-banner-slider">
              <div className="ads-banner-inner swiper">
                <div className="swiper-wrapper">
                  {/* Слайд 1 */}
                  <div className="swiper-slide">
                    <div className="ads-banner-item">
                      <Link href="#">
                        <img src="/assets/img/main-page/ads-banner/ads-banner-1.png" alt="Рекламный баннер" />
                      </Link>
                      <Link href="#">
                        <img src="/assets/img/main-page/ads-banner/ads-banner-2.png" alt="Рекламный баннер" />
                      </Link>
                    </div>
                  </div>

                  {/* Слайд 2 */}
                  <div className="swiper-slide">
                    <div className="ads-banner-item">
                      <Link href="#">
                        <img src="/assets/img/main-page/ads-banner/ads-banner-1.png" alt="Рекламный баннер" />
                      </Link>
                      <Link href="#">
                        <img src="/assets/img/main-page/ads-banner/ads-banner-2.png" alt="Рекламный баннер" />
                      </Link>
                    </div>
                  </div>

                  {/* Слайд 3 */}
                  <div className="swiper-slide">
                    <div className="ads-banner-item">
                      <Link href="#">
                        <img src="/assets/img/main-page/ads-banner/ads-banner-1.png" alt="Рекламный баннер" />
                      </Link>
                      <Link href="#">
                        <img src="/assets/img/main-page/ads-banner/ads-banner-2.png" alt="Рекламный баннер" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Навигационные кнопки */}
              <button className="ads-banner-slider__nav ads-banner-slider__nav-prev">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="ads-banner-slider__nav ads-banner-slider__nav-next">
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Пагинация (дотсы) */}
              <div className="ads-banner-slider__pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
