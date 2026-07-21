'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function isExternalHref(href) {
  return /^https:\/\//i.test(String(href || ''));
}

function BannerLink({ href, children }) {
  const safeHref = href || '/catalog';

  if (isExternalHref(safeHref)) {
    return <a href={safeHref}>{children}</a>;
  }

  return <Link href={safeHref}>{children}</Link>;
}

export default function AdvertisingBannerSlider({ slides = [] }) {
  const sliderRef = useRef(null);
  const swiperRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const hasControls = slides.length > visibleCount;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateVisibleCount = () => {
      setVisibleCount(window.matchMedia('(min-width: 1200px)').matches ? 2 : 1);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => {
      window.removeEventListener('resize', updateVisibleCount);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!sliderRef.current) return undefined;
    if (!slides.length) return undefined;

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

      const wrapper = sliderEl.closest('.advertising-banners-slider');
      if (!wrapper) return;

      const prevBtn = wrapper.querySelector('.advertising-banners__nav-prev');
      const nextBtn = wrapper.querySelector('.advertising-banners__nav-next');
      const pagination = wrapper.querySelector('.advertising-banners__pagination');

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      swiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 12,
        watchOverflow: true,
        loop: false,
        speed: 600,
        navigation: hasControls
          ? {
              nextEl: nextBtn,
              prevEl: prevBtn,
            }
          : false,
        pagination: slides.length > 1
          ? {
              el: pagination,
              clickable: true,
            }
          : false,
        breakpoints: {
          1200: {
            slidesPerView: 2,
            spaceBetween: 24,
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

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [hasControls, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="advertising-banners">
      <div className="container">
        <div className="advertising-banners-slider">
          <div ref={sliderRef} className="advertising-banners-inner swiper">
            <div className="swiper-wrapper">
              {slides.map((slide, index) => (
                <div key={slide.id || `${slide.position}-${index}`} className="swiper-slide">
                  <div className="advertising-banner-item">
                    <BannerLink href={slide.link}>
                      <picture>
                        <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                        <source media="(max-width: 1199px)" srcSet={slide.tabletImage} />
                        <img
                          src={slide.desktopImage}
                          alt={`Рекламный баннер ${index + 1}`}
                          width="1500"
                          height="256"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      </picture>
                    </BannerLink>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hasControls && (
            <>
              <button
                className="advertising-banners__nav advertising-banners__nav-prev"
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
                className="advertising-banners__nav advertising-banners__nav-next"
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
            </>
          )}

          {slides.length > 1 && <div className="advertising-banners__pagination" />}
        </div>
      </div>
    </section>
  );
}
