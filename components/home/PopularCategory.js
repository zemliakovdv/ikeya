'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PopularCategory() {
  useEffect(() => {
    // Инициализация Swiper после загрузки
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.popular-categories-inner', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        pagination: {
          el: '.popular-categories__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.popular-categories__nav-next',
          prevEl: '.popular-categories__nav-prev',
        },
      })
    }
  }, [])

  return (
    <section className="popular-category">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Популярные категории</h2>
            <div className="popular-categories">
              <div className="popular-categories-inner swiper">
                <div className="swiper-wrapper">
                  {/* Слайд 1 */}
                  <div className="swiper-slide popular-categories-item">
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-1.png" alt="Популярные категории" />
                      </div>
                      <p>Мягкая мебель</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-2.png" alt="Популярные категории" />
                      </div>
                      <p>Комоды</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-3.png" alt="Популярные категории" />
                      </div>
                      <p>Матрасы</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-4.png" alt="Популярные категории" />
                      </div>
                      <p>Кровати</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-5.png" alt="Популярные категории" />
                      </div>
                      <p>Шкафы распашные</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-6.png" alt="Популярные категории" />
                      </div>
                      <p>Стеллажи и полки</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-7.png" alt="Популярные категории" />
                      </div>
                      <p>Декор</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-8.png" alt="Популярные категории" />
                      </div>
                      <p>Садовые качели</p>
                      <Link href="/catalog"></Link>
                    </div>
                  </div>

                  {/* Слайд 2 */}
                  <div className="swiper-slide popular-categories-item">
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-1.png" alt="Популярные категории" />
                      </div>
                      <p>Мягкая мебель</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-2.png" alt="Популярные категории" />
                      </div>
                      <p>Комоды</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-3.png" alt="Популярные категории" />
                      </div>
                      <p>Матрасы</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-4.png" alt="Популярные категории" />
                      </div>
                      <p>Кровати</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-5.png" alt="Популярные категории" />
                      </div>
                      <p>Шкафы распашные</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-6.png" alt="Популярные категории" />
                      </div>
                      <p>Стеллажи и полки</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-7.png" alt="Популярные категории" />
                      </div>
                      <p>Декор</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-8.png" alt="Популярные категории" />
                      </div>
                      <p>Садовые качели</p>
                      <Link href="/catalog"></Link>
                    </div>
                  </div>

                  {/* Слайд 3 */}
                  <div className="swiper-slide popular-categories-item">
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-1.png" alt="Популярные категории" />
                      </div>
                      <p>Мягкая мебель</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-2.png" alt="Популярные категории" />
                      </div>
                      <p>Комоды</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-3.png" alt="Популярные категории" />
                      </div>
                      <p>Матрасы</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-4.png" alt="Популярные категории" />
                      </div>
                      <p>Кровати</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-5.png" alt="Популярные категории" />
                      </div>
                      <p>Шкафы распашные</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-6.png" alt="Популярные категории" />
                      </div>
                      <p>Стеллажи и полки</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-7.png" alt="Популярные категории" />
                      </div>
                      <p>Декор</p>
                      <Link href="/catalog"></Link>
                    </div>
                    <div className="categories-item-card">
                      <div className="categories-card-img">
                        <img src="/assets/img/main-page/popular-categories/popular-categories-8.png" alt="Популярные категории" />
                      </div>
                      <p>Садовые качели</p>
                      <Link href="/catalog"></Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Навигация */}
              <div className="popular-categories__nav popular-categories__nav-prev">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="popular-categories__nav popular-categories__nav-next">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Пагинация */}
              <div className="popular-categories__pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
