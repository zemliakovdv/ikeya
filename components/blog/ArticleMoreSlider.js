'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ArticleMoreSlider({ slides = [] }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Swiper) return;

    const timer = setTimeout(() => {
      const el = document.querySelector('.blog-inner');
      if (!el) return;

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      swiperRef.current = new window.Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: slides.length > 1,
        pagination: {
          el: '.blog-slider__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.blog-slider__nav-next',
          prevEl: '.blog-slider__nav-prev',
        },
      });
    }, 100);

    return () => {
      clearTimeout(timer);

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="blog-slider">
      <div className="blog-inner swiper">
        <div className="swiper-wrapper">
          {slides.map((slideArticles, index) => (
            <div key={index} className="swiper-slide">
              <div className="blog-item">
                {slideArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={article.link}
                    className="blog-card"
                  >
                    <div className="blog-card__image-wrap">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt=""
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="blog-card__image"
                        />
                      ) : (
                        <div className="blog-card__image-placeholder" />
                      )}
                    </div>

                    {article.category && (
                      <span className="blog-card__badge">
                        {article.category}
                      </span>
                    )}

                    <h4 className="blog-card__title">
                      {article.title}
                    </h4>

                    {article.excerpt && (
                      <p className="blog-card__excerpt">
                        {article.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            className="blog-slider__nav blog-slider__nav-prev"
            type="button"
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
            className="blog-slider__nav blog-slider__nav-next"
            type="button"
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
        </>
      )}
    </div>
  );
}