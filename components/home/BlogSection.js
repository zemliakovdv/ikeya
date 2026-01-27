'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'

export default function BlogSection() {
  const swiperRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, [])

  // Данные статей блога
  const blogSlides = [
    {
      id: 1,
      articles: [
        {
          id: 'article-1-1',
          image: '/assets/img/main-page/blog/blog-1.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-1'
        },
        {
          id: 'article-1-2',
          image: '/assets/img/main-page/blog/blog-1.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-2'
        },
        {
          id: 'article-1-3',
          image: '/assets/img/main-page/blog/blog-1.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-3'
        }
      ]
    },
    {
      id: 2,
      articles: [
        {
          id: 'article-2-1',
          image: '/assets/img/main-page/blog/blog-2.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-4'
        },
        {
          id: 'article-2-2',
          image: '/assets/img/main-page/blog/blog-2.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-5'
        },
        {
          id: 'article-2-3',
          image: '/assets/img/main-page/blog/blog-2.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-6'
        }
      ]
    },
    {
      id: 3,
      articles: [
        {
          id: 'article-3-1',
          image: '/assets/img/main-page/blog/blog-3.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-7'
        },
        {
          id: 'article-3-2',
          image: '/assets/img/main-page/blog/blog-3.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-8'
        },
        {
          id: 'article-3-3',
          image: '/assets/img/main-page/blog/blog-3.png',
          category: 'Гостинная',
          title: 'Как сделать ванную удобнее: 8 «работающих» идей',
          description: 'Точечные вмешательства для видимого результата.',
          link: '/blog/article-9'
        }
      ]
    }
  ]

  useEffect(() => {
    if (!mounted) return

    const initSwiper = () => {
      const swiperEl = document.querySelector('.blog-inner')
      
      if (swiperEl) {
        try {
          swiperRef.current = new Swiper('.blog-inner', {
            modules: [Navigation, Pagination],
            slidesPerView: 1,
            spaceBetween: 24,
            navigation: {
              nextEl: '.blog-slider__nav-next',
              prevEl: '.blog-slider__nav-prev'
            },
            pagination: {
              el: '.blog-slider__pagination',
              clickable: true
            }
          })
        } catch (error) {
          console.error('Ошибка инициализации слайдера блога:', error)
        }
      }
    }

    initSwiper()

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
      }
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <section className="blog">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Советы и лайфхакти</h2>
            
            <div className="blog-slider">
              <div className="blog-inner swiper">
                <div className="swiper-wrapper">
                  {blogSlides.map(slide => (
                    <div key={slide.id} className="swiper-slide">
                      <div className="blog-item">
                        {slide.articles.map(article => (
                          <div key={article.id} className="blog-card">
                            <Image 
                              src={article.image} 
                              alt={article.title}
                              width={400}
                              height={300}
                            />
                            <span>{article.category}</span>
                            <h4>{article.title}</h4>
                            <p>{article.description}</p>
                            <Link href={article.link}></Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Навигационные кнопки */}
              <button className="blog-slider__nav blog-slider__nav-prev">
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
              <button className="blog-slider__nav blog-slider__nav-next">
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

              {/* Пагинация */}
              <div className="blog-slider__pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
