"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const chunk = (arr, size) => {
  const res = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res
}

export function PopularCategories({ categories }) {
  const slides = chunk(categories, 8)

  return (
    <section className="popular-category">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Популярные категории</h2>
            <div className="popular-categories">
              <div className="popular-categories-inner">
                <Swiper
                  modules={[Navigation, Pagination]}
                  loop
                  slidesPerView={1}
                  navigation={{
                    prevEl: ".popular-categories__nav-prev",
                    nextEl: ".popular-categories__nav-next",
                  }}
                  pagination={{
                    el: ".popular-categories__pagination",
                    clickable: true,
                  }}
                  className="popular-categories-swiper swiper"
                >
                  {slides.map((slideCategories, slideIndex) => (
                    <SwiperSlide key={slideIndex} className="popular-categories-item">
                      {slideCategories.map((cat) => (
                        <div key={cat.id} className="categories-item-card">
                          <div className="categories-card-img">
                            <img src={cat.imgSrc} alt={cat.imgAlt} />
                          </div>
                          <p>{cat.title}</p>
                          <a href={cat.href} />
                        </div>
                      ))}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button
                type="button"
                className="popular-categories__nav popular-categories__nav-prev"
                aria-label="Предыдущий слайд"
              >
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
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
                className="popular-categories__nav popular-categories__nav-next"
                aria-label="Следующий слайд"
              >
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                  <path
                    d="M1 11L6 6L1 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="popular-categories__pagination" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
