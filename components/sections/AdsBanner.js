"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function AdsBanner({ slides }) {
  return (
    <section className="ads-banner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="ads-banner-slider">
              <div className="ads-banner-inner">
                <Swiper
                  modules={[Navigation, Pagination]}
                  slidesPerView={1}
                  loop
                  navigation={{
                    prevEl: ".ads-banner-slider__nav-prev",
                    nextEl: ".ads-banner-slider__nav-next",
                  }}
                  pagination={{
                    el: ".ads-banner-slider__pagination",
                    clickable: true,
                  }}
                  className="ads-banner-swiper swiper"
                >
                  {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                      <div className="ads-banner-item">
                        {slide.banners.map((banner) => (
                          <a key={banner.id} href={banner.href}>
                            <img src={banner.src} alt={banner.alt} />
                          </a>
                        ))}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button
                type="button"
                className="ads-banner-slider__nav ads-banner-slider__nav-prev"
                aria-label="Предыдущий слайд"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path
                    d="M6 1L1 6L6 11"
                    stroke="#181818"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="ads-banner-slider__nav ads-banner-slider__nav-next"
                aria-label="Следующий слайд"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path
                    d="M1 11L6 6L1 1"
                    stroke="#181818"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="ads-banner-slider__pagination" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
