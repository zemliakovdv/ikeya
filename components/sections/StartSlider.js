"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function StartSlider({ slides }) {
  return (
    <section className="start-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <Swiper
                modules={[Navigation, Pagination]}
                loop
                slidesPerView={1}
                pagination={{
                  el: ".start-slider__pagination",
                  clickable: true,
                }}
                navigation={{
                  nextEl: ".start-slider__nav-next",
                  prevEl: ".start-slider__nav-prev",
                }}
                className="start-slider__swiper"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <a href={slide.href}>
                      <img src={slide.src} alt={slide.alt} />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="start-slider__pagination" />

              <button
                type="button"
                className="start-slider__nav-prev"
                aria-label="Предыдущий слайд"
              >
                <svg
                  width="6.67"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 1L1 6L6 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="start-slider__nav-next"
                aria-label="Следующий слайд"
              >
                <svg
                  width="6.67"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 11L6 6L1 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
