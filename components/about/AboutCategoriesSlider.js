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

      const sliderEl = root.querySelector('.about-categories-slider__swiper');
      if (!sliderEl) return;

      const slideCount = sliderEl.querySelectorAll('.about-categories-slider__slide').length;
      const prevBtn = root.querySelector('.about-categories-slider__nav-prev');
      const nextBtn = root.querySelector('.about-categories-slider__nav-next');
      const paginationEl = root.querySelector('.about-categories-slider__pagination');

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
        loop: false,
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 8,
        speed: 600,
        watchOverflow: true,
        breakpoints: {
          576: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 16,
          },
          992: {
            slidesPerView: 6,
            slidesPerGroup: 6,
            spaceBetween: 16,
          },
          1200: {
            slidesPerView: 6,
            slidesPerGroup: 6,
            spaceBetween: 24,
          },
        },
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

  const hasMultipleSlides = categories.length > 1;

  return (
    <div className="about-categories-slider" ref={rootRef}>
      <div className="about-categories-slider__swiper swiper">
        <div className="swiper-wrapper">
          {categories.map((category, index) => (
            <div key={category.id} className="swiper-slide about-categories-slider__slide">
              <Link href={category.url || '#'} className="about-categories-slider__card">
                <div className="about-categories-slider__image">
                  <Image
                    src={category.image || PLACEHOLDER_IMAGE}
                    alt={category.name || 'Категория'}
                    width={120}
                    height={120}
                    priority={index === 0}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <p className="about-categories-slider__title">{category.name}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides && (
        <>
          <button
            className="about-categories-slider__nav-prev"
            type="button"
            aria-label="Предыдущие категории"
          >
            <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            className="about-categories-slider__nav-next"
            type="button"
            aria-label="Следующие категории"
          >
            <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="about-categories-slider__pagination swiper-pagination" />
        </>
      )}
    </div>
  );
}
