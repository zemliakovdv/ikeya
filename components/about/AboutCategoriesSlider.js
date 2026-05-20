// components/about/AboutCategoriesSlider.js
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

export default function AboutCategoriesSlider({ categories = [] }) {
  const rootRef = useRef(null);
  const swiperRef = useRef(null);
  const retryTimerRef = useRef(0);
  const raf1Ref = useRef(0);
  const raf2Ref = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!categories.length) return;

    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
    if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

    const init = () => {
      if (!window.Swiper) {
        retryTimerRef.current = window.setTimeout(init, 100);
        return;
      }

      const root = rootRef.current;
      if (!root) return;

      const sliderEl = root.querySelector('.about-categories-inner');
      if (!sliderEl) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = root.querySelector('.popular-categories__nav-prev');
      const nextBtn = root.querySelector('.popular-categories__nav-next');
      const paginationEl = root.querySelector('.popular-categories__pagination');

      if (slideCount <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (paginationEl) paginationEl.style.display = 'none';
        return;
      }

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      swiperRef.current = new window.Swiper(sliderEl, {
        loop: slideCount > 1,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 600,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        pagination: {
          el: paginationEl,
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        },
      });
    };

    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(init);
    });

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [categories]);

  if (!categories.length) return null;

  const slides = [];
  for (let i = 0; i < categories.length; i += 6) {
    slides.push(categories.slice(i, i + 6));
  }

  const hasMultipleSlides = slides.length > 1;

  return (
    <div className="popular-categories" ref={rootRef}>
      <div className="about-categories-inner swiper">
        <div className="swiper-wrapper">
          {slides.map((slideCategories, slideIndex) => (
            <div key={slideIndex} className="swiper-slide popular-categories-item">
              {slideCategories.map((category) => (
                <Link
                  key={category.id}
                  href={category.url || '#'}
                  className="categories-item-card"
                >
                  <div className="categories-card-img">
                    <Image
                      src={category.image || PLACEHOLDER_IMAGE}
                      alt={category.name || 'Категория'}
                      width={120}
                      height={120}
                      priority={slideIndex === 0}
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                  <p>{category.name}</p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides && (
        <>
          <button
            className="popular-categories__nav popular-categories__nav-prev"
            type="button"
            aria-label="Предыдущие категории"
          >
            <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            className="popular-categories__nav popular-categories__nav-next"
            type="button"
            aria-label="Следующие категории"
          >
            <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="popular-categories__pagination" />
        </>
      )}
    </div>
  );
}