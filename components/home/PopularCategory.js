'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PopularCategory({ categories = [] }) {
  useEffect(() => {
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

  // Разбиваем категории на группы по 8
  const slides = [];
  for (let i = 0; i < categories.length; i += 8) {
    slides.push(categories.slice(i, i + 8));
  }

  // Если категорий нет, показываем пустые слайды (3 слайда по 8 карточек)
  if (slides.length === 0) {
    slides.push(
      Array(8).fill({ id: 1, name: 'Мягкая мебель', image: '/assets/img/main-page/popular-categories/popular-categories-1.png', url: '/catalog' }),
      Array(8).fill({ id: 2, name: 'Комоды', image: '/assets/img/main-page/popular-categories/popular-categories-2.png', url: '/catalog' }),
      Array(8).fill({ id: 3, name: 'Матрасы', image: '/assets/img/main-page/popular-categories/popular-categories-3.png', url: '/catalog' })
    );
  }

  return (
    <section className="popular-category">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Популярные категории</h2>
            <div className="popular-categories">
              <div className="popular-categories-inner swiper">
                <div className="swiper-wrapper">
                  {slides.map((slideCategories, slideIndex) => (
                    <div key={slideIndex} className="swiper-slide popular-categories-item">
                      {slideCategories.map((category, idx) => (
                        <div key={`${category.id}-${idx}`} className="categories-item-card">
                          <div className="categories-card-img">
                            <img 
                              src={category.image} 
                              alt={category.name}
                              onError={(e) => {
                                e.target.src = '/assets/img/main-page/popular-categories/popular-categories-1.png';
                              }}
                            />
                          </div>
                          <p>{category.name}</p>
                          <Link href={category.url}></Link>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

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

              <div className="popular-categories__pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
