"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { ProductCard } from "./ProductCard"

const chunk = (arr, size) => {
  const res = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res
}

export function ProductsSlider({ products }) {
  const slides = chunk(products, 5)

  return (
    <div className="products-slider-wrapper">
      <div className="products-slider swiper">
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          navigation={{
            prevEl: ".products-slider__nav-prev",
            nextEl: ".products-slider__nav-next",
          }}
          className="products-slider-swiper"
        >
          {slides.map((slideProducts, index) => (
            <SwiperSlide key={index}>
              <div className="row g-4 swiper-slide-inner">
                {slideProducts.map((product) => (
                  <div key={product.id} className="col product-card-inner">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button
        type="button"
        className="products-slider__nav products-slider__nav-prev"
        aria-label="Предыдущий"
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
        className="products-slider__nav products-slider__nav-next"
        aria-label="Следующий"
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
    </div>
  )
}
