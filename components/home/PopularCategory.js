'use client';

// components/home/PopularCategory.js

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

const FALLBACK_CATEGORIES = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `fallback-1-${i}`,
    name: 'Мягкая мебель',
    image: '/assets/img/main-page/popular-categories/popular-categories-1.png',
    url: '/catalog',
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `fallback-2-${i}`,
    name: 'Комоды',
    image: '/assets/img/main-page/popular-categories/popular-categories-2.png',
    url: '/catalog',
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `fallback-3-${i}`,
    name: 'Матрасы',
    image: '/assets/img/main-page/popular-categories/popular-categories-3.png',
    url: '/catalog',
  })),
];

export default function PopularCategory({ categories = [] }) {
  const sliderRef = useRef(null);
  const swiperRef = useRef(null);

  const displayCategories = categories.length ? categories : FALLBACK_CATEGORIES;

  const slides = [];
  for (let i = 0; i < displayCategories.length; i += 8) {
    slides.push(displayCategories.slice(i, i + 8));
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sliderRef.current) return;
    if (!slides.length) return;

    let raf1 = 0;
    let raf2 = 0;
    let retryTimer = 0;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;

      if (!window.Swiper) {
        retryTimer = window.setTimeout(init, 100);
        return;
      }

      const sliderEl = sliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.popular-categories');
      if (!wrapper) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = wrapper.querySelector('.popular-categories__nav-prev');
      const nextBtn = wrapper.querySelector('.popular-categories__nav-next');
      const pagination = wrapper.querySelector('.popular-categories__pagination');

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      if (slideCount <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
        return;
      }

      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (pagination) pagination.style.display = '';

      swiperRef.current = new window.Swiper(sliderEl, {
        loop: slideCount > 1,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 600,
        watchOverflow: true,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        pagination: {
          el: pagination,
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        },
      });
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(init);
    });

    return () => {
      cancelled = true;

      if (retryTimer) window.clearTimeout(retryTimer);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <section className="popular-category">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Популярные категории</h2>

            <div className="popular-categories">
              <div ref={sliderRef} className="home-categories-inner swiper">
                <div className="swiper-wrapper">
                  {slides.map((slideCategories, slideIndex) => (
                    <div key={slideIndex} className="swiper-slide popular-categories-item">
                      {slideCategories.map((category, itemIndex) => {
                        const isPriority = slideIndex === 0 && itemIndex < 2;

                        return (
                          <Link
                            key={category.id}
                            href={category.url}
                            className="categories-item-card"
                          >
                            <div className="categories-card-img">
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={120}
                                height={120}
                                priority={isPriority}
                                loading={isPriority ? undefined : 'lazy'}
                                onError={(e) => {
                                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                                }}
                                style={{ width: '100%', height: 'auto' }}
                              />
                            </div>

                            <p>{category.name}</p>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {slides.length > 1 && (
                <>
                  <button
                    className="popular-categories__nav popular-categories__nav-prev"
                    type="button"
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
                    className="popular-categories__nav popular-categories__nav-next"
                    type="button"
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}