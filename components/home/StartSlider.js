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

export default function StartSlider({ slides = [] }) {
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
    let idleId = 0;
    let deferTimer = 0;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;

      if (!window.Swiper) {
        retryTimer = window.setTimeout(init, 100);
        return;
      }

      const sliderEl = sliderRef.current;
      if (!sliderEl) return;

      const wrapper = sliderEl.closest('.start-slider-inner');
      if (!wrapper) return;

      const prevBtn = wrapper.querySelector('.start-slider__nav-prev');
      const nextBtn = wrapper.querySelector('.start-slider__nav-next');
      const pagination = wrapper.querySelector('.start-slider__pagination');

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      swiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 0,
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
      });
    };

    const scheduleInit = () => {
      if (cancelled) return;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(init);
      });
    };

    const scheduleDeferredInit = () => {
      if (cancelled) return;

      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(scheduleInit, { timeout: 2000 });
      } else {
        deferTimer = window.setTimeout(scheduleInit, 300);
      }
    };

    if (document.readyState === 'complete') {
      scheduleDeferredInit();
    } else {
      window.addEventListener('load', scheduleDeferredInit, { once: true });
    }

    return () => {
      cancelled = true;

      window.removeEventListener('load', scheduleDeferredInit);
      if (retryTimer) window.clearTimeout(retryTimer);
      if (deferTimer) window.clearTimeout(deferTimer);
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
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
    <section className="start-slider">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="start-slider-inner">
              <div ref={sliderRef} className="swiper start-slider__swiper">
                <div className="swiper-wrapper">
                  {slides.map((slide, index) => {
                    const isLcpImage = index === 0;

                    return (
                      <div className="swiper-slide" key={slide.slotKey || slide.id || index}>
                        <div className="start-slider__media">
                          <BannerLink href={slide.link}>
                            <picture>
                              <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                              <source media="(max-width: 1199px)" srcSet={slide.tabletImage} />
                              <img
                                src={slide.desktopImage}
                                alt={`Баннер ${index + 1}`}
                                width="1500"
                                height="516"
                                loading={isLcpImage ? 'eager' : 'lazy'}
                                fetchPriority={isLcpImage ? 'high' : 'low'}
                              />
                            </picture>
                          </BannerLink>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {hasMultipleSlides && (
                <>
                  <div className="start-slider__pagination" />

                  <button
                    className="start-slider__nav-prev"
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
                    className="start-slider__nav-next"
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
