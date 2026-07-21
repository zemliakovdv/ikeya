'use client';

import { useEffect, useRef } from 'react';
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

export default function HorizontalBannerSlider({ slides = [] }) {
  const sliderRef = useRef(null);
  const swiperRef = useRef(null);
  const hasMultipleSlides = slides.length > 1;

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

      const wrapper = sliderEl.closest('.horizontal-banner-slider');
      if (!wrapper) return;

      const prevBtn = wrapper.querySelector('.horizontal-banner__nav-prev');
      const nextBtn = wrapper.querySelector('.horizontal-banner__nav-next');
      const pagination = wrapper.querySelector('.horizontal-banner__pagination');

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      swiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 12,
        loop: hasMultipleSlides,
        speed: 600,
        watchOverflow: true,
        navigation: hasMultipleSlides
          ? {
              nextEl: nextBtn,
              prevEl: prevBtn,
            }
          : false,
        pagination: hasMultipleSlides
          ? {
              el: pagination,
              clickable: true,
            }
          : false,
        breakpoints: {
          993: {
            spaceBetween: 0,
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
  }, [hasMultipleSlides, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="horizontal-banner">
      <div className="container">
        <div className="horizontal-banner-slider">
          <div ref={sliderRef} className="horizontal-banner-inner swiper">
            <div className="swiper-wrapper">
              {slides.map((slide, index) => (
                <div key={slide.slotKey || slide.id || index} className="swiper-slide">
                  <div className="horizontal-banner-item">
                    <BannerLink href={slide.link}>
                      <picture>
                        <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                        <source media="(max-width: 1199px)" srcSet={slide.tabletImage} />
                        <img
                          src={slide.desktopImage}
                          alt={`Горизонтальный баннер ${index + 1}`}
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

          {hasMultipleSlides && (
            <>
              <button
                className="horizontal-banner__nav horizontal-banner__nav-prev"
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
                className="horizontal-banner__nav horizontal-banner__nav-next"
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

              <div className="horizontal-banner__pagination" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
