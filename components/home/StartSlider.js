'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function StartSlider() {
  useEffect(() => {
    // Инициализация Swiper после загрузки
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.start-slider__swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        pagination: {
          el: '.start-slider__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.start-slider__nav-next',
          prevEl: '.start-slider__nav-prev',
        },
      })
    }
  }, [])

  return (
    <section className="start-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <div className="swiper start-slider__swiper">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <Link href="#">
                      <img src="/assets/img/main-page/start-slider/start-slider-banner.jpg" alt="Слайд" />
                    </Link>
                  </div>
                  <div className="swiper-slide">
                    <Link href="#">
                      <img src="/assets/img/main-page/start-slider/start-slider-banner.jpg" alt="Слайд" />
                    </Link>
                  </div>
                  <div className="swiper-slide">
                    <Link href="#">
                      <img src="/assets/img/main-page/start-slider/start-slider-banner.jpg" alt="Слайд" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="start-slider__pagination"></div>

              {/* Навигация */}
              <div className="start-slider__nav-prev">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="start-slider__nav-next">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
