// components/home/AdsBannerSlider.js
'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';

function flattenSlides(slides) {
  return slides.flatMap((slideBanners) => slideBanners || []);
}

export default function AdsBannerSlider({ slides = [] }) {
  const desktopSliderRef = useRef(null);
  const mobileSliderRef = useRef(null);
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);

  const mobileSlides = useMemo(() => flattenSlides(slides), [slides]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!desktopSliderRef.current) return;
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

      const sliderEl = desktopSliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.ads-banner-slider--desktop');
      if (!wrapper) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const prevBtn = wrapper.querySelector('.ads-banner-slider__nav-prev');
      const nextBtn = wrapper.querySelector('.ads-banner-slider__nav-next');
      const pagination = wrapper.querySelector('.ads-banner-slider__pagination');

      if (desktopSwiperRef.current) {
        desktopSwiperRef.current.destroy(true, true);
        desktopSwiperRef.current = null;
      }

      if (slideCount < 2) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
        return;
      }

      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (pagination) pagination.style.display = '';

      desktopSwiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: slideCount > 1,
        speed: 600,
        watchOverflow: true,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        pagination: {
          el: pagination,
          clickable: true,
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

      if (desktopSwiperRef.current) {
        desktopSwiperRef.current.destroy(true, true);
        desktopSwiperRef.current = null;
      }
    };
  }, [slides]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mobileSliderRef.current) return;
    if (!mobileSlides.length) return;

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

      const sliderEl = mobileSliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.ads-banner-slider--mobile');
      if (!wrapper) return;

      const slideCount = sliderEl.querySelectorAll('.swiper-slide').length;
      const pagination = wrapper.querySelector('.ads-banner-slider__pagination');

      if (mobileSwiperRef.current) {
        mobileSwiperRef.current.destroy(true, true);
        mobileSwiperRef.current = null;
      }

      if (slideCount < 2) {
        if (pagination) pagination.style.display = 'none';
        return;
      }

      if (pagination) pagination.style.display = '';

      mobileSwiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 1.06,
        spaceBetween: 8,
        loop: false,
        speed: 500,
        watchOverflow: true,
        pagination: {
          el: pagination,
          clickable: true,
        },
        breakpoints: {
          320: {
            slidesPerView: 1.06,
            spaceBetween: 8,
          },
          360: {
            slidesPerView: 1.06,
            spaceBetween: 8,
          },
          576: {
            slidesPerView: 1.05,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 1.04,
            spaceBetween: 8,
          },
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

      if (mobileSwiperRef.current) {
        mobileSwiperRef.current.destroy(true, true);
        mobileSwiperRef.current = null;
      }
    };
  }, [mobileSlides]);

  if (!slides.length) return null;

  return (
    <section className="ads-banner">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="ads-banner-slider ads-banner-slider--desktop">
              <div ref={desktopSliderRef} className="ads-banner-inner swiper">
                <div className="swiper-wrapper">
                  {slides.map((slideBanners, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="ads-banner-item">
                        {slideBanners.map((banner) => (
                          <Link key={banner.id} href={banner.link}>
                            <img
                              src={banner.image}
                              alt="Рекламный баннер"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
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
                    className="ads-banner-slider__nav ads-banner-slider__nav-prev"
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
                    className="ads-banner-slider__nav ads-banner-slider__nav-next"
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

                  <div className="ads-banner-slider__pagination" />
                </>
              )}
            </div>

            <div className="ads-banner-slider ads-banner-slider--mobile">
              <div ref={mobileSliderRef} className="ads-banner-mobile-inner swiper">
                <div className="swiper-wrapper">
                  {mobileSlides.map((banner, index) => (
                    <div key={`${banner.id}-${index}`} className="swiper-slide">
                      <Link href={banner.link} className="ads-banner-mobile-item">
                        <img
                          src={banner.image}
                          alt="Рекламный баннер"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {mobileSlides.length > 1 && (
                <div className="ads-banner-slider__pagination" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}