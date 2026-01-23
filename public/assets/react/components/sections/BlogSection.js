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

export function BlogSection({ title, posts }) {
  const slides = chunk(posts, 3)

  return (
    <section className="blog">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>{title}</h2>

            <div className="blog-slider">
              <div className="blog-inner">
                <Swiper
                  modules={[Navigation, Pagination]}
                  slidesPerView={1}
                  loop
                  navigation={{
                    prevEl: ".blog-slider__nav-prev",
                    nextEl: ".blog-slider__nav-next",
                  }}
                  pagination={{
                    el: ".blog-slider__pagination",
                    clickable: true,
                  }}
                  className="blog-swiper swiper"
                >
                  {slides.map((slidePosts, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                      <div className="blog-item">
                        {slidePosts.map((post) => (
                          <div key={post.id} className="blog-card">
                            <img src={post.imageSrc} alt={post.imageAlt} />
                            <span>{post.category}</span>
                            <h4>{post.title}</h4>
                            <p>{post.description}</p>
                            <a href={post.href} aria-label={`Читать: ${post.title}`} />
                          </div>
                        ))}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button
                type="button"
                className="blog-slider__nav blog-slider__nav-prev"
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
                className="blog-slider__nav blog-slider__nav-next"
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

              <div className="blog-slider__pagination" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
